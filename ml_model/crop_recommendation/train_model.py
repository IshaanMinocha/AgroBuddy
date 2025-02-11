import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Read the dataset with error handling
try:
    df = pd.read_csv('/Users/aditya/Desktop/CODEATHON/python/projup2/Crop Recommendation dataset.csv', 
                     on_bad_lines='skip',
                     encoding='utf-8')
    
    df = df.dropna()
    
    if 'crop' in df.columns:
        df = df.rename(columns={'crop': 'label'})
    
    # Print column names to verify
    print(f"Successfully loaded {len(df)} rows of data")
    print("Columns in dataset:", df.columns.tolist())
    
except Exception as e:
    print(f"Error reading CSV file: {e}")
    exit(1)

# Clean the data
df = df[df.notna().all(axis=1)]

# Separate features and target (using 'Crop' instead of 'label')
X = df.drop('Crop', axis=1)
y = df['Crop']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions and evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("\nModel Performance:")
print(f"Accuracy: {accuracy * 100:.2f}%")
print("\nDetailed Classification Report:")
print(classification_report(y_test, y_pred))

# Save the model with compression
joblib.dump(model, 'crop_recommendation_model.pkl', compress=3)
print("\nModel saved as 'crop_recommendation_model.pkl'")