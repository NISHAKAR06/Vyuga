from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Optional
from app.schemas.common import ApiResponseEnvelope
from app.api.deps import get_current_user, get_booking_service, get_db, CurrentUserProvider
from app.core.permissions import CentreAccessChecker
from app.services.services import BookingService
from app.domain.enums import BookingStatusEnum
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from app.models.booking import BookingModel
from app.models.centre import ProcurementCentreModel
from app.models.payment import AuditLogModel
from datetime import datetime

router = APIRouter(prefix="/queue", tags=["Queue Management"])

def map_status_to_frontend(status: BookingStatusEnum) -> str:
    mapping = {
        BookingStatusEnum.BOOKED: "Booked",
        BookingStatusEnum.ARRIVED: "Arrived",
        BookingStatusEnum.WAITING: "Arrived",
        BookingStatusEnum.PROCESSING: "Now Serving",
        BookingStatusEnum.QUALITY_CHECK: "Now Serving",
        BookingStatusEnum.WEIGHING: "Now Serving",
        BookingStatusEnum.PROCURED: "Completed",
        BookingStatusEnum.PAYMENT_PROCESSING: "Completed",
        BookingStatusEnum.PAID: "Completed",
        BookingStatusEnum.CANCELLED: "Completed",
        BookingStatusEnum.NO_SHOW: "Absent",
        BookingStatusEnum.QUALITY_FAILED: "Completed",
        BookingStatusEnum.PAYMENT_FAILED: "Completed"
    }
    return mapping.get(status, "Booked")

def map_status_to_stage(status: BookingStatusEnum) -> str:
    mapping = {
        BookingStatusEnum.BOOKED: "slot_selected",
        BookingStatusEnum.ARRIVED: "at_centre",
        BookingStatusEnum.WAITING: "waiting",
        BookingStatusEnum.PROCESSING: "verification",
        BookingStatusEnum.QUALITY_CHECK: "verification",
        BookingStatusEnum.WEIGHING: "verification",
        BookingStatusEnum.PROCURED: "procurement_completed",
        BookingStatusEnum.PAYMENT_PROCESSING: "payment_processing",
        BookingStatusEnum.PAID: "payment_completed",
        BookingStatusEnum.CANCELLED: "slot_selected",
        BookingStatusEnum.NO_SHOW: "slot_selected",
        BookingStatusEnum.QUALITY_FAILED: "procurement_completed",
        BookingStatusEnum.PAYMENT_FAILED: "payment_processing"
    }
    return mapping.get(status, "slot_selected")

