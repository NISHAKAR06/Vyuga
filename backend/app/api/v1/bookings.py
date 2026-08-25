from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.schemas.common import ApiResponseEnvelope
from app.schemas.booking import BookingCreate, BookingResponse
from app.api.deps import get_current_user, get_booking_service, get_db, CurrentUserProvider
from app.services.services import BookingService
from app.models.farmer import FarmerProfileModel
from app.domain.enums import BookingStatusEnum
from app.core.permissions import FarmerOwnershipChecker, CentreAccessChecker
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from app.models.booking import BookingModel
from app.models.centre import ProcurementCentreModel
from app.models.payment import AuditLogModel

router = APIRouter(prefix="/bookings", tags=["Bookings"])

async def get_booking_prediction(db: AsyncSession, booking: BookingModel) -> dict:
    """
    Computes dynamic queue attributes and runs the ML waiting time prediction.
    """
    from app.intelligence.strategies import MLWaitingTimeQueueEngine
    from datetime import datetime
    
    if booking.status not in (BookingStatusEnum.BOOKED, BookingStatusEnum.ARRIVED, BookingStatusEnum.WAITING):
        return {
            "estimated_wait_minutes": 0,
            "farmers_ahead": 0,
            "currently_waiting": 0,
            "currently_processing": 0,
            "active_counters": 4
        }
        
    centre_id = booking.centre_id
    
    # 1. Fetch Centre active counters
    centre_res = await db.execute(
        select(ProcurementCentreModel).filter(ProcurementCentreModel.id == centre_id)
    )
    centre = centre_res.scalars().first()
    active_counters = centre.active_counters if centre else 4
    
    # 2. Fetch all bookings for this centre to calculate positions
    bookings_res = await db.execute(
        select(BookingModel)
        .filter(BookingModel.centre_id == centre_id)
        .order_by(BookingModel.token_number.asc())
    )
    all_bookings = bookings_res.scalars().all()
    
    in_queue_bookings = [b for b in all_bookings if b.status in (
        BookingStatusEnum.BOOKED, BookingStatusEnum.ARRIVED, BookingStatusEnum.WAITING
    )]
    currently_processing = sum(1 for b in all_bookings if b.status in (
        BookingStatusEnum.PROCESSING, BookingStatusEnum.QUALITY_CHECK, BookingStatusEnum.WEIGHING
    ))
    
    # Farmers ahead of this specific booking
    farmers_ahead = sum(1 for qb in in_queue_bookings if qb.token_number < booking.token_number)
    
    # 3. Calculate average processing duration from Audit Logs
    logs_res = await db.execute(
        select(AuditLogModel)
        .filter(AuditLogModel.centre_id == centre_id, AuditLogModel.resource_type == "BOOKING")
        .order_by(AuditLogModel.timestamp.asc())
    )
    logs = logs_res.scalars().all()
    
    # Track timestamps for transitions
    from collections import defaultdict
    booking_times = defaultdict(dict)
    for log in logs:
        if "PROCESSING" in str(log.new_value):
            booking_times[log.resource_id]['start'] = log.timestamp
        if any(status in str(log.new_value) for status in ("PROCURED", "QUALITY_FAILED")):
            booking_times[log.resource_id]['end'] = log.timestamp
            
    durations = []
    for b_id, times in booking_times.items():
        if 'start' in times and 'end' in times:
            duration = (times['end'] - times['start']).total_seconds() / 60.0
            if duration > 0:
                durations.append(duration)
                
    avg_processing_time = sum(durations) / len(durations) if durations else 8.0
    avg_processing_time = round(max(3.0, min(avg_processing_time, 20.0)), 1)
    
    # 4. Run ML model
    now = datetime.now()
    engine = MLWaitingTimeQueueEngine()
    features = {
        "type": "features",
        "farmers_ahead": farmers_ahead,
        "currently_waiting": len(in_queue_bookings),
        "currently_processing": currently_processing,
        "active_counters": active_counters,
        "average_processing_time": avg_processing_time,
        "hour": now.hour,
        "day_of_week": now.weekday()
    }
    res_analysis = await engine.analyze_queue([features])
    pred_wait = res_analysis["predicted_wait_minutes"]
    
    return {
        "estimated_wait_minutes": pred_wait,
        "farmers_ahead": farmers_ahead,
        "currently_waiting": len(in_queue_bookings),
        "currently_processing": currently_processing,
        "active_counters": active_counters
    }

