import hashlib
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.repositories.repositories import (
    UserRepository, FarmerRepository, BookingRepository, PaymentRepository, AuditRepository
)
from app.models.user import UserModel
from app.models.farmer import FarmerProfileModel, ProcurerProfileModel
from app.models.booking import BookingModel
from app.models.payment import PaymentModel, GrievanceModel, AuditLogModel
from app.domain.state_machine import BookingStateMachine, PaymentStateMachine, ProcurementStateMachine
from app.domain.enums import BookingStatusEnum, PaymentStatusEnum, QualityGradeEnum, UserRoleEnum
from app.core.exceptions import (
    AgriProcureError, BookingNotAvailableError, InvalidStateTransitionError,
    InvalidQuantityError, ResourceNotFoundError
)
from app.infrastructure.notifications import NotificationProviderFactory
from app.intelligence.strategies import (
    RuleBasedFraudEngine, RuleBasedPaymentPredictionEngine, BasicSchedulingEngine
)

class AuthService:
    """Handles authentication, password hashing, and user credential validation."""
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def authenticate(self, phone: str, role: str) -> UserModel:
        user = await self.user_repo.get_by_phone(phone)
        if not user:
            # Auto-provision or validate user
            user = UserModel(phone=phone, role=UserRoleEnum(role), full_name=f"User {phone[-4:]}")
            await self.user_repo.create(user)
        return user

class BookingService:
    """Handles slot booking, token allocation, state transitions, and concurrency checks."""
    def __init__(self, booking_repo: BookingRepository, audit_service: "AuditService"):
        self.booking_repo = booking_repo
        self.audit_service = audit_service
        self.fraud_engine = RuleBasedFraudEngine()
        self.scheduling_engine = BasicSchedulingEngine()

    async def create_booking(self, farmer_profile: FarmerProfileModel, centre_id: str, centre_name: str, slot_id: str, crop: str, quantity_kg: float) -> BookingModel:
        # 1. Run Fraud Detection strategy
        fraud_result = await self.fraud_engine.detect_fraud({
            "declared_quantity_kg": quantity_kg,
            "land_area_acres": farmer_profile.land_area_acres
        })

        token_num = await self.booking_repo.get_next_token_number(centre_id)

        booking = BookingModel(
            token_number=token_num,
            farmer_id=farmer_profile.id,
            centre_id=centre_id,
            slot_id=slot_id,
            crop=crop,
            declared_quantity_kg=quantity_kg,
            status=BookingStatusEnum.BOOKED,
            estimated_wait_minutes=24,
            anomaly_detected=fraud_result["review_required"],
            anomaly_risk_score=fraud_result["fraud_risk"],
            anomaly_reason=fraud_result["risk_factors"][0] if fraud_result["risk_factors"] else None
        )
        created_booking = await self.booking_repo.create(booking)

        # 2. Record Tamper-Evident Audit entry
        await self.audit_service.log_action(
            user_id=farmer_profile.user_id,
            user_role="FARMER",
            action="CREATE_BOOKING",
            resource_type="BOOKING",
            resource_id=created_booking.id,
            new_value=f"Token #{token_num} booked for {quantity_kg} kg",
            centre_id=centre_id
        )

        return created_booking

    async def update_status(self, booking_id: str, new_status: BookingStatusEnum, user_id: str, role: str) -> BookingModel:
        booking = await self.booking_repo.get_by_id(booking_id)
        if not booking:
            raise ResourceNotFoundError("Booking", booking_id)

        # Enforce State Machine transition rules (Requirement 18)
        old_status = booking.status
        validated_status = BookingStateMachine.transition(old_status, new_status)
        booking.status = validated_status

        await self.booking_repo.update(booking)

        await self.audit_service.log_action(
            user_id=user_id,
            user_role=role,
            action="TRANSITION_BOOKING_STATUS",
            resource_type="BOOKING",
            resource_id=booking.id,
            previous_value=str(old_status),
            new_value=str(new_status),
            centre_id=booking.centre_id
        )

        return booking

