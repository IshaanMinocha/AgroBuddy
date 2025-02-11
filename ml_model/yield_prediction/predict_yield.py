import pickle

# Load the saved model and preprocessors
with open('/Users/aditya/Desktop/CODEATHON/python/yield/yield_Prediction.pkl', 'rb') as f:
    model_objects = pickle.load(f)

model = model_objects['model']
scaler = model_objects['scaler']
le_season = model_objects['le_season']
le_crop = model_objects['le_crop']

def validate_input(value, min_val, max_val, name):
    try:
        val = float(value)
        if min_val <= val <= max_val:
            return val
        else:
            print(f"Error: {name} must be between {min_val} and {max_val}")
            return None
    except ValueError:
        print(f"Error: Please enter a valid number for {name}")
        return None

def get_valid_input(prompt, min_val, max_val, name):
    while True:
        value = validate_input(input(prompt), min_val, max_val, name)
        if value is not None:
            return value

# Get validated input
temperature = get_valid_input("Enter temperature (25-37°C): ", 25, 37, "Temperature")
humidity = get_valid_input("Enter humidity (35-62%): ", 35, 62, "Humidity")
soil_moisture = get_valid_input("Enter soil moisture (45-62%): ", 45, 62, "Soil moisture")
area = get_valid_input("Enter area (1-50000 acres): ", 1, 50000, "Area")

valid_seasons = ["Kharif", "Rabi", "Whole Year", "Autumn"]
while True:
    print("\nAvailable seasons:", ", ".join(valid_seasons))
    season = input("Enter season: ").strip()
    if season in valid_seasons:
        break
    print("Error: Invalid season")

valid_crops = ["Rice", "Maize", "Cotton(lint)", "Banana", "Moong(Green Gram)", 
               "Urad", "Arhar/Tur", "Grapes", "Mango", "Orange", "Papaya", "Masoor"]

while True:
    print("\nAvailable crops:", ", ".join(valid_crops))
    crop = input("Enter crop: ").strip()
    if crop in valid_crops:
        break
    print("Error: Invalid crop")

# Transform categorical inputs
season_encoded = le_season.transform([season])[0]
crop_encoded = le_crop.transform([crop])[0]

# Create input array
input_data = [[season_encoded, crop_encoded, temperature, 
               humidity, soil_moisture, area]]

# Scale input
input_scaled = scaler.transform(input_data)

# Make prediction
prediction = model.predict(input_scaled)[0]

print(f"\nPredicted Production: {prediction:.2f} tons")
print(f"Yield per acre: {(prediction/area):.2f} tons/acre")