def map_booking_to_response(booking: BookingModel, prediction: dict) -> dict:
    status_str = "Booked"
    if booking.status in (BookingStatusEnum.ARRIVED, BookingStatusEnum.WAITING):
        status_str = "Arrived"
    elif booking.status in (BookingStatusEnum.PROCESSING, BookingStatusEnum.QUALITY_CHECK, BookingStatusEnum.WEIGHING):
        status_str = "Now Serving"
    elif booking.status in (BookingStatusEnum.PROCURED, BookingStatusEnum.PAID, BookingStatusEnum.PAYMENT_PROCESSING):
        status_str = "Completed"
    elif booking.status == BookingStatusEnum.NO_SHOW:
        status_str = "Absent"
        
    stage_str = "slot_selected"
    if booking.status == BookingStatusEnum.ARRIVED:
        stage_str = "at_centre"
    elif booking.status == BookingStatusEnum.WAITING:
        stage_str = "waiting"
    elif booking.status in (BookingStatusEnum.PROCESSING, BookingStatusEnum.QUALITY_CHECK, BookingStatusEnum.WEIGHING):
        stage_str = "verification"
    elif booking.status in (BookingStatusEnum.PROCURED, BookingStatusEnum.PAYMENT_PROCESSING):
        stage_str = "payment_processing"
    elif booking.status == BookingStatusEnum.PAID:
        stage_str = "payment_completed"
        
    return {
        "id": booking.id,
        "token_number": booking.token_number,
        "farmer_id": booking.farmer_id,
        "farmer_name": booking.farmer.name if booking.farmer else f"Farmer {booking.farmer_id[-4:]}",
        "centre_id": booking.centre_id,
        "centre_name": booking.centre.name if booking.centre else "",
        "slot_id": booking.slot_id,
        "slot_date": booking.slot.date if booking.slot else "2026-08-26",
        "slot_time_window": f"{booking.slot.start_time} – {booking.slot.end_time}" if booking.slot else "10:00 – 11:00",
        "crop": booking.crop,
        "declared_quantity_kg": booking.declared_quantity_kg,
        "actual_quantity_kg": booking.actual_quantity_kg,
        "status": status_str,
        "stage": stage_str,
        "estimated_wait_minutes": prediction["estimated_wait_minutes"],
        "farmers_ahead": prediction["farmers_ahead"],
        "counter_assigned": booking.counter_assigned
    }

