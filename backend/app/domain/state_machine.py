from typing import Set, Dict
from app.domain.enums import BookingStatusEnum, PaymentStatusEnum, ProcurementStatusEnum
from app.core.exceptions import InvalidStateTransitionError

class BookingStateMachine:
    """
    Enforces valid state transitions for procurement bookings.
    Requirement 18:
    Valid lifecycle transitions:
    BOOKED -> ARRIVED -> WAITING -> PROCESSING -> QUALITY_CHECK -> WEIGHING -> PROCURED -> PAYMENT_PROCESSING -> PAID
    Exceptions:
    BOOKED -> CANCELLED, BOOKED -> NO_SHOW, QUALITY_CHECK -> QUALITY_FAILED, PAYMENT_PROCESSING -> PAYMENT_FAILED
    Invalid transition -> HTTP 409 INVALID_STATE_TRANSITION
    """
    ALLOWED_TRANSITIONS: Dict[BookingStatusEnum, Set[BookingStatusEnum]] = {
        BookingStatusEnum.BOOKED: {
            BookingStatusEnum.ARRIVED,
            BookingStatusEnum.CANCELLED,
            BookingStatusEnum.NO_SHOW,
            BookingStatusEnum.WAITING,
        },
        BookingStatusEnum.ARRIVED: {
            BookingStatusEnum.WAITING,
            BookingStatusEnum.CANCELLED,
        },
        BookingStatusEnum.WAITING: {
            BookingStatusEnum.PROCESSING,
            BookingStatusEnum.QUALITY_CHECK,
            BookingStatusEnum.CANCELLED,
        },
        BookingStatusEnum.PROCESSING: {
            BookingStatusEnum.QUALITY_CHECK,
            BookingStatusEnum.WEIGHING,
        },
        BookingStatusEnum.QUALITY_CHECK: {
            BookingStatusEnum.WEIGHING,
            BookingStatusEnum.QUALITY_FAILED,
        },
        BookingStatusEnum.WEIGHING: {
            BookingStatusEnum.PROCURED,
        },
        BookingStatusEnum.PROCURED: {
            BookingStatusEnum.PAYMENT_PROCESSING,
        },
        BookingStatusEnum.PAYMENT_PROCESSING: {
            BookingStatusEnum.PAID,
            BookingStatusEnum.PAYMENT_FAILED,
        },
        BookingStatusEnum.PAID: set(),
        BookingStatusEnum.CANCELLED: set(),
        BookingStatusEnum.NO_SHOW: set(),
        BookingStatusEnum.QUALITY_FAILED: set(),
        BookingStatusEnum.PAYMENT_FAILED: {BookingStatusEnum.PAYMENT_PROCESSING},
    }

    @classmethod
    def transition(cls, current_status: BookingStatusEnum, new_status: BookingStatusEnum) -> BookingStatusEnum:
        if current_status == new_status:
            return current_status
        allowed = cls.ALLOWED_TRANSITIONS.get(current_status, set())
        if new_status not in allowed:
            raise InvalidStateTransitionError(
                from_state=current_status.value if hasattr(current_status, 'value') else str(current_status),
                to_state=new_status.value if hasattr(new_status, 'value') else str(new_status)
            )
        return new_status

class PaymentStateMachine:
    """Enforces state transitions for Direct Benefit Transfer payments."""
    ALLOWED_TRANSITIONS: Dict[PaymentStatusEnum, Set[PaymentStatusEnum]] = {
        PaymentStatusEnum.PENDING: {PaymentStatusEnum.PROCESSING, PaymentStatusEnum.FAILED},
        PaymentStatusEnum.PROCESSING: {PaymentStatusEnum.PAID, PaymentStatusEnum.FAILED},
        PaymentStatusEnum.FAILED: {PaymentStatusEnum.PROCESSING},
        PaymentStatusEnum.PAID: set(),
    }

    @classmethod
    def transition(cls, current_status: PaymentStatusEnum, new_status: PaymentStatusEnum) -> PaymentStatusEnum:
        if current_status == new_status:
            return current_status
        allowed = cls.ALLOWED_TRANSITIONS.get(current_status, set())
        if new_status not in allowed:
            raise InvalidStateTransitionError(
                from_state=current_status.value if hasattr(current_status, 'value') else str(current_status),
                to_state=new_status.value if hasattr(new_status, 'value') else str(new_status)
            )
        return new_status

class ProcurementStateMachine:
    """Enforces state transitions for procurement announcements."""
    ALLOWED_TRANSITIONS: Dict[ProcurementStatusEnum, Set[ProcurementStatusEnum]] = {
        ProcurementStatusEnum.DRAFT: {ProcurementStatusEnum.PUBLISHED, ProcurementStatusEnum.CANCELLED},
        ProcurementStatusEnum.PUBLISHED: {ProcurementStatusEnum.REGISTRATION_OPEN, ProcurementStatusEnum.CANCELLED},
        ProcurementStatusEnum.REGISTRATION_OPEN: {ProcurementStatusEnum.REGISTRATION_CLOSED, ProcurementStatusEnum.PROCUREMENT_ACTIVE, ProcurementStatusEnum.CANCELLED},
        ProcurementStatusEnum.REGISTRATION_CLOSED: {ProcurementStatusEnum.PROCUREMENT_ACTIVE, ProcurementStatusEnum.CANCELLED},
        ProcurementStatusEnum.PROCUREMENT_ACTIVE: {ProcurementStatusEnum.COMPLETED, ProcurementStatusEnum.CANCELLED},
        ProcurementStatusEnum.COMPLETED: set(),
        ProcurementStatusEnum.CANCELLED: set(),
    }

    @classmethod
    def transition(cls, current_status: ProcurementStatusEnum, new_status: ProcurementStatusEnum) -> ProcurementStatusEnum:
        if current_status == new_status:
            return current_status
        allowed = cls.ALLOWED_TRANSITIONS.get(current_status, set())
        if new_status not in allowed:
            raise InvalidStateTransitionError(
                from_state=current_status.value if hasattr(current_status, 'value') else str(current_status),
                to_state=new_status.value if hasattr(new_status, 'value') else str(new_status)
            )
        return new_status