@router.get("/current", response_model=ApiResponseEnvelope[List[dict]])
async def get_current_queue(
    centre_id: str = Query("cnt-a"),
    current_user: CurrentUserProvider = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Enforce Centre Isolation (Requirement 15)
    CentreAccessChecker.verify_centre_access(current_user, centre_id)
    
    # 1. Fetch Centre Info for active counters
    centre_res = await db.execute(
        select(ProcurementCentreModel).filter(ProcurementCentreModel.id == centre_id)
    )
    centre = centre_res.scalars().first()
    active_counters = centre.active_counters if centre else 4
    
    # 2. Fetch all bookings for this centre
    bookings_res = await db.execute(
        select(BookingModel)
        .filter(BookingModel.centre_id == centre_id)
        .options(
            joinedload(BookingModel.farmer),
            joinedload(BookingModel.centre),
            joinedload(BookingModel.slot)
        )
        .order_by(BookingModel.token_number.asc())
    )
    all_bookings = bookings_res.scalars().all()
    
    # 3. Calculate historical average processing duration from Audit Logs
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
    
    # 4. Count waiting and processing queues
    in_queue_bookings = [b for b in all_bookings if b.status in (
        BookingStatusEnum.BOOKED, BookingStatusEnum.ARRIVED, BookingStatusEnum.WAITING
    )]
    currently_processing = sum(1 for b in all_bookings if b.status in (
        BookingStatusEnum.PROCESSING, BookingStatusEnum.QUALITY_CHECK, BookingStatusEnum.WEIGHING
    ))
    
    # 5. Extract temporal features
    now = datetime.now()
    hour = now.hour
    day_of_week = now.weekday()
    
    # 6. Map to frontend expected structures and dynamically run prediction
    from app.intelligence.strategies import MLWaitingTimeQueueEngine
    engine = MLWaitingTimeQueueEngine()
    
    result_list = []
    for b in all_bookings:
        # Determine farmers ahead of this specific booking
        farmers_ahead = sum(1 for qb in in_queue_bookings if qb.token_number < b.token_number)
        
        # Calculate dynamic prediction
        if b.status in (BookingStatusEnum.BOOKED, BookingStatusEnum.ARRIVED, BookingStatusEnum.WAITING):
            features = {
                "type": "features",
                "farmers_ahead": farmers_ahead,
                "currently_waiting": len(in_queue_bookings),
                "currently_processing": currently_processing,
                "active_counters": active_counters,
                "average_processing_time": avg_processing_time,
                "hour": hour,
                "day_of_week": day_of_week
            }
            res_analysis = await engine.analyze_queue([features])
            pred_wait = res_analysis["predicted_wait_minutes"]
        else:
            # For already serving or completed farmers
            pred_wait = 0
            farmers_ahead = 0
            
        # Update wait minutes dynamically in DB session to keep it synced
        if b.estimated_wait_minutes != pred_wait:
            b.estimated_wait_minutes = pred_wait
            db.add(b)
            
        # Format mapping matching TokenRecord frontend type
        token_record = {
            "id": b.id,
            "tokenNumber": b.token_number,
            "produceId": f"PRD-{b.centre.code if b.centre else 'TNJ'}-2026-{800 + b.token_number}",
            "farmerId": b.farmer_id,
            "farmerName": b.farmer.name if b.farmer else f"Farmer {b.farmer_id[-4:]}",
            "farmerPhone": b.farmer.phone if b.farmer else "",
            "farmerVillage": b.farmer.location if b.farmer else "",
            "centreId": b.centre_id,
            "centreName": b.centre.name if b.centre else "",
            "slotId": b.slot_id,
            "slotDate": b.slot.date if b.slot else "2026-08-26",
            "slotTimeWindow": f"{b.slot.start_time} – {b.slot.end_time}" if b.slot else "10:00 – 11:00",
            "crop": b.crop,
            "cropVariety": b.crop_variety or "Standard",
            "declaredQuantityKg": b.declared_quantity_kg,
            "actualQuantityKg": b.actual_quantity_kg,
            "moisturePercentage": b.moisture_percentage,
            "qualityGrade": b.quality_grade.value if b.quality_grade else None,
            "stage": map_status_to_stage(b.status),
            "status": map_status_to_frontend(b.status),
            "estimatedWaitMinutes": pred_wait,
            "farmersAhead": farmers_ahead,
            "counterAssigned": b.counter_assigned,
            "createdAt": b.created_at.isoformat() if b.created_at else datetime.utcnow().isoformat()
        }
        result_list.append(token_record)
        
    await db.commit()
    return ApiResponseEnvelope(success=True, data=result_list)

@router.post("/{booking_id}/call", response_model=ApiResponseEnvelope[dict])
async def call_token(
    booking_id: str,
    current_user: CurrentUserProvider = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service),
    db: AsyncSession = Depends(get_db)
):
    # 1. Fetch the target booking to get its centre_id
    booking_res = await db.execute(
        select(BookingModel).filter(BookingModel.id == booking_id)
    )
    booking = booking_res.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # 2. Automatically complete other bookings in processing/quality/weighing at the same centre
    active_res = await db.execute(
        select(BookingModel).filter(
            BookingModel.centre_id == booking.centre_id,
            BookingModel.status.in_([
                BookingStatusEnum.PROCESSING,
                BookingStatusEnum.QUALITY_CHECK,
                BookingStatusEnum.WEIGHING
            ])
        )
    )
    active_bookings = active_res.scalars().all()
    for ab in active_bookings:
        if ab.id != booking.id:
            ab.status = BookingStatusEnum.PROCURED
            db.add(ab)

    # 3. Call the next token (transitions status to PROCESSING)
    await booking_service.update_status(booking_id, BookingStatusEnum.PROCESSING, current_user.user_id, current_user.role)
    
    return ApiResponseEnvelope(success=True, message=f"Token {booking.token_number} called to counter.")
