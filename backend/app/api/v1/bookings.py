from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.common import ApiResponseEnvelope
from app.schemas.booking import BookingCreate, BookingResponse
from app.api.deps import get_current_user, get_booking_service, CurrentUserProvider
from app.services.services import BookingService
from app.models.farmer import FarmerProfileModel
from app.domain.enums import BookingStatusEnum
from app.core.permissions import FarmerOwnershipChecker

router = APIRouter(prefix="/bookings", tags=["Bookings"])

MOCK_BOOKINGS = [
    {
        "id": "tok-47",
        "token_number": 47,
        "farmer_id": "F-TN-2026-8841",
        "farmer_name": "R. Murugesan",
        "centre_id": "cnt-a",
        "centre_name": "Centre A – Thanjavur Mandi",
        "slot_id": "s2",
        "slot_date": "2026-08-26",
        "slot_time_window": "10:00 – 11:00",
        "crop": "Paddy",
        "declared_quantity_kg": 3000,
        "status": "Booked",
        "estimated_wait_minutes": 24,
        "counter_assigned": "Counter 1"
    }
]

@router.post("", response_model=ApiResponseEnvelope[dict])
async def create_booking(
    request: BookingCreate,
    current_user: CurrentUserProvider = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    # Dummy farmer profile container for service call
    farmer_profile = FarmerProfileModel(
        id=current_user.farmer_id or "F-TN-2026-8841",
        user_id=current_user.user_id,
        farmer_code="F-8841",
        name="R. Murugesan",
        phone="+91 98421 76540",
        location="Thiruvaiyaru",
        district="Thanjavur",
        state="Tamil Nadu",
        land_area_acres=3.5
    )
    
    booking = await booking_service.create_booking(
        farmer_profile=farmer_profile,
        centre_id=request.centre_id,
        centre_name="Centre A – Thanjavur Mandi",
        slot_id=request.slot_id,
        crop=request.crop,
        quantity_kg=request.quantity_kg
    )

    return ApiResponseEnvelope(
        success=True,
        data={
            "id": booking.id,
            "token_number": booking.token_number,
            "status": booking.status.value if hasattr(booking.status, 'value') else str(booking.status),
            "estimated_wait_minutes": booking.estimated_wait_minutes
        },
        message="Slot successfully booked. Token generated."
    )

@router.get("/my", response_model=ApiResponseEnvelope[List[dict]])
async def get_my_bookings(current_user: CurrentUserProvider = Depends(get_current_user)):
    return ApiResponseEnvelope(success=True, data=MOCK_BOOKINGS)

@router.get("/{booking_id}", response_model=ApiResponseEnvelope[dict])
async def get_booking_by_id(booking_id: str, current_user: CurrentUserProvider = Depends(get_current_user)):
    booking = MOCK_BOOKINGS[0]
    # Enforce Farmer Ownership check (Requirement 16)
    FarmerOwnershipChecker.verify_ownership(current_user, booking["farmer_id"])
    return ApiResponseEnvelope(success=True, data=booking)

@router.post("/{booking_id}/cancel", response_model=ApiResponseEnvelope[dict])
async def cancel_booking(
    booking_id: str,
    current_user: CurrentUserProvider = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    await booking_service.update_status(booking_id, BookingStatusEnum.CANCELLED, current_user.user_id, current_user.role)
    return ApiResponseEnvelope(success=True, message="Booking cancelled successfully.")
