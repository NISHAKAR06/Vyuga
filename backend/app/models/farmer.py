from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class FarmerProfileModel(Base):
    __tablename__ = "farmer_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    farmer_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    location = Column(String, nullable=False)
    district = Column(String, nullable=False)
    state = Column(String, nullable=False)
    land_area_acres = Column(Float, nullable=False)
    land_unit = Column(String, default="Acres")
    crop = Column(String, nullable=True)
    aadhar_number = Column(String, nullable=True)
    bank_account = Column(String, nullable=True)
    ifsc_code = Column(String, nullable=True)
    bank_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="farmer_profile")
    bookings = relationship("BookingModel", back_populates="farmer")

class ProcurerProfileModel(Base):
    __tablename__ = "procurer_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    officer_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    centre_id = Column(String, ForeignKey("procurement_centres.id"), nullable=False)
    designation = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="procurer_profile")
    centre = relationship("ProcurementCentreModel", back_populates="procurers")

class AdminProfileModel(Base):
    __tablename__ = "admin_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    admin_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="admin_profile")
