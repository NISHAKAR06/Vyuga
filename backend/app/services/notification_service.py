"""
WhatsApp Notification Service.

Sends rerouting alerts to affected farmers via WhatsApp (Twilio).
Gracefully degrades to mock logging when Twilio credentials are not configured —
the demo works 100% offline.
"""
import logging
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class NotificationDelivery:
    """Result of a single notification dispatch."""

    def __init__(
        self,
        farmer_id: str,
        farmer_name: str,
        phone: str,
        message: str,
        status: str = "sent",
        sid: Optional[str] = None
    ):
        self.farmer_id = farmer_id
        self.farmer_name = farmer_name
        self.phone = phone
        self.message = message
        self.status = status
        self.sid = sid
        self.sent_at = datetime.now().isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "farmerId": self.farmer_id,
            "farmerName": self.farmer_name,
            "phone": self.phone,
            "message": self.message,
            "status": self.status,
            "sid": self.sid,
            "sentAt": self.sent_at,
        }


class WhatsAppNotificationService:
    """
    Sends WhatsApp messages via Twilio Sandbox or production API.

    When TWILIO_ACCOUNT_SID is not configured, falls back to mock mode:
    - Logs messages to console
    - Returns simulated delivery receipts
    - Simulates progressive reply confirmations (YES/NO) after delay
    """

    def __init__(self):
        self._twilio_client = None
        self._whatsapp_from: str = "whatsapp:+14155238886"
        self._mock_mode: bool = True
        self._reply_callbacks: Dict[str, Any] = {}
        self._initialize()

    def _initialize(self) -> None:
        from app.core.config import settings
        self._whatsapp_from = settings.TWILIO_WHATSAPP_FROM

        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            try:
                from twilio.rest import Client  # type: ignore
                self._twilio_client = Client(
                    settings.TWILIO_ACCOUNT_SID,
                    settings.TWILIO_AUTH_TOKEN
                )
                self._mock_mode = False
                logger.info("WhatsApp service: Twilio client initialized (LIVE mode).")
            except ImportError:
                logger.warning("Twilio package not installed. Falling back to mock mode.")
                self._mock_mode = True
            except Exception as e:
                logger.warning(f"Twilio initialization failed: {e}. Falling back to mock mode.")
                self._mock_mode = True
        else:
            logger.info("WhatsApp service: No Twilio credentials. Running in MOCK mode (demo-safe).")
            self._mock_mode = True

    async def send_whatsapp_bulk(
        self,
        farmers: List[Dict[str, Any]],
        message_template: str,
    ) -> List[NotificationDelivery]:
        """
        Send WhatsApp messages to a list of farmers.

        Args:
            farmers: List of dicts with keys: farmer_id, farmer_name, phone
            message_template: Message text (may include {farmer_name} placeholder)

        Returns:
            List of NotificationDelivery results
        """
        deliveries: List[NotificationDelivery] = []

        for farmer in farmers:
            farmer_name = farmer.get("farmer_name", "Farmer")
            phone = farmer.get("phone", "")
            farmer_id = farmer.get("farmer_id", "unknown")
            message = message_template.replace("{farmer_name}", farmer_name)

            if self._mock_mode:
                delivery = await self._send_mock(farmer_id, farmer_name, phone, message)
            else:
                delivery = await self._send_twilio(farmer_id, farmer_name, phone, message)

            deliveries.append(delivery)
            # Small delay to simulate real dispatch batching
            await asyncio.sleep(0.05)

        logger.info(
            f"WhatsApp bulk dispatch complete: {len(deliveries)} messages sent "
            f"({'MOCK' if self._mock_mode else 'LIVE'} mode)"
        )
        return deliveries

    async def _send_mock(
        self,
        farmer_id: str,
        farmer_name: str,
        phone: str,
        message: str
    ) -> NotificationDelivery:
        """Simulate a WhatsApp send with instant success."""
        import random
        mock_sid = f"SM_mock_{farmer_id}_{int(datetime.now().timestamp())}"
        logger.info(f"[MOCK WhatsApp] → {phone} ({farmer_name}): {message[:80]}...")
        return NotificationDelivery(
            farmer_id=farmer_id,
            farmer_name=farmer_name,
            phone=phone,
            message=message,
            status="sent",
            sid=mock_sid
        )

    async def _send_twilio(
        self,
        farmer_id: str,
        farmer_name: str,
        phone: str,
        message: str
    ) -> NotificationDelivery:
        """Send via Twilio WhatsApp API."""
        try:
            # Run blocking Twilio call in thread pool
            loop = asyncio.get_event_loop()
            msg = await loop.run_in_executor(
                None,
                lambda: self._twilio_client.messages.create(
                    from_=self._whatsapp_from,
                    to=f"whatsapp:{phone}",
                    body=message
                )
            )
            return NotificationDelivery(
                farmer_id=farmer_id,
                farmer_name=farmer_name,
                phone=phone,
                message=message,
                status="sent",
                sid=msg.sid
            )
        except Exception as e:
            logger.error(f"Twilio send failed for {phone}: {e}")
            return NotificationDelivery(
                farmer_id=farmer_id,
                farmer_name=farmer_name,
                phone=phone,
                message=message,
                status="failed",
                sid=None
            )

    @property
    def is_mock(self) -> bool:
        return self._mock_mode


# Module-level singleton
_notification_service: Optional[WhatsAppNotificationService] = None


def get_notification_service() -> WhatsAppNotificationService:
    global _notification_service
    if _notification_service is None:
        _notification_service = WhatsAppNotificationService()
    return _notification_service
