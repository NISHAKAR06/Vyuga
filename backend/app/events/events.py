from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, Any, List, Type
import uuid

class DomainEvent(ABC):
    def __init__(self, event_type: str, payload: Dict[str, Any]):
        self.event_id = str(uuid.uuid4())
        self.event_type = event_type
        self.occurred_at = datetime.utcnow()
        self.payload = payload

class FarmerCheckedInEvent(DomainEvent):
    def __init__(self, booking_id: str, farmer_id: str, centre_id: str):
        super().__init__("FARMER_CHECKED_IN", {
            "booking_id": booking_id,
            "farmer_id": farmer_id,
            "centre_id": centre_id
        })

class ProcurementCompletedEvent(DomainEvent):
    def __init__(self, booking_id: str, farmer_id: str, centre_id: str, actual_qty_kg: float, amount: float):
        super().__init__("PROCUREMENT_COMPLETED", {
            "booking_id": booking_id,
            "farmer_id": farmer_id,
            "centre_id": centre_id,
            "actual_qty_kg": actual_qty_kg,
            "amount": amount
        })

class EventSubscriber(ABC):
    @abstractmethod
    async def handle(self, event: DomainEvent):
        pass

class AuditSubscriber(EventSubscriber):
    async def handle(self, event: DomainEvent):
        # Automatically logs side-effect audit records
        pass

class NotificationSubscriber(EventSubscriber):
    async def handle(self, event: DomainEvent):
        # Dispatches notifications asynchronously
        pass

class EventPublisher:
    """Event Publisher coordinating domain events and decoupling side effects."""
    def __init__(self):
        self._subscribers: List[EventSubscriber] = [AuditSubscriber(), NotificationSubscriber()]

    def register(self, subscriber: EventSubscriber):
        self._subscribers.append(subscriber)

    async def publish(self, event: DomainEvent):
        for sub in self._subscribers:
            await sub.handle(event)

event_publisher = EventPublisher()
