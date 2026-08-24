from sqlalchemy import Column, String, Integer, Float, DateTime, Enum as SQLEnum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base
from app.domain.enums import BookingStatusEnum, QualityGradeEnum

class BookingModel(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    token_number = Column(Integer, index=True, nullable=False)
    farmer_id = Column(String, ForeignKey("farmer_profiles.id"), nullable=False)
    centre_id = Column(String, ForeignKey("procurement_centres.id"), nullable=False)
    slot_id = Column(String, ForeignKey("slots.id"), nullable=False)
    crop = Column(String, nullable=False)
    crop_variety = Column(String, nullable=True)
    declared_quantity_kg = Column(Float, nullable=False)
    actual_quantity_kg = Column(Float, nullable=True)
    moisture_percentage = Column(Float, nullable=True)
    quality_grade = Column(SQLEnum(QualityGradeEnum), nullable=True)
    status = Column(SQLEnum(BookingStatusEnum), default=BookingStatusEnum.BOOKED, nullable=False)
    estimated_wait_minutes = Column(Integer, default=0)
    counter_assigned = Column(String, nullable=True)
    
    # Anomaly metadata
    anomaly_detected = Column(Boolean, default=False)
    anomaly_risk_score = Column(Float, default=0)
    anomaly_reason = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    farmer = relationship("FarmerProfileModel", back_populates="bookings")
    centre = relationship("ProcurementCentreModel", back_populates="bookings")
    slot = relationship("SlotModel", back_populates="bookings")
    payment = relationship("PaymentModel", back_populates="booking", uselist=False)
