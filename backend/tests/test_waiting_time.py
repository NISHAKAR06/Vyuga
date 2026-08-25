import pytest
from app.ml.waiting_time.predict import predict_waiting_time
from app.intelligence.strategies import MLWaitingTimeQueueEngine

def test_waiting_time_prediction_logic():
    # 1. Base prediction check
    wait_time = predict_waiting_time(
        farmers_ahead=5,
        currently_waiting=8,
        currently_processing=2,
        active_counters=2,
        average_processing_time=8.0,
        hour=11,
        day_of_week=1
    )
    assert isinstance(wait_time, (int, float))
    assert wait_time > 0
    
    # 2. Test queue physics (more farmers ahead -> generally higher wait time)
    wait_time_low = predict_waiting_time(
        farmers_ahead=2,
        currently_waiting=5,
        currently_processing=1,
        active_counters=3,
        average_processing_time=8.0,
        hour=11,
        day_of_week=1
    )
    
    wait_time_high = predict_waiting_time(
        farmers_ahead=15,
        currently_waiting=20,
        currently_processing=2,
        active_counters=3,
        average_processing_time=8.0,
        hour=11,
        day_of_week=1
    )
    assert wait_time_high > wait_time_low

@pytest.mark.asyncio
async def test_ml_queue_engine_raw_bookings():
    engine = MLWaitingTimeQueueEngine()
    
    # Mock booking list
    bookings = [
        {"token_number": 41, "status": "Arrived", "active_counters": 3, "average_processing_time": 7.5},
        {"token_number": 42, "status": "Waiting", "active_counters": 3, "average_processing_time": 7.5},
        {"token_number": 43, "status": "Waiting", "active_counters": 3, "average_processing_time": 7.5, "is_target": True}
    ]
    
    res = await engine.analyze_queue(bookings)
    assert res["strategy"] == "MLWaitingTimeQueueEngine"
    assert "predicted_wait_minutes" in res
    assert res["farmers_ahead"] == 2
    
@pytest.mark.asyncio
async def test_ml_queue_engine_feature_dict():
    engine = MLWaitingTimeQueueEngine()
    features = [
        {
            "type": "features",
            "farmers_ahead": 4,
            "currently_waiting": 6,
            "currently_processing": 2,
            "active_counters": 3,
            "average_processing_time": 8.0,
            "hour": 10,
            "day_of_week": 0
        }
    ]
    res = await engine.analyze_queue(features)
    assert res["farmers_ahead"] == 4
    assert res["currently_waiting"] == 6
    assert res["predicted_wait_minutes"] > 0
