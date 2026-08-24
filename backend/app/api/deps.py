from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_jwt_token
from app.core.permissions import CurrentUserProvider, RoleChecker, CentreAccessChecker, FarmerOwnershipChecker
from app.repositories.repositories import UserRepository, FarmerRepository, BookingRepository, PaymentRepository, AuditRepository
from app.services.services import AuthService, BookingService, QualityService, WeighmentService, PaymentService, AuditService

async def get_current_user(authorization: Optional[str] = Header(None)) -> CurrentUserProvider:
    if not authorization or not authorization.startswith("Bearer "):
        # For development ease, fallback to demo farmer if token is absent
        return CurrentUserProvider(user_id="usr-f1", role="FARMER", farmer_id="F-TN-2026-8841", centre_id="cnt-a")
    
    token = authorization.split(" ")[1]
    payload = decode_jwt_token(token)
    return CurrentUserProvider(
        user_id=payload.get("sub"),
        role=payload.get("role"),
        centre_id=payload.get("centre_id"),
        farmer_id=payload.get("farmer_id")
    )

def require_roles(allowed_roles: list[str]):
    def dependency(current_user: CurrentUserProvider = Depends(get_current_user)):
        RoleChecker(allowed_roles).verify(current_user)
        return current_user
    return dependency

# Repository Injection Providers
def get_user_repo(db: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(db)

def get_farmer_repo(db: AsyncSession = Depends(get_db)) -> FarmerRepository:
    return FarmerRepository(db)

def get_booking_repo(db: AsyncSession = Depends(get_db)) -> BookingRepository:
    return BookingRepository(db)

def get_payment_repo(db: AsyncSession = Depends(get_db)) -> PaymentRepository:
    return PaymentRepository(db)

def get_audit_repo(db: AsyncSession = Depends(get_db)) -> AuditRepository:
    return AuditRepository(db)

# Service Injection Providers
def get_audit_service(audit_repo: AuditRepository = Depends(get_audit_repo)) -> AuditService:
    return AuditService(audit_repo)

def get_booking_service(booking_repo: BookingRepository = Depends(get_booking_repo), audit_service: AuditService = Depends(get_audit_service)) -> BookingService:
    return BookingService(booking_repo, audit_service)

def get_quality_service(booking_repo: BookingRepository = Depends(get_booking_repo), booking_service: BookingService = Depends(get_booking_service)) -> QualityService:
    return QualityService(booking_repo, booking_service)

def get_weighment_service(booking_repo: BookingRepository = Depends(get_booking_repo), booking_service: BookingService = Depends(get_booking_service)) -> WeighmentService:
    return WeighmentService(booking_repo, booking_service)

def get_payment_service(payment_repo: PaymentRepository = Depends(get_payment_repo), booking_repo: BookingRepository = Depends(get_booking_repo), audit_service: AuditService = Depends(get_audit_service)) -> PaymentService:
    return PaymentService(payment_repo, booking_repo, audit_service)
