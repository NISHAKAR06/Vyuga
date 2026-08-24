from pydantic import BaseModel, Field
from typing import Optional
from app.domain.enums import BookingStatusEnum, QualityGradeEnum, PaymentStatusEnum

class BookingCreate(BaseModel):
    centre_id: str
    slot_id: str
    crop: str
    quantity_kg: float = Field(..., gt=0)

class QualityRecordRequest(BaseModel):
    grade: QualityGradeEnum
    moisture_percentage: float = Field(..., ge=0, le=50)
    remarks: Optional[str] = None

class WeighmentRecordRequest(BaseModel):
    gross_weight_kg: float = Field(..., gt=0)
    tare_weight_kg: float = Field(..., ge=0)

class GrievanceCreate(BaseModel):
    title: str
    category: str
    description: str

class BookingResponse(BaseModel):
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
    actual_quantity_kg: Optional[float] = None
    moisture_percentage: Optional[float] = None
    quality_grade: Optional[str] = None
    status: str
    estimated_wait_minutes: int
    counter_assigned: Optional[str] = None

    class Config:
        from_attributes = True
