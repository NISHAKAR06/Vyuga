"""
Queue Monitor — Async Background Worker.

Continuously monitors weighbridge throughput across all procurement centres.
Emits synthetic IoT events (no real hardware needed), runs LSTM prediction
and IsolationForest anomaly detection, and triggers auto-rerouting when
anomalies are detected.

Architecture:
    asyncio task (runs every QUEUE_MONITOR_INTERVAL_SECONDS)
    ├── IoT event emitter (Gaussian noise around baseline)
    ├── LSTM throughput predictor (per centre)
    ├── IsolationForest anomaly scorer (per centre)
    ├── Rerouting engine (CapacityDistanceReroutingEngine)
    ├── WhatsApp bulk notification dispatcher
    └── WebSocket broadcast (room: queue_intelligence)
"""
import asyncio
import random
import math
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional

import numpy as np

from app.intelligence.lstm_engine import ThroughputLSTM
from app.intelligence.anomaly_detector import ThroughputAnomalyDetector
from app.intelligence.strategies import CapacityDistanceReroutingEngine
from app.services.notification_service import get_notification_service
from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Simulated Centre Registry
# (In production this would be pulled from the database on startup)
# ---------------------------------------------------------------------------
SIMULATED_CENTRES = [
    {
        "id": "cnt-a",
        "name": "Centre A – Thanjavur Mandi",
        "code": "TNJ-01",
        "district": "Thanjavur",
        "lat": 10.787,
        "lon": 79.138,
        "baseline_throughput": 15,   # farmers/hour
        "max_throughput": 20,
        "current_wait_minutes": 18,
        "capacity_remaining": 45,
    },
    {
        "id": "cnt-b",
        "name": "Centre B – Kumbakonam Mandi",
        "code": "KBK-02",
        "district": "Kumbakonam",
        "lat": 10.961,
        "lon": 79.386,
        "baseline_throughput": 12,
        "max_throughput": 18,
        "current_wait_minutes": 18,
        "capacity_remaining": 38,
    },
    {
        "id": "cnt-c",
        "name": "Centre C – Papanasam Mandi",
        "code": "PPN-03",
        "district": "Papanasam",
        "lat": 10.935,
        "lon": 79.267,
        "baseline_throughput": 10,
        "max_throughput": 14,
        "current_wait_minutes": 22,
        "capacity_remaining": 29,
    },
]

# Farmers affected by a centre failure (simulated pool for demo)
SIMULATED_FARMERS_PER_CENTRE: Dict[str, List[Dict[str, Any]]] = {
    "cnt-a": [
        {"farmer_id": f"F-TN-2026-{8800+i}", "farmer_name": name, "phone": f"+9198421{75000+i:05d}"}
        for i, name in enumerate([
            "C. Palanivel", "M. Shanmugam", "R. Venkatesan", "S. Murugesan", "K. Anbazhagan",
            "P. Ramasamy", "T. Selvakumar", "D. Arumugam", "N. Krishnamurthy", "A. Subbaiah",
            "G. Rajan", "V. Natarajan", "B. Ponnusamy", "L. Thirumalai", "J. Saravanan",
            "H. Ganesan", "F. Chandrasekaran", "E. Balakrishnan", "I. Marimuthu", "Q. Senthilkumar",
            "W. Periyasamy", "X. Ayyasamy", "Y. Duraiswamy", "Z. Perumal", "U. Rajagopal",
            "O. Manoharan", "AA. Kandasamy", "BB. Somasundaram", "CC. Palaniswami", "DD. Nataraj",
            "EE. Sureshkumar", "FF. Gopalakrishnan", "GG. Karuppasamy", "HH. Muthuswami",
            "II. Rangasamy", "JJ. Velayutham", "KK. Dhanasekaran", "LL. Pitchai",
            "MM. Ramachandran", "NN. Thangavel",
        ])
    ],
    "cnt-b": [
        {"farmer_id": f"F-TN-2026-{8900+i}", "farmer_name": name, "phone": f"+9197890{12000+i:05d}"}
        for i, name in enumerate([
            "A. Krishnan", "B. Murugan", "C. Raman", "D. Sekar", "E. Thiru"
        ])
    ],
    "cnt-c": [
        {"farmer_id": f"F-TN-2026-{9000+i}", "farmer_name": name, "phone": f"+9196540{23000+i:05d}"}
        for i, name in enumerate([
            "X. Pandian", "Y. Chellapandi", "Z. Kuppusamy", "W. Ayyanar", "V. Manickam"
        ])
    ],
}

