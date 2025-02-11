import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import pickle

# Load the data
df = pd.read_csv('/Users/aditya/Desktop/CODEATHON/python/yield/filtered_crop_data.csv')

# Remove any rows with missing values
df = df.dropna()

# Create label encoders for categorical variables
le_season = LabelEncoder()
le_crop = LabelEncoder()

# Clean the data by stripping whitespace
df['Season'] = df['Season'].str.strip()
df['Crop'] = df['Crop'].str.strip()

# Transform categorical variables
df['Season'] = le_season.fit_transform(df['Season'])
df['Crop'] = le_crop.fit_transform(df['Crop'])

# Features and target
X = df[['Season', 'Crop', 'Temperature', 'Humidity', 'Soil_Moisture', 'Area']]
y = df['Production']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Create and train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Make predictions
y_pred = model.predict(X_test_scaled)

# Print model performance
print("Model Performance:")
print(f'Mean Squared Error: {mean_squared_error(y_test, y_pred):.2f}')
print(f'R² Score: {r2_score(y_test, y_pred):.2f}')

# Feature importance analysis
feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': model.feature_importances_
})
print("\nFeature Importance:")
print(feature_importance.sort_values('Importance', ascending=False))

# Save the model and preprocessing objects
model_objects = {
    'model': model,
    'scaler': scaler,
    'le_season': le_season,
    'le_crop': le_crop
}

# Save to pickle file
with open('/Users/aditya/Desktop/CODEATHON/python/yield/yield_Prediction.pkl', 'wb') as f:
    pickle.dump(model_objects, f)

print("\nModel and encoders saved to 'yield_Prediction.pkl'")

# Update valid crops list after standardization
valid_crops = ["Rice", "Maize", "Cotton(lint)", "Banana", "Moong(Green Gram)", 
               "Urad", "Arhar/Tur", "Grapes", "Mango", "Orange", "Papaya", "Masoor"]

def predict_production(season, crop, temperature, humidity, soil_moisture, area):
    """
    Make production predictions for given parameters
    """
    # Transform categorical inputs
    season_encoded = le_season.transform([season])[0]
    crop_encoded = le_crop.transform([crop])[0]
    
    # Create input array
    input_data = np.array([[season_encoded, crop_encoded, temperature, 
                           humidity, soil_moisture, area]])
    
    # Scale input
    input_scaled = scaler.transform(input_data)
    
    # Make prediction
    return model.predict(input_scaled)[0]

# Example prediction
prediction = predict_production(
    season="Kharif",
    crop="Rice",
    temperature=36,
    humidity=40,
    soil_moisture=45,
    area=1000
)
print(f"\nExample Prediction:")
print(f"Predicted Production: {prediction:.2f} tons")

# Save unique values for reference
print("\nAvailable options:")
print(f"Seasons: {', '.join(df['Season'].unique())}")
print(f"Crops: {', '.join(df['Crop'].unique())}")