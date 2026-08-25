"""Queue Intelligence API Router — REST endpoints + WebSocket stream."""
from fastapi import APIRouter, Body
from typing import Optional
from app.schemas.common import ApiResponseEnvelope
from app.workers.queue_monitor import get_queue_monitor

router = APIRouter(prefix="/queue-intelligence", tags=["Queue Intelligence"])


@router.get("/status", response_model=ApiResponseEnvelope[dict])
async def get_queue_intelligence_status():
    """
    Returns the live status snapshot of all centres:
    - Throughput histories (for sparklines)
    - LSTM predictions
    - Anomaly scores (IsolationForest)
    - Rerouting state & notification counts
    """
    monitor = get_queue_monitor()
    return ApiResponseEnvelope(success=True, data=monitor.get_status())


@router.post("/inject-failure", response_model=ApiResponseEnvelope[dict])
async def inject_failure(
    centre_id: str = Body(..., embed=True, example="cnt-a"),
):
    """
    Demo trigger: inject a weighbridge failure at the specified centre.

    This immediately degrades the centre's synthetic throughput reading,
    causing the IsolationForest to flag an anomaly within 2-3 ticks (~4-6s),
    which triggers bulk WhatsApp rerouting notifications.
    """
    monitor = get_queue_monitor()
    result = await monitor.inject_failure(centre_id)
    if result.get("success"):
        return ApiResponseEnvelope(
            success=True,
            message=f"Failure injected at centre {centre_id}. Anomaly detection will trigger in ~4-6 seconds.",
            data=result
        )
    return ApiResponseEnvelope(success=False, message=result.get("error", "Unknown error"))


@router.post("/recover", response_model=ApiResponseEnvelope[dict])
async def recover_centre(
    centre_id: str = Body(..., embed=True, example="cnt-a"),
):
    """Reset a failed centre back to normal operation (for demo reset)."""
    monitor = get_queue_monitor()
    result = await monitor.recover_centre(centre_id)
    return ApiResponseEnvelope(success=result.get("success", False), data=result)


@router.post("/reroute-response", response_model=ApiResponseEnvelope[dict])
async def handle_reroute_response(
    farmer_id: str = Body(..., embed=True),
    reply: str = Body(..., embed=True, example="YES"),
    centre_id: str = Body(..., embed=True),
):
    """
    Handle farmer's WhatsApp reply (YES/NO) to rerouting suggestion.
    In production this would be called by Twilio webhook.
    """
    accepted = reply.strip().upper() == "YES"
    return ApiResponseEnvelope(
        success=True,
        message=f"Farmer {farmer_id} {'accepted' if accepted else 'declined'} rerouting.",
        data={
            "farmerId": farmer_id,
            "reply": reply.upper(),
            "accepted": accepted,
            "centreId": centre_id,
        }
    )


@router.get("/rerouting-events", response_model=ApiResponseEnvelope[list])
async def get_rerouting_events():
    """Returns the last 30 rerouting events with full notification details."""
    monitor = get_queue_monitor()
    return ApiResponseEnvelope(success=True, data=monitor.get_rerouting_events())
