import numpy as np
import joblib

# N (Nitrogen) - ratio of Nitrogen content in soil (mg/kg)
# P (Phosphorus) - ratio of Phosphorus content in soil (mg/kg)
# K (Potassium) - ratio of Potassium content in soil (mg/kg)
# temperature - Temperature in degrees Celsius (°C)
# humidity - Relative humidity in percentage (%)
# ph - pH value of the soil (0-14 scale)
# rainfall - Rainfall in millimeters (mm)

def validate_input(N, P, K, temperature, humidity, ph, rainfall):
    # Check ranges
    if not (0 <= N <= 140):
        return False, "Nitrogen content must be between 0-140"
    if not (5 <= P <= 145):
        return False, "Phosphorus content must be between 5-145"
    if not (5 <= K <= 205):
        return False, "Potassium content must be between 5-205"
    if not (8.83 <= temperature <= 43.68):
        return False, "Temperature must be between 8.83-43.68°C"
    if not (14.26 <= humidity <= 99.98):
        return False, "Humidity must be between 14.26-99.98%"
    if not (3.50 <= ph <= 9.94):
        return False, "pH must be between 3.50-9.94"
    if not (20.21 <= rainfall <= 298.56):
        return False, "Rainfall must be between 20.21-298.56mm"
    
    # Check logical relationships
    if humidity < 30 and rainfall > 200:
        return False, "Invalid combination: Low humidity with high rainfall"
    if temperature > 35 and humidity < 40:
        return False, "Invalid combination: High temperature with very low humidity"
    if temperature < 15 and humidity > 90:
        return False, "Invalid combination: Low temperature with very high humidity"
    
    return True, "Valid input"

def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    model = joblib.load('crop_recommendation_model.pkl')
    features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    prediction = model.predict(features)
    return prediction[0]

def get_user_input():
    print("\n=== Crop Recommendation System ===")
    print("Enter the following soil and environmental parameters:")
    try:
        N = float(input("\nNitrogen content in soil (0-140 mg/kg): "))
        P = float(input("Phosphorus content in soil (5-145 mg/kg): "))
        K = float(input("Potassium content in soil (5-205 mg/kg): "))
        temperature = float(input("Temperature (8.83-43.68 °C): "))
        humidity = float(input("Humidity (14.26-99.98 %): "))
        ph = float(input("pH value of soil (3.50-9.94): "))
        rainfall = float(input("Rainfall (20.21-298.56 mm): "))
        
        is_valid, message = validate_input(N, P, K, temperature, humidity, ph, rainfall)
        
        if not is_valid:
            print(f"\n❌ Invalid inputs: {message}")
            return get_user_input()
        
        prediction = predict_crop(N, P, K, temperature, humidity, ph, rainfall)
        print(f"\n🌱 Recommended crop for your conditions: {prediction}")
        
    except ValueError:
        print("\n❌ Error: Please enter valid numerical values!")
        return get_user_input()

if __name__ == "__main__":
    while True:
        choice = input("\nWould you like to make a prediction? (y/n): ")
        if choice.lower() == 'y':
            get_user_input()
        else:
            break