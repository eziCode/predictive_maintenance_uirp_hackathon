from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load your trained model
def preprocess_and_engineer_features(df, columns_to_drop, lags=3, rolling_windows=[5, 10, 20], diff_periods=[1, 3], ewma_spans=[10, 20]):
    processed_df = df.copy()
    if 'sample_id' not in processed_df.columns:
        temp_sample_id_present = False
    else:
        temp_sample_id_present = True
        processed_df = processed_df.sort_values(by=['sample_id']).reset_index(drop=True)

    numerical_cols_for_fe = [
        col for col in processed_df.columns
        if pd.api.types.is_numeric_dtype(processed_df[col]) and
           col not in ['sample_id', 'remaining_useful_life_hours']
    ]
    for col in numerical_cols_for_fe:
        for i in range(1, lags + 1):
            if temp_sample_id_present:
                processed_df[f'{col}_lag_{i}'] = processed_df.groupby('sample_id')[col].shift(i)
            else:
                processed_df[f'{col}_lag_{i}'] = processed_df[col].shift(i)
        for window in rolling_windows:
            if temp_sample_id_present:
                processed_df[f'{col}_rolling_mean_{window}'] = processed_df.groupby('sample_id')[col].rolling(window=window).mean().reset_index(level=0, drop=True)
                processed_df[f'{col}_rolling_std_{window}'] = processed_df.groupby('sample_id')[col].rolling(window=window).std().reset_index(level=0, drop=True)
            else:
                processed_df[f'{col}_rolling_mean_{window}'] = processed_df[col].rolling(window=window).mean()
                processed_df[f'{col}_rolling_std_{window}'] = processed_df[col].rolling(window=window).std()
        for period in diff_periods:
            if temp_sample_id_present:
                processed_df[f'{col}_diff_{period}'] = processed_df.groupby('sample_id')[col].diff(periods=period)
            else:
                processed_df[f'{col}_diff_{period}'] = processed_df[col].diff(periods=period)
        for span in ewma_spans:
            if temp_sample_id_present:
                processed_df[f'{col}_ewma_{span}'] = processed_df.groupby('sample_id')[col].ewm(span=span, adjust=False).mean().reset_index(level=0, drop=True)
            else:
                processed_df[f'{col}_ewma_{span}'] = processed_df[col].ewm(span=span, adjust=False).mean()
    if 'remaining_useful_life_hours' in processed_df.columns:
        y = processed_df['remaining_useful_life_hours']
    else:
        y = None
    existing_columns_to_drop = [col for col in columns_to_drop if col in processed_df.columns]
    X = processed_df.drop(columns=existing_columns_to_drop, axis=1)
    for col in X.columns:
        if X[col].dtype == 'object':
            X = X.drop(columns=[col])
    initial_rows = X.shape[0]
    if y is not None:
        X_aligned, y_aligned = X.align(y, join='inner', axis=0)
        combined_for_dropna = pd.concat([X_aligned, y_aligned], axis=1)
        combined_for_dropna.dropna(inplace=True)
        X = combined_for_dropna.drop(columns=['remaining_useful_life_hours'])
        y = combined_for_dropna['remaining_useful_life_hours']
    else:
        X.dropna(inplace=True)
    return X, y

model = joblib.load('/Users/R3WFWYW/predictive_maintenance_uirp_hackathon/mae_403.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # --- 1. Load Model and the FULL Historical Data for the sample ---
        full_history_df = pd.read_csv('/Users/R3WFWYW/predictive_maintenance_uirp_hackathon/frontend/public/sample_0_data.csv')
        full_history_df = full_history_df.head(30)

        # --- 2. Process the ENTIRE History to Generate Features Correctly ---
        columns_to_drop = [
            'sample_id', 'date', 'type_of_failure', 'failure_imminent',
            'failure_occurred', 'remaining_useful_life_hours'
        ]

        print("Processing full history to engineer features for prediction...")
        X_processed, y_processed = preprocess_and_engineer_features(full_history_df, columns_to_drop)

        # --- 3. Select the Final Rows for Prediction ---
        X_to_predict = X_processed.tail(5)
        y_actual = y_processed.tail(5) if y_processed is not None else None

        # --- 4. Align Columns and Predict ---
        model_features = model.get_booster().feature_names
        X_to_predict_aligned = X_to_predict.reindex(columns=model_features, fill_value=0)

        print("\nMaking predictions on the last 5 time steps...")
        predictions = model.predict(X_to_predict_aligned)

        # --- 5. Return JSON Response ---
        # Convert numpy array to Python types and return proper JSON
        current_prediction = float(predictions[-1]) if len(predictions) > 0 else 50.0

        return jsonify({
            'hours_until_failure': int(current_prediction),
            'component': 'Engine',
            'confidence': 0.85,
            'all_predictions': [float(p) for p in predictions],  # Optional: include all predictions
            'actual_values': [float(a) for a in y_actual.values] if y_actual is not None else None
        })

    except FileNotFoundError as e:
        print(f"Error: {e}")
        return jsonify({'error': 'CSV file not found'}), 400
    
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)