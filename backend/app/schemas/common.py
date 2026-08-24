from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, Any, Dict

T = TypeVar("T")

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class ApiResponseEnvelope(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    error: Optional[ErrorDetail] = None

class MessageResponse(BaseModel):
    message: str
