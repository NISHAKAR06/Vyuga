from fastapi import APIRouter, Depends
from app.schemas.common import ApiResponseEnvelope
from app.api.deps import get_current_user, require_roles, CurrentUserProvider

router = APIRouter(prefix="/admin/analytics", tags=["Admin Analytics"])

@router.get("/procurement", response_model=ApiResponseEnvelope[dict])
async def get_procurement_analytics(current_user: CurrentUserProvider = Depends(require_roles(["ADMIN", "PROCURER"]))):
    return ApiResponseEnvelope(
        success=True,
        data={
            "total_procured_tons": 2450.5,
            "total_farmers_served": 1890,
            "active_centres": 5,
            "average_wait_minutes": 27.4,
            "daily_procurement_trend": [
                {"day": "Mon", "tonnage": 380},
                {"day": "Tue", "tonnage": 420},
                {"day": "Wed", "tonnage": 460},
                {"day": "Thu", "tonnage": 490},
                {"day": "Fri", "tonnage": 510}
            ]
        }
    )
