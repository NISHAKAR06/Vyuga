from fastapi import APIRouter, Depends
from app.schemas.common import ApiResponseEnvelope
from app.schemas.booking import QualityRecordRequest, WeighmentRecordRequest
from app.api.deps import get_current_user, get_quality_service, get_weighment_service, CurrentUserProvider
from app.services.services import QualityService, WeighmentService

router = APIRouter(tags=["Quality & Weighbridge Inspection"])

@router.post("/quality/{booking_id}", response_model=ApiResponseEnvelope[dict])
async def record_quality(
    booking_id: str,
    request: QualityRecordRequest,
    current_user: CurrentUserProvider = Depends(get_current_user),
    quality_service: QualityService = Depends(get_quality_service)
):
    await quality_service.record_quality(
        booking_id=booking_id,
        grade=request.grade,
        moisture_pct=request.moisture_percentage,
        officer_id=current_user.user_id
    )
    return ApiResponseEnvelope(success=True, message="Quality assessment recorded successfully.")

@router.post("/weighments/{booking_id}", response_model=ApiResponseEnvelope[dict])
async def record_weighment(
    booking_id: str,
    request: WeighmentRecordRequest,
    current_user: CurrentUserProvider = Depends(get_current_user),
    weighment_service: WeighmentService = Depends(get_weighment_service)
):
    await weighment_service.record_weighment(
        booking_id=booking_id,
        gross_kg=request.gross_weight_kg,
        tare_kg=request.tare_weight_kg,
        officer_id=current_user.user_id
    )
    return ApiResponseEnvelope(success=True, message="Weighbridge net weight recorded successfully.")
