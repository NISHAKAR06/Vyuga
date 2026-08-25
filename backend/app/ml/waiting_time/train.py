import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import os

def generate_synthetic_data(num_samples=2500, random_seed=42):
    np.random.seed(random_seed)
    
    # 1. Generate features within realistic bounds
    farmers_ahead = np.random.randint(0, 30, size=num_samples)
    currently_waiting = farmers_ahead + np.random.randint(0, 10, size=num_samples)
    currently_processing = np.random.randint(1, 5, size=num_samples)
    active_counters = np.random.randint(1, 6, size=num_samples)
    # Average processing time between 5 and 12 minutes
    average_processing_time = np.random.uniform(5.0, 12.0, size=num_samples)
    # Operating hours: 9 AM to 5 PM (9 to 17)
    hour = np.random.randint(9, 18, size=num_samples)
    day_of_week = np.random.randint(0, 7, size=num_samples)
    
    # 2. Derive target waiting time with realistic queue mechanics
    # Base queue wait time: (farmers_ahead / active_counters) * average_processing_time
    base_wait = (farmers_ahead / active_counters) * average_processing_time
    
    # Congestion/Load overhead
    overhead = 0.4 * currently_waiting + 1.2 * currently_processing
    
    # Peak hour impact (10 AM to 2 PM are busiest)
    hour_factor = np.where((hour >= 10) & (hour <= 14), 1.25, 0.85)
    
    # Peak day impact (Monday=0 and Friday=4 are busier)
    day_factor = np.where((day_of_week == 0) | (day_of_week == 4), 1.15, 0.90)
    
    # Random operational noise (turnaround variance)
    noise = np.random.normal(0, 2.0, size=num_samples)
    
    # Calculate target
    waiting_time_minutes = (base_wait * hour_factor * day_factor) + overhead + noise
    
    # Post-process to ensure physical consistency:
    # If 0 farmers are ahead, waiting time is just processing time of the current slot, capped minimally
    waiting_time_minutes = np.where(
        farmers_ahead == 0,
        np.maximum(1.0, (currently_processing / active_counters) * 3.0 + noise),
        np.maximum(2.0, waiting_time_minutes)
    )
    
    # Round wait time to 1 decimal place
    waiting_time_minutes = np.round(waiting_time_minutes, 1)
    
    df = pd.DataFrame({
        'farmers_ahead': farmers_ahead,
        'currently_waiting': currently_waiting,
        'currently_processing': currently_processing,
        'active_counters': active_counters,
        'average_processing_time': np.round(average_processing_time, 2),
        'hour': hour,
        'day_of_week': day_of_week,
        'waiting_time_minutes': waiting_time_minutes
    })
    
    return df

def clean_data(df):
    # Ensure no negative waiting times
    df = df[df['waiting_time_minutes'] >= 0].copy()
    # Drop any extreme duplicates/anomalies (if any)
    df = df.dropna()
    return df

def main():
    print("Generating synthetic prototype training data...")
    df = generate_synthetic_data(num_samples=3000)
    df = clean_data(df)
    
    X = df[['farmers_ahead', 'currently_waiting', 'currently_processing', 
            'active_counters', 'average_processing_time', 'hour', 'day_of_week']]
    y = df['waiting_time_minutes']
    
    # Split using train_test_split with random_state=42 for reproducibility
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training set size: {X_train.shape[0]}, Test set size: {X_test.shape[0]}")
    
    # Train Random Forest Regressor
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=12)
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Evaluate
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print("\n--- Model Evaluation Metrics ---")
    print(f"Mean Absolute Error (MAE): {mae:.2f} minutes")
    print(f"Root Mean Squared Error (RMSE): {rmse:.2f} minutes")
    print(f"R² (Coefficient of Determination): {r2:.4f}")
    
    # Feature Importance
    importances = model.feature_importances_
    features = X.columns
    importance_df = pd.DataFrame({
        'Feature': features,
        'Importance': importances
    }).sort_values(by='Importance', ascending=False)
    
    print("\n--- Feature Importances ---")
    for idx, row in importance_df.iterrows():
        print(f"{row['Feature']:<25}: {row['Importance']*100:.1f}%")
        
    # Save Model
    dir_path = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(dir_path, 'waiting_time_model.pkl')
    joblib.dump(model, model_path)
    print(f"\nModel saved successfully at: {model_path}")
    
    # Save a small sample dataset for verification
    dataset_path = os.path.join(dir_path, 'synthetic_training_data.csv')
    df.to_csv(dataset_path, index=False)
    print(f"Synthetic training data saved at: {dataset_path}")

if __name__ == '__main__':
    main()
