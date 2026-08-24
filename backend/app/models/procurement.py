from sqlalchemy import Column, String, Float, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, date
import uuid
from app.core.database import Base
from app.domain.enums import ProcurementStatusEnum

class ProcurementAnnouncementModel(Base):
    __tablename__ = "procurement_announcements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    crop = Column(String, nullable=False)
    centre_id = Column(String, ForeignKey("procurement_centres.id"), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    msp_per_quintal = Column(Float, nullable=False)
    quantity_limit_kg = Column(Float, nullable=False)
    status = Column(SQLEnum(ProcurementStatusEnum), default=ProcurementStatusEnum.DRAFT, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SlotModel(Base):
    __tablename__ = "slots"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    centre_id = Column(String, ForeignKey("procurement_centres.id"), nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD
    start_time = Column(String, nullable=False)  # e.g. "09:00"
    end_time = Column(String, nullable=False)  # e.g. "10:00"
    max_capacity = Column(Float, nullable=False)
    booked_count = Column(Float, default=0)
    is_active = Column(DateTime, default=datetime.utcnow)

    centre = relationship("ProcurementCentreModel", back_populates="slots")
    bookings = relationship("BookingModel", back_populates="slot")
