from abc import ABC, abstractmethod
from typing import Dict, Any, List
from datetime import datetime

# 1. Demand Forecast Strategy (Requirement 21)
class DemandForecastEngine(ABC):
    @abstractmethod
    async def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

class RuleBasedDemandForecastEngine(DemandForecastEngine):
    async def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        crop = input_data.get("crop", "Paddy")
        centre_capacity = input_data.get("centre_capacity", 100000)
        expected_farmers = int(centre_capacity / 2500)
        return {
            "expected_farmers": expected_farmers,
            "confidence_range": [int(expected_farmers * 0.9), int(expected_farmers * 1.1)],
            "peak_period": "10:00 AM - 12:00 PM",
            "crop_distribution": {crop: 0.85, "Other": 0.15},
            "strategy": "RuleBasedDemandForecastEngine"
        }

# 2. Smart Scheduling Strategy (Requirement 22)
class SchedulingEngine(ABC):
    @abstractmethod
    async def schedule(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

class BasicSchedulingEngine(SchedulingEngine):
    async def schedule(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        declared_kg = input_data.get("declared_kg", 3000)
        estimated_proc_minutes = int(declared_kg / 100)
        return {
            "recommended_slot": "10:00 - 11:00 AM",
            "arrival_window": "09:45 AM",
            "estimated_wait_minutes": 25,
            "estimated_processing_minutes": estimated_proc_minutes,
            "weighbridge_assignment": "Counter 1",
            "strategy": "BasicSchedulingEngine"
        }

# 3. Queue Intelligence Strategy (Requirement 23)
class QueueIntelligenceEngine(ABC):
    @abstractmethod
    async def analyze_queue(self, queue_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        pass

class RollingAverageQueueEngine(QueueIntelligenceEngine):
    async def analyze_queue(self, queue_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        current_queue_count = len(queue_data)
        avg_wait = current_queue_count * 4
        return {
            "current_queue": current_queue_count,
            "predicted_queue": current_queue_count + 5,
            "predicted_wait_minutes": avg_wait,
            "throughput_per_hour": 15,
            "congestion_status": "HIGH" if current_queue_count > 30 else "NORMAL",
            "anomaly_status": "NORMAL",
            "strategy": "RollingAverageQueueEngine"
        }

# 4. Quality Assessment Strategy (Requirement 24)
class QualityAssessmentEngine(ABC):
    @abstractmethod
    async def assess_quality(self, quality_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

class ManualQualityAssessmentEngine(QualityAssessmentEngine):
    async def assess_quality(self, quality_data: Dict[str, Any]) -> Dict[str, Any]:
        moisture = quality_data.get("moisture_percentage", 14.0)
        grade = quality_data.get("grade", "Grade A")
        review_required = moisture > 17.0
        return {
            "grade": grade if not review_required else "Rejected",
            "confidence": 0.95,
            "remarks": "Manual inspection verified." if not review_required else "Moisture above 17% limit.",
            "review_required": review_required,
            "strategy": "ManualQualityAssessmentEngine"
        }

# 5. Fraud Detection Strategy (Requirement 25)
class FraudDetectionEngine(ABC):
    @abstractmethod
    async def detect_fraud(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

class RuleBasedFraudEngine(FraudDetectionEngine):
    async def detect_fraud(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        declared_kg = input_data.get("declared_quantity_kg", 0)
        land_acres = input_data.get("land_area_acres", 1.0)
        yield_per_acre = declared_kg / land_acres if land_acres > 0 else declared_kg
        
        # Max expected yield per acre is 2400 kg for Paddy
        risk_score = 15
        risk_level = "LOW"
        reason = "Declared quantity is within standard agronomic limits."
        
        if yield_per_acre > 3500:
            risk_score = 87
            risk_level = "HIGH"
            reason = f"Declared quantity ({declared_kg:,.0f} kg) is +{int((yield_per_acre/2400 - 1)*100)}% above normal regional yield ceiling on {land_acres} acres."
            
        return {
            "fraud_risk": risk_score,
            "risk_level": risk_level,
            "risk_factors": [reason] if risk_score > 50 else [],
            "review_required": risk_score > 50,
            "strategy": "RuleBasedFraudEngine"
        }

# 6. Payment Prediction Strategy (Requirement 26)
class PaymentPredictionEngine(ABC):
    @abstractmethod
    async def predict_payment(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

class RuleBasedPaymentPredictionEngine(PaymentPredictionEngine):
    async def predict_payment(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "expected_payment_date": "Within 24 Hours",
            "lower_bound_days": 1,
            "upper_bound_days": 2,
            "confidence_score": 0.98,
            "strategy": "RuleBasedPaymentPredictionEngine"
        }

# 7. Rerouting Strategy (Requirement 27)
class ReroutingEngine(ABC):
    @abstractmethod
    async def find_alternative_centres(self, current_centre_id: str, centres: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        pass

class CapacityDistanceReroutingEngine(ReroutingEngine):
    async def find_alternative_centres(self, current_centre_id: str, centres: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        alternatives = []
        for c in centres:
            if c["id"] != current_centre_id and c.get("current_wait_minutes", 0) < 30:
                alternatives.append({
                    "centre_id": c["id"],
                    "centre_name": c["name"],
                    "wait_minutes": c.get("current_wait_minutes", 20),
                    "distance_km": 12.5,
                    "available_slots": True
                })
        return alternatives
