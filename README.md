# AgroBuddy

A comprehensive AI-powered solution for farmers to enhance agricultural productivity and yield optimization.

## Live Demo
[agrobuddy.ishaanminocha.in](https://agrobuddy.ishaanminocha.in/)

## Demo Video
[![Watch the video](https://img.youtube.com/vi/Sb73pakmZqs/0.jpg)](https://www.youtube.com/watch?v=Sb73pakmZqs)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Datasets](#datasets)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the Project](#running-the-project)
- [ML Models](#ml-models)
- [Contributing](#contributing)

## Overview
AgroBuddy is an innovative agricultural management platform that leverages IoT technology, artificial intelligence, and real-time analytics to help farmers make data-driven decisions. The platform provides essential tools such as crop disease detection, yield prediction, and intelligent crop recommendations through an intuitive mobile interface.

## Features
### IoT Integration & Analytics
- Real-time sensor data monitoring
- Location-based environmental analytics
- Smart irrigation management

### AI-Powered Solutions
- Image-based disease and pest detection
- Crop yield prediction using machine learning
- Personalized crop recommendations

### Smart Communication
- Multilingual chatbot for farmer assistance
- Real-time weather alerts
- Community-driven discussions and support

### Market Intelligence
- AI-driven price forecasting for crops
- Optimized logistics recommendations
- Market trend analysis for better decision-making

## Tech Stack
### Frontend:
- React Native
- React
- Tailwind CSS
- Socket.io Client

### Backend:
- Node.js
- Express.js
- Flask
- MongoDB

### AI/ML:
- PyTorch
- Scikit-learn

### Cloud Services:
- AWS EC2
- Cloudinary
- Socket.io

### External Services:
- Weather API
- RN Geolocation
- Expo Camera

## Datasets
### Crop Recommendation
- [Crop_recommendation](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset?select=Crop_recommendation.csv)

### Yield Prediction
- [Crop Prediction dataset](https://github.com/AbhishekKandoi/Crop-Yield-Prediction-based-on-Indian-Agriculture/blob/main/Crop%20Prediction%20dataset.csv)

### Disease Detection
- [new-plant-diseases-dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset)

## Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **Python 3.9** (for ML models)
- **MongoDB** (for database management)

## Setup and Installation
### Clone the repository:
```bash
git clone https://github.com/IshaanMinocha/AgroBuddy.git
cd AgroBuddy
```

### Setup the Website:
```bash
cd website
npm install
npm run dev
```

### Download the App or Set Up Mobile Development:
1. Download the app from the website
 **OR**
2. Set up a mobile development environment:
   - Download Expo Go:
     - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
     - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - Create an Expo account at [expo.dev](https://expo.dev)
   - Log in to Expo Go using your credentials

### Setup the Frontend (React Native App):
```bash
cd app
npm install -g eas-cli
npx eas login 
npm install
npm run dev 
```
*** Scan QR code to run app

### Setup the Backend (Express Server):
```bash
cd ../server
npm install
echo "PORT=
MONGO_URI=
JWT_SECRET=
OPENAI_API_KEY=
OPENAI_API_URL=
ELEVENLABS_VOICE_ID=
ELEVENLABS_API_KEY=
ELEVENLABS_API_URL=" > .env
#add your env variables
npm run dev
```

### Setup the ML Model Server (Flask):
```bash
cd ../ml_model
python -m venv venv
```
#### Activate Virtual Environment:
- **For macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```
- **For Windows:**
  ```bash
  venv\Scripts\Activate
  ```

#### Install Dependencies and Run the Server:
```bash
pip install -r requirements.txt
python main.py
```

## Running the Project
Start the services in the following order:
1. **MongoDB** (Ensure MongoDB service is running)
2. **Backend (Express.js)** (`npm run dev` in `/server`)
3. **Machine Learning API (Flask)** (`python main.py` in `/ml_model`)
4. **Website (React-based frontend)** (`npm run dev` in `/website`)
5. **Frontend (React Native app)** (`npm run dev` in `/app`)

## ML Models
The platform integrates multiple AI-powered models to enhance decision-making:
- **Disease & Pest Detection:** Uses image recognition to identify crop diseases.
- **Yield Prediction:** Machine learning models trained on past yield data.
- **Intelligent Crop Recommendations:** Suggests optimal crops based on soil, climate, and season.

## Contributing
Contributions are welcome! Follow these steps to contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feature-branch`)
5. Open a Pull Request