@router.post("", response_model=ApiResponseEnvelope[dict])
async def create_booking(
    request: BookingCreate,
    current_user: CurrentUserProvider = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service),
    db: AsyncSession = Depends(get_db)
):
    # Retrieve actual farmer profile from DB or provision one
    farmer_profile_res = await db.execute(
        select(FarmerProfileModel).filter(FarmerProfileModel.user_id == current_user.user_id)
    )
    farmer_profile = farmer_profile_res.scalars().first()
    
    if not farmer_profile:
        # Fallback container
        farmer_profile = FarmerProfileModel(
            id=current_user.farmer_id or "F-TN-2026-8841",
            user_id=current_user.user_id,
            farmer_code="F-8841",
            name="R. Murugesan",
            phone="+91 98421 76540",
            location="Thiruvaiyaru, Thanjavur",
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

    # Re-fetch with relationships to calculate waiting time
    booking_res = await db.execute(
        select(BookingModel)
        .filter(BookingModel.id == booking.id)
        .options(
            joinedload(BookingModel.farmer),
            joinedload(BookingModel.centre),
            joinedload(BookingModel.slot)
        )
    )
    booking = booking_res.scalars().first()

    prediction = await get_booking_prediction(db, booking)
    booking.estimated_wait_minutes = prediction["estimated_wait_minutes"]
    db.add(booking)
    await db.commit()

    return ApiResponseEnvelope(
        success=True,
        data={
            "id": booking.id,
            "token_number": booking.token_number,
            "status": "Booked",
            "estimated_wait_minutes": booking.estimated_wait_minutes
        },
        message="Slot successfully booked. Token generated."
    )

@router.get("/my", response_model=ApiResponseEnvelope[List[dict]])
async def get_my_bookings(
    current_user: CurrentUserProvider = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    farmer_id = current_user.farmer_id or "F-TN-2026-8841"
    bookings_res = await db.execute(
        select(BookingModel)
        .filter(BookingModel.farmer_id == farmer_id)
        .options(
            joinedload(BookingModel.farmer),
            joinedload(BookingModel.centre),
            joinedload(BookingModel.slot)
        )
        .order_by(BookingModel.token_number.desc())
    )
    bookings = bookings_res.scalars().all()
    
    res_list = []
    for b in bookings:
        pred = await get_booking_prediction(db, b)
        if b.estimated_wait_minutes != pred["estimated_wait_minutes"]:
            b.estimated_wait_minutes = pred["estimated_wait_minutes"]
            db.add(b)
        res_list.append(map_booking_to_response(b, pred))
        
    await db.commit()
    return ApiResponseEnvelope(success=True, data=res_list)

@router.get("/{booking_id}", response_model=ApiResponseEnvelope[dict])
async def get_booking_by_id(
    booking_id: str,
    current_user: CurrentUserProvider = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    booking_res = await db.execute(
        select(BookingModel)
        .filter(BookingModel.id == booking_id)
        .options(
            joinedload(BookingModel.farmer),
            joinedload(BookingModel.centre),
            joinedload(BookingModel.slot)
        )
    )
    booking = booking_res.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    # Enforce Farmer Ownership check / Centre access check (Requirement 16)
    FarmerOwnershipChecker.verify_ownership(current_user, booking.farmer_id)
    if current_user.role == "PROCURER":
        CentreAccessChecker.verify_centre_access(current_user, booking.centre_id)
        
    pred = await get_booking_prediction(db, booking)
    if booking.estimated_wait_minutes != pred["estimated_wait_minutes"]:
        booking.estimated_wait_minutes = pred["estimated_wait_minutes"]
        db.add(booking)
        await db.commit()
        
    return ApiResponseEnvelope(success=True, data=map_booking_to_response(booking, pred))

# New AI Waiting-Time Endpoint (Requirement 15)
@router.get("/{booking_id}/waiting-time", response_model=ApiResponseEnvelope[dict])
async def get_waiting_time(
    booking_id: str,
    current_user: CurrentUserProvider = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Specific endpoint to fetch AI wait-time prediction for a booking.
    """
    booking_res = await db.execute(
        select(BookingModel)
        .filter(BookingModel.id == booking_id)
        .options(joinedload(BookingModel.centre))
    )
    booking = booking_res.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    # Enforce Auth & RBAC Checks
    FarmerOwnershipChecker.verify_ownership(current_user, booking.farmer_id)
    if current_user.role == "PROCURER":
        CentreAccessChecker.verify_centre_access(current_user, booking.centre_id)
        
    try:
        prediction = await get_booking_prediction(db, booking)
        
        # Sync DB value
        if booking.estimated_wait_minutes != prediction["estimated_wait_minutes"]:
            booking.estimated_wait_minutes = prediction["estimated_wait_minutes"]
            db.add(booking)
            await db.commit()
            
        return ApiResponseEnvelope(
            success=True,
            data={
                "booking_id": booking.id,
                "predicted_waiting_time_minutes": prediction["estimated_wait_minutes"],
                "farmers_ahead": prediction["farmers_ahead"]
            }
        )
    except Exception as e:
        # Avoid leaking traceback to frontend (Requirement 20)
        raise HTTPException(
            status_code=500,
            detail="Waiting time is currently unavailable."
        )

@router.post("/{booking_id}/cancel", response_model=ApiResponseEnvelope[dict])
async def cancel_booking(
    booking_id: str,
    current_user: CurrentUserProvider = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    await booking_service.update_status(booking_id, BookingStatusEnum.CANCELLED, current_user.user_id, current_user.role)
    return ApiResponseEnvelope(success=True, message="Booking cancelled successfully.")
