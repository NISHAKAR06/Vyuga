from sqlalchemy import Column, String, Integer, Float, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base
from app.domain.enums import PaymentStatusEnum, GrievanceStatusEnum

class PaymentModel(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String, ForeignKey("bookings.id"), unique=True, nullable=False)
    farmer_id = Column(String, ForeignKey("farmer_profiles.id"), nullable=False)
    crop = Column(String, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    rate_per_kg = Column(Float, nullable=False)
    base_amount = Column(Float, nullable=False)
    bonus_amount = Column(Float, default=0.0)
    deductions = Column(Float, default=0.0)
    net_amount = Column(Float, nullable=False)
    status = Column(SQLEnum(PaymentStatusEnum), default=PaymentStatusEnum.PENDING, nullable=False)
    utr_number = Column(String, nullable=True)
    initiated_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    booking = relationship("BookingModel", back_populates="payment")

class GrievanceModel(Base):
    __tablename__ = "grievances"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    farmer_id = Column(String, ForeignKey("farmer_profiles.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(SQLEnum(GrievanceStatusEnum), default=GrievanceStatusEnum.OPEN, nullable=False)
    resolution_notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class NotificationModel(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, default="info")
    read = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    user_id = Column(String, nullable=False)
    user_role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)
    resource_id = Column(String, nullable=False)
    previous_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    centre_id = Column(String, nullable=True)
    
    # Tamper-Evident SHA-256 Hashing fields (Requirement 41)
    previous_hash = Column(String, nullable=True)
    current_hash = Column(String, nullable=False)
