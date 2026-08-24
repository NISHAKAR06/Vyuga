from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class ProcurementCentreModel(Base):
    __tablename__ = "procurement_centres"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False)
    district = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False)
    capacity_per_day_kg = Column(Float, nullable=False)
    active_counters = Column(Integer, default=4)
    address = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    procurers = relationship("ProcurerProfileModel", back_populates="centre")
    slots = relationship("SlotModel", back_populates="centre")
    bookings = relationship("BookingModel", back_populates="centre")

class CropModel(Base):
    __tablename__ = "crops"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    variety = Column(String, nullable=False)
    msp_per_quintal = Column(Float, nullable=False)
    season = Column(String, nullable=False)
    expected_yield_per_acre_kg = Column(Float, nullable=False)
