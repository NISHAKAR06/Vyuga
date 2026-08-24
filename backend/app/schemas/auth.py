from pydantic import BaseModel, Field
from typing import Optional
from app.domain.enums import UserRoleEnum

class LoginRequest(BaseModel):
    phone: str = Field(..., example="+91 98421 76540")
    password: Optional[str] = Field(None, example="secret123")
    role: UserRoleEnum = Field(..., example="FARMER")

class RegisterRequest(BaseModel):
    phone: str
    password: str
    full_name: str
    role: UserRoleEnum
    location: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = "Tamil Nadu"

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict
