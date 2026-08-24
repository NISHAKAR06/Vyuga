from fastapi import APIRouter, Depends
from typing import List
from app.schemas.common import ApiResponseEnvelope
from app.api.deps import get_current_user, CurrentUserProvider
from app.core.permissions import FarmerOwnershipChecker

router = APIRouter(prefix="/payments", tags=["Payments"])

MOCK_PAYMENTS = [
    {
        "id": "pay-8841",
        "procurementId": "PROC-TNJ-2026-0847",
        "tokenNumber": 47,
        "farmerId": "F-TN-2026-8841",
        "farmerName": "R. Murugesan",
        "farmerAccount": "SBI 30987123901",
        "bankName": "State Bank of India",
        "ifsc": "SBIN0001244",
        "crop": "Paddy (Grade A)",
        "quantityKg": 3000,
        "ratePerKg": 23.20,
        "baseAmount": 69600,
        "bonusAmount": 3000,
        "deductions": 0,
        "netAmount": 72600,
        "status": "Processing",
        "utrNumber": "PFMS-MOCK-2026-0001",
        "initiatedAt": "2026-08-26T11:45:00"
    }
]

@router.get("/my", response_model=ApiResponseEnvelope[List[dict]])
async def get_my_payments(current_user: CurrentUserProvider = Depends(get_current_user)):
    return ApiResponseEnvelope(success=True, data=MOCK_PAYMENTS)

@router.get("/{payment_id}", response_model=ApiResponseEnvelope[dict])
async def get_payment_detail(payment_id: str, current_user: CurrentUserProvider = Depends(get_current_user)):
    payment = MOCK_PAYMENTS[0]
    FarmerOwnershipChecker.verify_ownership(current_user, payment["farmerId"])
    return ApiResponseEnvelope(success=True, data=payment)