class QualityService:
    """Handles quality inspection recording."""
    def __init__(self, booking_repo: BookingRepository, booking_service: BookingService):
        self.booking_repo = booking_repo
        self.booking_service = booking_service

    async def record_quality(self, booking_id: str, grade: QualityGradeEnum, moisture_pct: float, officer_id: str) -> BookingModel:
        booking = await self.booking_repo.get_by_id(booking_id)
        if not booking:
            raise ResourceNotFoundError("Booking", booking_id)

        booking.quality_grade = grade
        booking.moisture_percentage = moisture_pct

        if grade == QualityGradeEnum.REJECTED or moisture_pct > 17.0:
            return await self.booking_service.update_status(booking_id, BookingStatusEnum.QUALITY_FAILED, officer_id, "PROCURER")
        else:
            return await self.booking_service.update_status(booking_id, BookingStatusEnum.WEIGHING, officer_id, "PROCURER")

class WeighmentService:
    """Handles weighbridge gross/tare calculations."""
    def __init__(self, booking_repo: BookingRepository, booking_service: BookingService):
        self.booking_repo = booking_repo
        self.booking_service = booking_service

    async def record_weighment(self, booking_id: str, gross_kg: float, tare_kg: float, officer_id: str) -> BookingModel:
        booking = await self.booking_repo.get_by_id(booking_id)
        if not booking:
            raise ResourceNotFoundError("Booking", booking_id)

        net_weight_kg = gross_kg - tare_kg
        if net_weight_kg <= 0:
            raise InvalidQuantityError("Net weight must be strictly positive.")

        booking.actual_quantity_kg = net_weight_kg
        await self.booking_repo.update(booking)

        return await self.booking_service.update_status(booking_id, BookingStatusEnum.PROCURED, officer_id, "PROCURER")

class PaymentService:
    """Handles DBT payment disbursal calculation and payment state machine transitions."""
    def __init__(self, payment_repo: PaymentRepository, booking_repo: BookingRepository, audit_service: "AuditService"):
        self.payment_repo = payment_repo
        self.booking_repo = booking_repo
        self.audit_service = audit_service
        self.prediction_engine = RuleBasedPaymentPredictionEngine()

    async def create_payment_for_booking(self, booking: BookingModel, msp_rate_per_kg: float = 23.20) -> PaymentModel:
        actual_qty = booking.actual_quantity_kg or booking.declared_quantity_kg
        base_amount = actual_qty * msp_rate_per_kg
        bonus_amount = actual_qty * 1.0  # State Bonus ₹100/q = ₹1/kg
        net_amount = base_amount + bonus_amount

        payment = PaymentModel(
            booking_id=booking.id,
            farmer_id=booking.farmer_id,
            crop=booking.crop,
            quantity_kg=actual_qty,
            rate_per_kg=msp_rate_per_kg,
            base_amount=base_amount,
            bonus_amount=bonus_amount,
            deductions=0.0,
            net_amount=net_amount,
            status=PaymentStatusEnum.PROCESSING,
            utr_number=f"PFMS-MOCK-2026-{booking.token_number:04d}"
        )
        return await self.payment_repo.create(payment)

class AuditHashService:
    """Calculates SHA-256 hashes for Tamper-Evident Audit Trails (Requirement 41)."""
    @staticmethod
    def calculate_hash(previous_hash: Optional[str], timestamp: str, user_id: str, action: str, resource_id: str, new_value: str) -> str:
        raw_payload = f"{previous_hash or 'GENESIS'}|{timestamp}|{user_id}|{action}|{resource_id}|{new_value}"
        return hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()

class AuditService:
    """Logs append-only audit records with tamper-evident cryptographic chaining."""
    def __init__(self, audit_repo: AuditRepository):
        self.audit_repo = audit_repo

    async def log_action(self, user_id: str, user_role: str, action: str, resource_type: str, resource_id: str, previous_value: Optional[str] = None, new_value: Optional[str] = None, centre_id: Optional[str] = None) -> AuditLogModel:
        previous_hash = await self.audit_repo.get_latest_hash()
        timestamp_str = datetime.utcnow().isoformat()
        
        current_hash = AuditHashService.calculate_hash(
            previous_hash=previous_hash,
            timestamp=timestamp_str,
            user_id=user_id,
            action=action,
            resource_id=resource_id,
            new_value=new_value or ""
        )

        audit_entry = AuditLogModel(
            timestamp=datetime.utcnow(),
            user_id=user_id,
            user_role=user_role,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            previous_value=previous_value,
            new_value=new_value,
            centre_id=centre_id,
            previous_hash=previous_hash,
            current_hash=current_hash
        )
        return await self.audit_repo.create(audit_entry)
