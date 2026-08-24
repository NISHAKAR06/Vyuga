from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.schemas.common import ApiResponseEnvelope
from app.api.deps import get_current_user, get_booking_service, CurrentUserProvider
from app.core.permissions import CentreAccessChecker
from app.services.services import BookingService
from app.domain.enums import BookingStatusEnum

router = APIRouter(prefix="/queue", tags=["Queue Management"])

MOCK_QUEUE = [
    {
        "id": "tok-41",
        "tokenNumber": 41,
        "farmerName": "C. Palanivel",
        "farmerPhone": "+91 97891 22340",
        "farmerVillage": "Papanasam",
        "centreId": "cnt-a",
        "crop": "Paddy",
        "declaredQuantityKg": 2800,
        "stage": "verification",
        "status": "Now Serving",
        "counterAssigned": "Counter 1"
    },
    {
        "id": "tok-42",
        "tokenNumber": 42,
        "farmerName": "M. Shanmugam",
        "farmerPhone": "+91 94421 88321",
        "farmerVillage": "Orathanadu",
        "centreId": "cnt-a",
        "crop": "Paddy",
        "declaredQuantityKg": 3200,
        "stage": "at_centre",
        "status": "Arrived",
        "counterAssigned": None
    }
]

@router.get("/current", response_model=ApiResponseEnvelope[List[dict]])
async def get_current_queue(
    centre_id: str = Query("cnt-a"),
    current_user: CurrentUserProvider = Depends(get_current_user)
):
    # Enforce Centre Isolation (Requirement 15)
    CentreAccessChecker.verify_centre_access(current_user, centre_id)
    return ApiResponseEnvelope(success=True, data=MOCK_QUEUE)

@router.post("/{booking_id}/call", response_model=ApiResponseEnvelope[dict])
async def call_token(
    booking_id: str,
    current_user: CurrentUserProvider = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    await booking_service.update_status(booking_id, BookingStatusEnum.PROCESSING, current_user.user_id, current_user.role)
    return ApiResponseEnvelope(success=True, message=f"Token {booking_id} called to counter.")
