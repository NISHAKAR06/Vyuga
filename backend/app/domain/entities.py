from dataclasses import dataclass, field
from datetime import datetime, date
from typing import Optional, List
from app.domain.enums import UserRoleEnum, BookingStatusEnum, PaymentStatusEnum, QualityGradeEnum, AnomalyLevelEnum
from app.domain.value_objects import Money, Quantity, TimeWindow

@dataclass
class UserEntity:
    id: str
    phone: str
    role: UserRoleEnum
    is_active: bool = True
    full_name: Optional[str] = None
    email: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)

@dataclass
class FarmerProfileEntity:
    id: str
    user_id: str
    name: str
    phone: str
    location: str
    district: str
    state: str
    land_area_acres: float
    land_unit: str = "Acres"
    crop: Optional[str] = None
    aadhar_number: Optional[str] = None
    bank_account: Optional[str] = None
    ifsc_code: Optional[str] = None
    bank_name: Optional[str] = None

@dataclass
class ProcurerProfileEntity:
    id: str
    user_id: str
    name: str
    phone: str
    centre_id: str
    centre_name: str
    designation: str

@dataclass
class ProcurementCentreEntity:
    id: str
    name: str
    code: str
    district: str
    state: str
    capacity_per_day_kg: float
    active_counters: int
    address: str
    contact_number: str
    is_active: bool = True

@dataclass
class BookingEntity:
    id: str
    token_number: int
    farmer_id: str
    farmer_name: str
    centre_id: str
    centre_name: str
    slot_id: str
    slot_date: str
    slot_time_window: str
    crop: str
    declared_quantity_kg: float
    status: BookingStatusEnum
    estimated_wait_minutes: int = 0
    actual_quantity_kg: Optional[float] = None
    quality_grade: Optional[QualityGradeEnum] = None
    moisture_percentage: Optional[float] = None
    created_at: datetime = field(default_factory=datetime.utcnow)

@dataclass
class PaymentEntity:
    id: str
    booking_id: str
    token_number: int
    farmer_id: str
    farmer_name: str
    crop: str
    quantity_kg: float
    rate_per_kg: float
    base_amount: float
    bonus_amount: float
    deductions: float
    net_amount: float
    status: PaymentStatusEnum
    utr_number: Optional[str] = None
    initiated_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

@dataclass
class AuditRecordEntity:
    id: str
    timestamp: datetime
    user_id: str
    user_role: str
    action: str
    resource_type: str
    resource_id: str
    previous_value: Optional[str] = None
    new_value: Optional[str] = None
    centre_id: Optional[str] = None
    current_hash: Optional[str] = None
    previous_hash: Optional[str] = None
