import pytest
import asyncio
from app.domain.state_machine import BookingStateMachine, PaymentStateMachine
from app.domain.enums import BookingStatusEnum, PaymentStatusEnum
from app.core.exceptions import InvalidStateTransitionError, CentreAccessDeniedError, FarmerOwnershipError
from app.core.permissions import CurrentUserProvider, CentreAccessChecker, FarmerOwnershipChecker
from app.intelligence.strategies import (
    DemandForecastEngine, RuleBasedDemandForecastEngine,
    QualityAssessmentEngine, ManualQualityAssessmentEngine,
    FraudDetectionEngine, RuleBasedFraudEngine
)

# 1. Test OOP Polymorphism & Strategy Pattern (Requirement 51)
@pytest.mark.asyncio
async def test_forecast_engine_polymorphism():
    engine: DemandForecastEngine = RuleBasedDemandForecastEngine()
    result = await engine.predict({"crop": "Paddy", "centre_capacity": 100000})
    assert "expected_farmers" in result
    assert result["strategy"] == "RuleBasedDemandForecastEngine"

@pytest.mark.asyncio
async def test_fraud_engine_strategy():
    engine: FraudDetectionEngine = RuleBasedFraudEngine()
    
    # Normal yield case
    normal_res = await engine.detect_fraud({"declared_quantity_kg": 3000, "land_area_acres": 3.5})
    assert normal_res["risk_level"] == "LOW"
    assert normal_res["review_required"] is False

    # Anomaly yield case (> 3500 kg/acre)
    anomaly_res = await engine.detect_fraud({"declared_quantity_kg": 7000, "land_area_acres": 1.5})
    assert anomaly_res["risk_level"] == "HIGH"
    assert anomaly_res["review_required"] is True

# 2. Test State Machine Lifecycle & Invalid Transitions (Requirement 18 & 52)
def test_booking_state_machine_valid_transitions():
    assert BookingStateMachine.transition(BookingStatusEnum.BOOKED, BookingStatusEnum.ARRIVED) == BookingStatusEnum.ARRIVED
    assert BookingStateMachine.transition(BookingStatusEnum.ARRIVED, BookingStatusEnum.WAITING) == BookingStatusEnum.WAITING
    assert BookingStateMachine.transition(BookingStatusEnum.WAITING, BookingStatusEnum.PROCESSING) == BookingStatusEnum.PROCESSING

def test_booking_state_machine_invalid_transition():
    # Direct jump from BOOKED to PAID must be rejected with InvalidStateTransitionError
    with pytest.raises(InvalidStateTransitionError):
        BookingStateMachine.transition(BookingStatusEnum.BOOKED, BookingStatusEnum.PAID)

# 3. Security Test: Centre Isolation (Requirement 15 & 52)
def test_procurer_centre_isolation():
    procurer = CurrentUserProvider(user_id="usr-off1", role="PROCURER", centre_id="cnt-a")
    
    # Accessing assigned centre -> ALLOWED
    CentreAccessChecker.verify_centre_access(procurer, "cnt-a")

    # Accessing unassigned centre -> DENIED (Raises CentreAccessDeniedError)
    with pytest.raises(CentreAccessDeniedError):
        CentreAccessChecker.verify_centre_access(procurer, "cnt-b")

# 4. Security Test: Farmer Ownership (Requirement 16 & 52)
def test_farmer_ownership_isolation():
    farmer_a = CurrentUserProvider(user_id="usr-f1", role="FARMER", farmer_id="F-A")

    # Accessing own resource -> ALLOWED
    FarmerOwnershipChecker.verify_ownership(farmer_a, "F-A")

    # Accessing another farmer's resource -> DENIED (Raises FarmerOwnershipError)
    with pytest.raises(FarmerOwnershipError):
        FarmerOwnershipChecker.verify_ownership(farmer_a, "F-B")
