from fastapi import HTTPException, status
from typing import Any, Dict, Optional

class SmartProcureError(Exception):
    """Base exception for all domain business errors."""
    def __init__(self, code: str, message: str, status_code: int = 400, details: Optional[Dict[str, Any]] = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)

class BookingNotAvailableError(SmartProcureError):
    def __init__(self, message: str = "The selected slot is no longer available."):
        super().__init__(code="BOOKING_NOT_AVAILABLE", message=message, status_code=400)

class InvalidStateTransitionError(SmartProcureError):
    def __init__(self, from_state: str, to_state: str):
        super().__init__(
            code="INVALID_STATE_TRANSITION",
            message=f"Cannot transition from {from_state} to {to_state}.",
            status_code=409
        )

class CentreAccessDeniedError(SmartProcureError):
    def __init__(self, message: str = "Procurer is not authorized to access this procurement centre."):
        super().__init__(code="CENTRE_ACCESS_DENIED", message=message, status_code=403)

class PermissionDeniedError(SmartProcureError):
    def __init__(self, message: str = "Permission denied for this action."):
        super().__init__(code="PERMISSION_DENIED", message=message, status_code=403)

class FarmerOwnershipError(SmartProcureError):
    def __init__(self, message: str = "Access denied to requested farmer resources."):
        super().__init__(code="FARMER_OWNERSHIP_DENIED", message=message, status_code=403)

class AlreadyRegisteredError(SmartProcureError):
    def __init__(self, message: str = "Farmer is already registered for this procurement."):
        super().__init__(code="ALREADY_REGISTERED", message=message, status_code=409)

class AlreadyCheckedInError(SmartProcureError):
    def __init__(self, message: str = "Token has already been checked in at centre."):
        super().__init__(code="ALREADY_CHECKED_IN", message=message, status_code=409)

class InvalidQuantityError(SmartProcureError):
    def __init__(self, message: str = "Quantity exceeds eligible limit or land yield thresholds."):
        super().__init__(code="INVALID_QUANTITY", message=message, status_code=400)

class PaymentUpdateNotAllowedError(SmartProcureError):
    def __init__(self, message: str = "Payment status cannot be updated from current state."):
        super().__init__(code="PAYMENT_UPDATE_NOT_ALLOWED", message=message, status_code=409)

class ResourceNotFoundError(SmartProcureError):
    def __init__(self, resource_type: str, resource_id: Any):
        super().__init__(
            code="RESOURCE_NOT_FOUND",
            message=f"{resource_type} with ID {resource_id} was not found.",
            status_code=404
        )
