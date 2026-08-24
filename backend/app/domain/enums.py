from enum import Enum

class UserRoleEnum(str, Enum):
    FARMER = "FARMER"
    PROCURER = "PROCURER"
    ADMIN = "ADMIN"

class ProcurementStatusEnum(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    REGISTRATION_OPEN = "REGISTRATION_OPEN"
    REGISTRATION_CLOSED = "REGISTRATION_CLOSED"
    PROCUREMENT_ACTIVE = "PROCUREMENT_ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class BookingStatusEnum(str, Enum):
    BOOKED = "BOOKED"
    ARRIVED = "ARRIVED"
    WAITING = "WAITING"
    PROCESSING = "PROCESSING"
    QUALITY_CHECK = "QUALITY_CHECK"
    WEIGHING = "WEIGHING"
    PROCURED = "PROCURED"
    PAYMENT_PROCESSING = "PAYMENT_PROCESSING"
    PAID = "PAID"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"
    QUALITY_FAILED = "QUALITY_FAILED"
    PAYMENT_FAILED = "PAYMENT_FAILED"

class QualityGradeEnum(str, Enum):
    GRADE_A = "Grade A"
    GRADE_B = "Grade B"
    FAQ = "Standard (FAQ)"
    REJECTED = "Rejected"

class PaymentStatusEnum(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    PAID = "PAID"
    FAILED = "FAILED"

class GrievanceStatusEnum(str, Enum):
    OPEN = "OPEN"
    IN_REVIEW = "IN_REVIEW"
    RESOLVED = "RESOLVED"
    ESCALATED = "ESCALATED"

class AnomalyLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"
