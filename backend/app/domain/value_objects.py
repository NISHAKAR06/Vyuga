from dataclasses import dataclass
from datetime import datetime, time
from typing import Optional

@dataclass(frozen=True)
class Money:
    amount: float
    currency: str = "INR"

    def __post_init__(self):
        if self.amount < 0:
            raise ValueError("Money amount cannot be negative.")

    def add(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("Cannot add different currencies.")
        return Money(amount=self.amount + other.amount, currency=self.currency)

@dataclass(frozen=True)
class Quantity:
    value: float
    unit: str = "kg"

    def __post_init__(self):
        if self.value <= 0:
            raise ValueError("Quantity value must be strictly positive.")

    def to_quintals(self) -> float:
        if self.unit == "kg":
            return self.value / 100.0
        return self.value

    def to_tons(self) -> float:
        if self.unit == "kg":
            return self.value / 1000.0
        return self.value

@dataclass(frozen=True)
class GeoLocation:
    latitude: float
    longitude: float
    address: Optional[str] = None

    def __post_init__(self):
        if not (-90 <= self.latitude <= 90):
            raise ValueError("Invalid latitude.")
        if not (-180 <= self.longitude <= 180):
            raise ValueError("Invalid longitude.")

@dataclass(frozen=True)
class TimeWindow:
    start_time: str
    end_time: str

    def display_range(self) -> str:
        return f"{self.start_time} - {self.end_time}"

@dataclass(frozen=True)
class QualityScore:
    moisture_percentage: float
    foreign_matter_percentage: float
    grade: str
    is_acceptable: bool

@dataclass(frozen=True)
class PaymentPrediction:
    expected_payment_date: str
    lower_bound_days: int
    upper_bound_days: int
    confidence_score: float