WHATSAPP_REROUTE_TEMPLATE = (
    "🚨 *Vyuga Alert*: Weighbridge delay at {original_centre}.\n\n"
    "Expected delay: *{delay_minutes} minutes*.\n\n"
    "📍 *{alternative_centre}* ({distance_km} km away) has only "
    "*{wait_minutes} min* wait time and {slots_available} slots open.\n\n"
    "Reply *YES* to confirm rerouting. Your token will be transferred automatically."
)


# ---------------------------------------------------------------------------
# Centre Runtime State
# ---------------------------------------------------------------------------
class CentreState:
    """Holds runtime telemetry for one procurement centre."""

    def __init__(self, centre: Dict[str, Any], window_size: int = 20):
        self.centre = centre
        self.centre_id = centre["id"]
        self.centre_name = centre["name"]
        self.baseline = centre["baseline_throughput"]

        # Rolling throughput history (farmers/hour readings)
        self.throughput_history: List[float] = []
        self.window_size = window_size

        # ML engines (one per centre for isolation)
        self.lstm = ThroughputLSTM(window_size=window_size)
        self.detector = ThroughputAnomalyDetector(window_size=min(5, window_size))

        # Runtime status
        self.is_failed: bool = False
        self.failure_injected_at: Optional[str] = None
        self.anomaly_score: float = 0.0
        self.anomaly_severity: str = "NORMAL"
        self.is_anomaly_active: bool = False
        self.lstm_predictions: List[float] = []
        self.lstm_confidence: float = 0.0
        self.predicted_wait_minutes: float = self.centre.get("current_wait_minutes", 18.0)
        self.rerouting_triggered: bool = False
        self.rerouting_triggered_at: Optional[str] = None
        self.notifications_sent: int = 0
        self.tick: int = 0

    def emit_iot_reading(self) -> float:
        """
        Generate a synthetic IoT throughput reading.

        Normal: Gaussian noise around baseline with diurnal variation.
        Failure: Sharp drop + slow recovery.
        """
        self.tick += 1

        if self.is_failed:
            # Simulate failure: throughput crashes to 20-40% of baseline
            crash_ratio = 0.20 + 0.20 * random.random()
            # Slow recovery after 15 ticks
            ticks_since_fail = self.tick - (self._fail_tick or self.tick)
            recovery = min(1.0, ticks_since_fail / 30.0) * 0.4
            throughput = self.baseline * (crash_ratio + recovery) + random.gauss(0, 0.5)
        else:
            # Normal: diurnal sine wave + Gaussian noise
            diurnal = 1.0 + 0.15 * math.sin(self.tick * 0.3)
            noise = random.gauss(0, 1.2)
            throughput = self.baseline * diurnal + noise

        throughput = max(0.5, throughput)  # never go fully to zero in normal mode

        self.throughput_history.append(throughput)
        if len(self.throughput_history) > 60:
            self.throughput_history = self.throughput_history[-60:]

        return throughput

    def inject_failure(self) -> None:
        self.is_failed = True
        self._fail_tick = self.tick
        self.failure_injected_at = datetime.now().isoformat()
        self.rerouting_triggered = False  # allow re-trigger on new failure
        logger.warning(f"🔴 FAILURE INJECTED: {self.centre_name}")

    def recover(self) -> None:
        self.is_failed = False
        self._fail_tick = None
        self.is_anomaly_active = False
        self.anomaly_score = 0.0
        self.anomaly_severity = "NORMAL"
        logger.info(f"🟢 RECOVERY: {self.centre_name} back to normal")

    _fail_tick: Optional[int] = None

    def to_dict(self) -> Dict[str, Any]:
        recent = self.throughput_history[-20:] if self.throughput_history else []
        return {
            "centreId": self.centre_id,
            "centreName": self.centre_name,
            "district": self.centre.get("district", ""),
            "throughputHistory": recent,
            "currentThroughput": recent[-1] if recent else self.baseline,
            "baselineThroughput": self.baseline,
            "lstmPredictions": self.lstm_predictions,
            "lstmConfidence": round(self.lstm_confidence, 3),
            "anomalyScore": round(self.anomaly_score, 3),
            "anomalySeverity": self.anomaly_severity,
            "isAnomalyActive": self.is_anomaly_active,
            "isFailed": self.is_failed,
            "predictedWaitMinutes": round(self.predicted_wait_minutes, 1),
            "reroutingTriggered": self.rerouting_triggered,
            "reroutingTriggeredAt": self.rerouting_triggered_at,
            "notificationsSent": self.notifications_sent,
            "capacityRemaining": self.centre.get("capacity_remaining", 30),
        }


