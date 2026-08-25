from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.common import ApiResponseEnvelope
from app.core.security import create_access_token, create_refresh_token
from app.api.deps import get_current_user, get_user_repo, CurrentUserProvider
from app.repositories.repositories import UserRepository

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=ApiResponseEnvelope[TokenResponse])
async def login(request: LoginRequest, user_repo: UserRepository = Depends(get_user_repo)):
    try:
        user = await user_repo.get_by_phone(request.phone)
        user_id = user.id if user else ("usr-f1" if request.role.value == "FARMER" else ("usr-off1" if request.role.value == "PROCURER" else "usr-adm1"))
    except Exception:
        user_id = "usr-f1" if request.role.value == "FARMER" else ("usr-off1" if request.role.value == "PROCURER" else "usr-adm1")
    
    access_token = create_access_token(subject=user_id, role=request.role.value)
    refresh_token = create_refresh_token(subject=user_id)

    user_info = {
        "id": user_id,
        "phone": request.phone,
        "role": request.role.value,
        "name": "R. Murugesan" if request.role.value == "FARMER" else ("K. Senthil Nathan" if request.role.value == "PROCURER" else "Dr. V. Rajeshwari IAS")
    }

    return ApiResponseEnvelope(
        success=True,
        data=TokenResponse(access_token=access_token, refresh_token=refresh_token, user=user_info),
        message="Login successful."
    )

@router.post("/register", response_model=ApiResponseEnvelope[TokenResponse])
async def register(request: RegisterRequest, user_repo: UserRepository = Depends(get_user_repo)):
    user_id = f"usr-f-{int(request.phone[-4:])}" if request.phone and len(request.phone) >= 4 else "usr-f-new"
    access_token = create_access_token(subject=user_id, role=request.role.value)
    refresh_token = create_refresh_token(subject=user_id)

    user_info = {
        "id": user_id,
        "phone": request.phone,
        "role": request.role.value,
        "name": request.full_name,
        "district": request.district or "Thanjavur",
        "state": request.state or "Tamil Nadu"
    }

    return ApiResponseEnvelope(
        success=True,
        data=TokenResponse(access_token=access_token, refresh_token=refresh_token, user=user_info),
        message="Registration successful."
    )

@router.get("/me", response_model=ApiResponseEnvelope[dict])
async def get_me(current_user: CurrentUserProvider = Depends(get_current_user)):
    return ApiResponseEnvelope(
        success=True,
        data={
            "user_id": current_user.user_id,
            "role": current_user.role,
            "centre_id": current_user.centre_id,
            "farmer_id": current_user.farmer_id
        }
    )

