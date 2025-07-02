# Remaining Useful Life (RUL) Prediction
![](https://play-lh.googleusercontent.com/7pYpIOAKj-nqcGQClV7V2JBq_sPZWg2AzDJUMW3P1maHwvldlz0vCay3txVoFDM18lw)
## Overview
This project develops a machine learning model to accurately predict when an John Deere tractor will break and what specific part will fail. Using sensor telemetry, maintenance history, and model information, the model provides necessary foresight to act proactively. This feature lies under the *Analyze* section of the John Deere Operations Center.

![](https://www.legalreader.com/wp-content/uploads/2017/03/Tractor_john_deere-8320R.jpg)

Video Presentation: [![RUL Predictor(UIRP Hackathon)](https://i9.ytimg.com/vi/D9VeQEKnJwU/mqdefault.jpg?sqp=CNi8ksMG-oaymwEmCMACELQB8quKqQMa8AEB-AHMB4AC0AWKAgwIABABGDwgSyhyMA8=&rs=AOn4CLCi38-4ujq-CZ0XZOAd8HD6IG8TxQ)](https://youtu.be/D9VeQEKnJwU)


## Model Training and Data Collection
### Generating Synthetic Data
Due to privacy reasons, we were unable to access authentic John Deere tractor sensor readings. As a result, we created our own hyper-realistic data. Below is how we did that in `generate_synthetic_data.py`.

#### 1. Simulating a Realistic Environment
To make the data authentic, the script doesn't just generate random numbers. It models real-world conditions relevant to farming in Champaign, IL.
- **Seasonal Usage Profile:** The `MONTHLY_OPERATING_PROFILE`  dictates that tractors are used heavily during planting (April-May) and harvest (September-October) seasons and much less during the winter. This creates realistic fluctuations in monthly operating hours.
- **Weather Simulation:** The `get_simulated_weather` function generates plausible weather data based on the time of year, as environmental conditions can severely impact the health of tractors.

#### 2. Generating Data Over Time
The script iterates through each month for each tractor, simulating its life until the predetermined failure occurs. In each monthly step, it does the following:
1. **Calculates Operating Hours:** Determines tractor's usage for that month based on the seasonal profile.
2. **Calculates Remaining Useful Life (RUL):** Calculated as: `RUL = (Failure Hours for this Tractor) - (Current Cumulative Hours)`.
3. **Checks for Failure:** Checks if the tractor's cumulative hours are within the `FAILURE_WINDOW_HOURS` (e.g., 500 hours) of its scheduled failure.
4. **Generates Sensor Data:**
	- If the tractor is operating normally, sensor values are generated randomly within their defined `SENSOR_BASELINES`.
	- **If a failure is approaching**, the script consults the `FAILURE_TRENDS`, intentionally altering the values of the relevant sensors, making the deviation more extreme as the tractor gets closer to the failure point.


### Machine Learning Model

The main goal of our model is to predict the **Remaining Useful Life (RUL)** of a John Deere Tractor based on sensor data over time. The model uses an **XGBoost Regressor** to make these predictions. Below is a step-by-step description of how it works.

#### 1. Data Loading and Combining
First, the script loads data from two separate folders: `training_data_csv` and `validation_data_csv`.
- It iterates through all the `.csv` files in the `training_data_csv` folder
- Each CSV file is read into a pandas DataFrame
- All these individual DataFrames are then combined into a single, large training dataset
- This process is repeated for the validation data
#### 2. Feature Engineering
The raw sensor data isn't enough to make accurate predictions; the model needs features that describe trends and changes over time. This function creates new features based on the existing numerical columns for each unique `sample_id` (representing a single machine).
- **Lag Features:** Creates columns with values from previous time steps (e.g., the sensor reading from 1, 2, and 3 time steps ago). This helps the model see the recent history of each sensor.
- **Rolling Statistics:** Calculates the `mean`, `standard deviation`, `min`, and `max` over a moving window of time (e.g., the last 5, 10, or 20 readings). This helps smooth out noise and identify recent trends.
- **Rate of Change (Differencing):** Finds the difference between the current reading and a past reading (e.g., 1 or 3 steps ago). This essentially calculates the "velocity" or momentum of a sensor's readings.
- **Exponentially Weighted Moving Averages (EWMA):** Advanced type of moving average that gives more weight to recent data points.

After creating all these new features, the function cleans the data by dropping any rows with missing values (`NaN`), which are naturally created by these time-series operations.

#### 3. Model Tuning and Hyperparameter Tuning
Once the features are engineered, the script trains the model. It doesn't just train one model; it searches for the best possible version of the model.
- **Model Choice:** It uses `XGBRegressor` (eXtreme Gradient Boosting).
- **Data Split:** The full training dataset is split into a training set (80%) and a test set (20%). The model learns from the training set, and its performance is later checked against the unseen validation set.
- **Hyperparameter Tuning:** The script uses `RandomizedSearchCV` to automatically find the best settings (hyperparameters) for the XGBoost model. Instead of trying every single combination, it runs 6 (`n_iter=6`) different trials with random combinations of parameters like `learning_rate`, `max_depth`, and `n_estimators`.
- **Cross-Validation:** During this search, it uses 5-fold cross-validation (`cv=5`). The training data is split into 5 parts; the model trains on 4 and validates on the 5th, rotating through all parts. This ensures the best parameters found are robust and not just overfitted to one specific slice of the data.
- **Best Model:** The `RandomizedSearchCV` identifies the combination of hyperparameters that resulted in the lowest Mean Squared Error.

#### 4. Model Evaluation
After the best model is found, the script evaluates its performance in two stages:
- **On the Internal Test Set:** It makes predictions on the 20% of the original training data that it never saw during training. This gives a reliable estimate of how well the model learned from the source data.
- **On the New Validation Data:** It processes the data from the `validation_data_csv` folder using the _exact same_ feature engineering steps. It then makes predictions on this completely new dataset. This is the ultimate test of how well the model **generalizes** to data it has never encountered before.

For both evaluations, it calculates and prints four key metrics:
- **R-squared (R2):** How much of the variance in the RUL the model can explain.
- **Mean Absolute Error (MAE):** The average absolute difference between the predicted and actual RUL, in hours.
- **Mean Squared Error (MSE):** The average of the squared errors.
- **Root Mean Squared Error (RMSE):** The square root of the MSE, which puts the error back into the original units (hours).

Our highest performing model had these statistics on never-before-seen data:
- **R2:** 0.9323
- **MAE:** 403.6444
- **MSE:** 425797.6214
- **RMSE:** 652.5317

#### 5. Saving the Model
The script uses `joblib.dump` to save the fully trained and tuned `best_model` to a file named `mae_403.joblib`. This saved file can be loaded later to make predictions on new data without having to go through the entire training and tuning process again.

## User Interface
The front-end interface is a user-friendly dashboard designed for monitoring and predicting machine maintenance needs, particularly for agricultural machinery such as the John Deere X9 1000 combine harvester. The layout is clean and logically divided into functional sections for easy interaction and real-time decision-making. Key features include:

#### 1. Machine Model Selection Dropdown
- Component: Dropdown menu labeled "Select Model"
- Functionality: Allows users to choose between different machine models for analysis (e.g., X9 1000).
- Associated Action: An “Analyze” button triggers prediction or data retrieval based on the selected model.

#### 2. RUL Prediction Output
- Main Highlight: Displays an Expected Operational Hours value before potential failure (e.g., “3247 Operational Hours”).
- Priority Indicator: Visual priority level (e.g., Low) helps users gauge urgency at a glance.

#### 3. Maintenance Scheduler
- Component: A clearly visible green button titled “Schedule Maintenance.”
- Functionality: Allows users to proactively plan and book service appointments based on prediction data.

#### 4. Data Input Field
- Component: "Select Data" autocomplete input.
- Purpose: Lets users input specific telemetry, environmental, or usage data for custom analysis or exploration.

#### 5. Past Maintenance History Table
- Structure: Displays a scrollable and paginated table showing historical service data.

- Columns:
- Date: Timestamp of maintenance events.
- Component: Affected machinery part (e.g., Engine, Brakes).
- Maintenance Notes: Descriptions of actions performed (e.g., “Oil changed, filter replaced”).

#### 6. Machine Overview Section (Sidebar)
- Visual Aid: Image of the selected machine (X9 1000).
- Specs Summary: Key technical specs listed, including:
- Unload rate
- Grain tank capacity
- Engine type
- Horsepower

## Collaborators
- Manasi Mangalvedhe: incoming senior at UIUC, Analytics & Accounting Intern at John Deere
- Vedha Bant: incoming junior at UIUC, Data Science Intern at John Deere
- Emily Park: incoming junior at UIUC, SWE Intern at John Deere
- Kavya Puranam: incoming PhD student at UIUC, Data Science Intern at John Deere
- Ezra Akresh: incoming freshman at Goergia Tech, Intern at PowerWorld
- Oren Akresh: incoming junior at Academy High, Intern at Singleton Law Firm