# ---------------------------------------------------------------------------
# Queue Monitor (Orchestrator)
# ---------------------------------------------------------------------------
class QueueMonitor:
    """
    Background async worker that orchestrates:
    - IoT synthetic event emission
    - LSTM prediction
    - Anomaly detection
    - Auto-rerouting
    - WebSocket broadcasting
    """

    def __init__(self):
        self._centres: Dict[str, CentreState] = {}
        self._rerouting_engine = CapacityDistanceReroutingEngine()
        self._notification_svc = None  # lazy-init
        self._ws_manager = None        # injected at startup
        self._running: bool = False
        self._task: Optional[asyncio.Task] = None
        self._all_rerouting_events: List[Dict[str, Any]] = []
        self._event_log: List[Dict[str, Any]] = []
        self._total_events_processed: int = 0
        self._total_farmers_rerouted: int = 0

    def set_ws_manager(self, manager: Any) -> None:
        """Inject the WebSocket connection manager."""
        self._ws_manager = manager

    def _ensure_notification_svc(self):
        if self._notification_svc is None:
            self._notification_svc = get_notification_service()
        return self._notification_svc

    def _initialize_centres(self) -> None:
        """Set up centre states and pre-train ML models on synthetic normal data."""
        for centre in SIMULATED_CENTRES:
            state = CentreState(centre, window_size=settings.LSTM_WINDOW_SIZE)

            # Generate synthetic normal training data
            normal_training = [
                centre["baseline_throughput"] + random.gauss(0, 1.5)
                for _ in range(100)
            ]
            normal_training = [max(0.5, v) for v in normal_training]

            # Train LSTM + IsolationForest
            state.lstm.fit_on_normal(normal_training)
            state.detector.fit(normal_training)

            self._centres[centre["id"]] = state
            logger.info(f"Centre state initialized: {centre['name']}")

    async def start(self) -> None:
        """Start the background monitoring loop."""
        logger.info("QueueMonitor: Initializing ML models...")
        self._initialize_centres()
        self._running = True
        self._task = asyncio.create_task(self._monitor_loop())
        logger.info(
            f"QueueMonitor: Started. Monitoring {len(self._centres)} centres "
            f"at {settings.QUEUE_MONITOR_INTERVAL_SECONDS}s intervals."
        )

    async def stop(self) -> None:
        """Gracefully stop the background task."""
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("QueueMonitor: Stopped.")

    async def inject_failure(self, centre_id: str) -> Dict[str, Any]:
        """
        Demo trigger: inject a weighbridge failure event at the specified centre.
        Returns immediately; the monitoring loop will detect and handle it.
        """
        if centre_id not in self._centres:
            return {"success": False, "error": f"Centre {centre_id} not found."}

        state = self._centres[centre_id]
        state.inject_failure()

        event = {
            "type": "FAILURE_INJECTED",
            "centreId": centre_id,
            "centreName": state.centre_name,
            "timestamp": datetime.now().isoformat(),
            "message": f"Weighbridge failure injected at {state.centre_name}"
        }
        self._log_event(event)

        # Broadcast immediately
        await self._broadcast({"event": "FAILURE_INJECTED", "data": event})

        return {"success": True, "event": event}

    async def recover_centre(self, centre_id: str) -> Dict[str, Any]:
        """Reset a failed centre back to normal operation."""
        if centre_id not in self._centres:
            return {"success": False, "error": "Centre not found."}
        self._centres[centre_id].recover()
        return {"success": True, "centreId": centre_id}

    def get_status(self) -> Dict[str, Any]:
        """Return current snapshot of all centres."""
        return {
            "centres": [s.to_dict() for s in self._centres.values()],
            "eventLog": self._event_log[-50:],
            "reroutingEvents": self._all_rerouting_events[-20:],
            "totalEventsProcessed": self._total_events_processed,
            "totalFarmersRerouted": self._total_farmers_rerouted,
            "isRunning": self._running,
            "timestamp": datetime.now().isoformat(),
        }

    def get_rerouting_events(self) -> List[Dict[str, Any]]:
        return self._all_rerouting_events[-30:]

    # ------------------------------------------------------------------
    # Internal Loop
    # ------------------------------------------------------------------
    async def _monitor_loop(self) -> None:
        while self._running:
            try:
                await self._tick_all_centres()
                await asyncio.sleep(settings.QUEUE_MONITOR_INTERVAL_SECONDS)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"QueueMonitor tick error: {e}", exc_info=True)
                await asyncio.sleep(2)

    async def _tick_all_centres(self) -> None:
        """Process one monitoring tick for all centres."""
        snapshots = []

        for centre_id, state in self._centres.items():
            # 1. Emit IoT reading
            throughput = state.emit_iot_reading()
            self._total_events_processed += 1

            # 2. LSTM prediction
            if len(state.throughput_history) >= 5:
                preds, conf = state.lstm.predict_next_n(state.throughput_history, n=3)
                state.lstm_predictions = [round(p, 2) for p in preds]
                state.lstm_confidence = conf
                state.predicted_wait_minutes = state.lstm.get_expected_wait_minutes(
                    sum(preds) / len(preds)
                )

            # 3. Anomaly detection
            if len(state.throughput_history) >= state.detector.window_size:
                score = state.detector.score(state.throughput_history)
                state.anomaly_score = score
                state.anomaly_severity = state.detector.get_severity(score)
                prev_anomaly = state.is_anomaly_active
                state.is_anomaly_active = state.detector.is_anomaly(
                    score, settings.ANOMALY_SCORE_THRESHOLD
                )

                # 4. Trigger rerouting on anomaly onset
                if state.is_anomaly_active and not state.rerouting_triggered:
                    await self._trigger_rerouting(state)

                # Log anomaly onset
                if state.is_anomaly_active and not prev_anomaly:
                    event = {
                        "type": "ANOMALY_DETECTED",
                        "centreId": centre_id,
                        "centreName": state.centre_name,
                        "anomalyScore": round(score, 3),
                        "severity": state.anomaly_severity,
                        "predictedWaitMinutes": round(state.predicted_wait_minutes, 1),
                        "timestamp": datetime.now().isoformat(),
                    }
                    self._log_event(event)

            snapshots.append(state.to_dict())

        # 5. Broadcast live update to all WebSocket subscribers
        payload = {
            "event": "THROUGHPUT_UPDATE",
            "data": {
                "centres": snapshots,
                "timestamp": datetime.now().isoformat(),
                "totalEventsProcessed": self._total_events_processed,
                "totalFarmersRerouted": self._total_farmers_rerouted,
            }
        }
        await self._broadcast(payload)

    async def _trigger_rerouting(self, state: CentreState) -> None:
        """
        Full rerouting pipeline:
        1. Find alternative centres with capacity
        2. Build WhatsApp message
        3. Dispatch bulk notifications
        4. Record rerouting event
        5. Broadcast to dashboard
        """
        logger.warning(
            f"🚨 ANOMALY CONFIRMED at {state.centre_name} "
            f"(score={state.anomaly_score:.2f}). Triggering auto-rerouting..."
        )

        # Find alternatives
        other_centres = [
            {
                "id": s.centre_id,
                "name": s.centre_name,
                "current_wait_minutes": s.predicted_wait_minutes,
                "capacity_remaining": s.centre.get("capacity_remaining", 30),
            }
            for cid, s in self._centres.items()
            if cid != state.centre_id and not s.is_anomaly_active
        ]

        alternatives = await self._rerouting_engine.find_alternative_centres(
            state.centre_id, other_centres
        )

        if not alternatives:
            logger.warning(f"No alternative centres available for {state.centre_name}")
            return

        best_alt = alternatives[0]
        alt_centre_name = best_alt.get("centre_name", "Nearby Centre")
        alt_wait = best_alt.get("wait_minutes", 18)
        alt_distance = best_alt.get("distance_km", 12.5)

        # Get affected farmers for this centre
        affected_farmers = SIMULATED_FARMERS_PER_CENTRE.get(state.centre_id, [])
        delay_minutes = max(60, int(state.predicted_wait_minutes))

        message = WHATSAPP_REROUTE_TEMPLATE.format(
            original_centre=state.centre_name,
            delay_minutes=delay_minutes,
            alternative_centre=alt_centre_name,
            distance_km=alt_distance,
            wait_minutes=alt_wait,
            slots_available=best_alt.get("available_slots", True) and "available" or "limited",
        )

        # Dispatch notifications
        svc = self._ensure_notification_svc()
        deliveries = await svc.send_whatsapp_bulk(affected_farmers, message)

        # Simulate realistic reply progression (YES within 30-60s in demo)
        asyncio.create_task(
            self._simulate_farmer_replies(deliveries, state.centre_id)
        )

        # Update state
        state.rerouting_triggered = True
        state.rerouting_triggered_at = datetime.now().isoformat()
        state.notifications_sent = len(deliveries)
        self._total_farmers_rerouted += len(deliveries)

        # Build rerouting event record
        rerouting_event = {
            "eventId": f"RE-{state.centre_id}-{int(datetime.now().timestamp())}",
            "type": "REROUTING_TRIGGERED",
            "centreId": state.centre_id,
            "centreName": state.centre_name,
            "anomalyScore": round(state.anomaly_score, 3),
            "severity": state.anomaly_severity,
            "delayMinutes": delay_minutes,
            "alternativeCentre": alt_centre_name,
            "alternativeDistance": alt_distance,
            "alternativeWaitMinutes": alt_wait,
            "farmersNotified": len(deliveries),
            "notificationDetails": [d.to_dict() for d in deliveries],
            "whatsappMessage": message,
            "timestamp": datetime.now().isoformat(),
        }
        self._all_rerouting_events.append(rerouting_event)
        self._log_event({
            "type": "REROUTING_TRIGGERED",
            "centreId": state.centre_id,
            "centreName": state.centre_name,
            "farmersNotified": len(deliveries),
            "timestamp": datetime.now().isoformat(),
        })

        # Broadcast rerouting event to dashboard
        await self._broadcast({
            "event": "REROUTING_TRIGGERED",
            "data": rerouting_event
        })

        logger.info(
            f"✅ Rerouting complete: {len(deliveries)} farmers notified → {alt_centre_name}"
        )

    async def _simulate_farmer_replies(
        self, deliveries: List[Any], centre_id: str
    ) -> None:
        """Simulate progressive YES replies from farmers (for demo realism)."""
        for i, delivery in enumerate(deliveries):
            # Stagger replies: 2-8 seconds each
            await asyncio.sleep(random.uniform(1.5, 4.0))

            # 85% acceptance rate
            reply = "YES" if random.random() < 0.85 else "NO"
            delivery.status = f"replied_{reply}"

            await self._broadcast({
                "event": "FARMER_REPLY",
                "data": {
                    "farmerId": delivery.farmer_id,
                    "farmerName": delivery.farmer_name,
                    "reply": reply,
                    "centreId": centre_id,
                    "timestamp": datetime.now().isoformat(),
                }
            })

    async def _broadcast(self, payload: Dict[str, Any]) -> None:
        """Broadcast to WebSocket room queue_intelligence."""
        if self._ws_manager is None:
            return
        try:
            await self._ws_manager.broadcast_to_room("queue_intelligence", payload)
        except Exception as e:
            logger.debug(f"WS broadcast error (no active connections): {e}")

    def _log_event(self, event: Dict[str, Any]) -> None:
        self._event_log.append(event)
        if len(self._event_log) > 200:
            self._event_log = self._event_log[-200:]


# Module-level singleton
_monitor: Optional[QueueMonitor] = None


def get_queue_monitor() -> QueueMonitor:
    global _monitor
    if _monitor is None:
        _monitor = QueueMonitor()
    return _monitor
