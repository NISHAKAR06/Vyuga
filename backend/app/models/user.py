from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base
from app.domain.enums import UserRoleEnum

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)
    role = Column(SQLEnum(UserRoleEnum), nullable=False)
    full_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    farmer_profile = relationship("FarmerProfileModel", back_populates="user", uselist=False, cascade="all, delete-orphan")
    procurer_profile = relationship("ProcurerProfileModel", back_populates="user", uselist=False, cascade="all, delete-orphan")
    admin_profile = relationship("AdminProfileModel", back_populates="user", uselist=False, cascade="all, delete-orphan")
