from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.schemas.common import ApiResponseEnvelope
from app.api.deps import get_current_user, CurrentUserProvider
from app.core.permissions import CentreAccessChecker

router = APIRouter(prefix="/centres", tags=["Procurement Centres"])

MOCK_CENTRES = [
    {
        "id": "cnt-a",
        "name": "Centre A – Thanjavur Mandi",
        "code": "TNJ-01",
        "district": "Thanjavur",
        "state": "Tamil Nadu",
        "capacityPerDay": 120000,
        "activeCounters": 4,
        "totalFarmersToday": 125,
        "servedToday": 82,
        "waitingNow": 43,
        "currentAvgWaitMinutes": 27,
        "predictedAvgWaitMinutes": 34,
        "predictedCrowdLevel": "HIGH",
        "status": "High Load",
        "utilizationRate": 91,
        "address": "Old Bus Stand Road, Thanjavur APMC Yard, TN 613001",
        "contactNumber": "+91 4362 278100"
    },
    {
        "id": "cnt-b",
        "name": "Centre B – Kumbakonam Regulated Market",
        "code": "KMK-02",
        "district": "Thanjavur",
        "state": "Tamil Nadu",
        "capacityPerDay": 90000,
        "activeCounters": 3,
        "totalFarmersToday": 85,
        "servedToday": 60,
        "waitingNow": 25,
        "currentAvgWaitMinutes": 21,
        "predictedAvgWaitMinutes": 24,
        "predictedCrowdLevel": "NORMAL",
        "status": "Normal",
        "utilizationRate": 52,
        "address": "Mahamaham Tank West, Kumbakonam, TN 612001",
        "contactNumber": "+91 435 2400122"
    }
]

@router.get("", response_model=ApiResponseEnvelope[List[dict]])
async def list_centres():
    return ApiResponseEnvelope(success=True, data=MOCK_CENTRES)

@router.get("/{centre_id}", response_model=ApiResponseEnvelope[dict])
async def get_centre(centre_id: str, current_user: CurrentUserProvider = Depends(get_current_user)):
    # Enforce Centre Isolation policy for procurer role (Requirement 15)
    CentreAccessChecker.verify_centre_access(current_user, centre_id)
    centre = next((c for c in MOCK_CENTRES if c["id"] == centre_id), MOCK_CENTRES[0])
    return ApiResponseEnvelope(success=True, data=centre)
