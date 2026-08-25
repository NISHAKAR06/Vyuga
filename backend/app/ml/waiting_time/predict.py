import os
import joblib
import pandas as pd
import numpy as np

# Load model path
MODEL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'waiting_time_model.pkl')
_model = None

def get_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_FILE):
            try:
                _model = joblib.load(MODEL_FILE)
            except Exception as e:
                print(f"Warning: Failed to load waiting time model: {e}")
        else:
            print(f"Warning: Waiting time model file not found at {MODEL_FILE}")
    return _model

def predict_waiting_time(
    farmers_ahead: int,
    currently_waiting: int,
    currently_processing: int,
    active_counters: int,
    average_processing_time: float,
    hour: int,
    day_of_week: int
) -> float:
    """
    Predicts approximate waiting time in minutes using Random Forest model.
    Falls back to a robust queue heuristic if the model file is not available or errors out.
    """
    model = get_model()
    if model is None:
        # Fallback heuristic: base wait based on counters + some offset
        num_counters = max(1, active_counters)
        fallback_val = (farmers_ahead / num_counters) * average_processing_time + 5.0
        return round(max(2.0 if farmers_ahead > 0 else 0.0, fallback_val), 1)
        
    try:
        # Prepare tabular input for model
        input_data = pd.DataFrame([{
            'farmers_ahead': int(farmers_ahead),
            'currently_waiting': int(currently_waiting),
            'currently_processing': int(currently_processing),
            'active_counters': int(active_counters),
            'average_processing_time': float(average_processing_time),
            'hour': int(hour),
            'day_of_week': int(day_of_week)
        }])
        
        pred = model.predict(input_data)[0]
        return round(float(pred), 1)
    except Exception as e:
        print(f"Warning: Error during waiting time prediction: {e}. Returning fallback heuristic.")
        num_counters = max(1, active_counters)
        fallback_val = (farmers_ahead / num_counters) * average_processing_time + 5.0
        return round(max(2.0 if farmers_ahead > 0 else 0.0, fallback_val), 1)
