from abc import ABC, abstractmethod
from typing import Dict, Any

class NotificationProvider(ABC):
    """Abstract interface for multi-channel notification providers (Requirement 35)."""
    @abstractmethod
    async def send_notification(self, recipient: str, title: str, message: str) -> bool:
        pass

class AppNotificationProvider(NotificationProvider):
    async def send_notification(self, recipient: str, title: str, message: str) -> bool:
        # In-app push notification
        return True

class SMSNotificationProvider(NotificationProvider):
    async def send_notification(self, recipient: str, title: str, message: str) -> bool:
        # SMS Gateway integration
        return True

class WhatsAppNotificationProvider(NotificationProvider):
    async def send_notification(self, recipient: str, title: str, message: str) -> bool:
        # WhatsApp Business API integration
        return True

class IVRNotificationProvider(NotificationProvider):
    async def send_notification(self, recipient: str, title: str, message: str) -> bool:
        # Interactive Voice Response automated call integration
        return True

class NotificationProviderFactory:
    """Factory Pattern creating interchangeable notification implementations (Requirement 19)."""
    @staticmethod
    def create(provider_type: str) -> NotificationProvider:
        provider_type_upper = provider_type.upper()
        if provider_type_upper == "SMS":
            return SMSNotificationProvider()
        elif provider_type_upper == "WHATSAPP":
            return WhatsAppNotificationProvider()
        elif provider_type_upper == "IVR":
            return IVRNotificationProvider()
        elif provider_type_upper == "APP":
            return AppNotificationProvider()
        else:
            return AppNotificationProvider()
