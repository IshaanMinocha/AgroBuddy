import React, { useState } from 'react';
import { ScrollView, View, Dimensions, Text, TouchableOpacity, TextInput } from 'react-native';
import {
  Card, Title, Paragraph, Appbar, Surface, IconButton,
  SegmentedButtons, Chip, ProgressBar,
  Button,
  MD3Colors
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { MODEL_URI, BACKEND_URL } from "@env"
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';

const YieldMonitoringPage = () => {
  const [recommendationData, setRecommendationData] = useState({
    nitrogen: '90',
    phosphorus: '42',
    potassium: '43',
    temperature: '20.8',
    humidity: '82',
    ph: '6.5',
    rainfall: '202.9'
  });

  const [yieldData, setYieldData] = useState({
    temperature: '30',
    humidity: '50',
    soil_moisture: '55',
    area: '1000',
    season: 'Kharif',
    crop: 'Rice'
  });

  const handleRecommendationChange = (name, value) => {
    setRecommendationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleYieldChange = (name, value) => {
    setYieldData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const [selectedField, setSelectedField] = useState('Field 1');
  const [recommendation, setRecommendation] = useState();
  const [yieldPred, setYieldPred] = useState();
  const [yieldRec, setYieldRec] = useState('');
  const [done, setDone] = useState(false);

  const getRecommendation = async () => {
    try {
      console.log("first")
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      console.log(recommendation, "result");
      const content = `Crop is ${recommendation}. Here is another data: ${JSON.stringify(recommendationData)} & ${JSON.stringify(yieldData)}.`;
      console.log(content, "content");

      const res = await axios.post(`${BACKEND_URL}/api/recommendation/chat`, { prompt: content, usecase: "yield" }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.answer, "res");
      setDone(true);
      setYieldRec(res.data.answer);
    } catch (err) {
      setError('Failed to give recommendations. Please try again.');
      console.error('API Error:', err);
    } finally {
      // setLoadingRecommendations(false);
    }
  };

  const sensorData = {
    soilHealth: {
      nitrogen: 45, // percentage
      phosphorus: 32,
      potassium: 28,
      pH: 6.5,
      moisture: 65,
    },
    weather: {
      temperature: 28,
      humidity: 75,
      forecast: [
        { day: 'Today', temp: 28, condition: 'sunny' },
        { day: 'Tomorrow', temp: 27, condition: 'partly-cloudy' },
        { day: 'Wed', temp: 29, condition: 'rainy' },
      ],
    },
    historicalMoisture: [60, 65, 62, 65, 63, 65],
    historicalNPK: [
      { n: 42, p: 30, k: 25 },
      { n: 43, p: 31, k: 26 },
      { n: 44, p: 31, k: 27 },
      { n: 45, p: 32, k: 28 },
    ],
  };

  const getCropRecommendation = async () => {
    try {
      const payload = {
        ...recommendationData,
        nitrogen: parseFloat(recommendationData.nitrogen),
        phosphorus: parseFloat(recommendationData.phosphorus),
        potassium: parseFloat(recommendationData.potassium),
        temperature: parseFloat(recommendationData.temperature),
        humidity: parseFloat(recommendationData.humidity),
        ph: parseFloat(recommendationData.ph),
        rainfall: parseFloat(recommendationData.rainfall),
      };
      const response = await axios.post(`${MODEL_URI}/recommend-crop`, payload);
      console.log(response.data.recommended_crop, 'response crop');
      setRecommendation(response.data.recommended_crop);
    } catch (e) {
      console.error('Error getting crop recommendation:', e);
    }
  };

  const getYieldPrediction = async () => {
    try {
      const payload = {
        ...yieldData,
        temperature: parseFloat(yieldData.temperature),
        humidity: parseFloat(yieldData.humidity),
        soil_moisture: parseFloat(yieldData.soil_moisture),
        area: parseInt(yieldData.area),
      };
      const response = await axios.post(`${MODEL_URI}/predict-yield`, payload);
      console.log(response.data, 'response yield');
      setYieldPred(response.data.yield_per_acre);
    } catch (e) {
      console.error('Error getting yield prediction:', e);
    }
  };

  const cropHealthStatus = () => {
    const { nitrogen, phosphorus, potassium, moisture } = sensorData.soilHealth;
    if (nitrogen > 40 && phosphorus > 30 && potassium > 25 && moisture > 60) {
      return { status: 'Excellent', color: '#4CAF50' };
    } else if (nitrogen > 30 && phosphorus > 20 && potassium > 20 && moisture > 50) {
      return { status: 'Good', color: '#8BC34A' };
    } else {
      return { status: 'Needs Attention', color: '#FFC107' };
    }
  };

  const renderHeader = () => (
    <Appbar.Header>

      <Appbar.Content title="Yield Monitoring" />
      <IconButton icon="refresh" onPress={() => { }} />
    </Appbar.Header>
  );

  const renderFieldSelector = () => (
    <Surface style={styles.fieldSelector}>
      <Button onPress={getCropRecommendation} > Get Recommendation </Button>
      <Button onPress={getYieldPrediction} > Get Yield </Button>
      <SegmentedButtons
        value={selectedField}
        onValueChange={setSelectedField}
        buttons={[
          { value: 'Field 1', label: 'Field 1' },
          { value: 'Field 2', label: 'Field 2' },
          { value: 'Field 3', label: 'Field 3' },
        ]}
      />
    </Surface>
  );

  const renderCropHealthCard = () => {
    const health = cropHealthStatus();
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title>Soil Health Status</Title>
            <Chip icon="circle" style={{ backgroundColor: health.color }}>
              {health.status}
            </Chip>
          </View>

          <View style={styles.healthMetrics}>
            <View style={styles.metricItem}>
              <MaterialCommunityIcons name="leaf" size={24} color="#4CAF50" />
              <Paragraph>NPK Levels</Paragraph>
              <View style={styles.progressContainer}>
                <Paragraph>N: {recommendationData.nitrogen} mg/kg</Paragraph>
                <ProgressBar progress={recommendationData.nitrogen / 140} color="#2196F3" />
              </View>
              <View style={styles.progressContainer}>
                <Paragraph>P: {recommendationData.phosphorus} mg/kg</Paragraph>
                <ProgressBar progress={recommendationData.phosphorus / 145} color="#4CAF50" />
              </View>
              <View style={styles.progressContainer}>
                <Paragraph>K: {recommendationData.potassium} mg/kg</Paragraph>
                <ProgressBar progress={recommendationData.phosphorus / 205} color="#FFC107" />
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderSoilHealthCard = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Soil Conditions</Title>
        <View style={styles.soilMetrics}>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="water" size={24} color="#2196F3" />
            <Paragraph>Humidity</Paragraph>
            <Title>{recommendationData.humidity}%</Title>
          </View>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="test-tube" size={24} color="#FF9800" />
            <Paragraph>pH Level</Paragraph>
            <Title>{recommendationData.ph}</Title>
          </View>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="water-check" size={24} color="#239800" />
            <Paragraph>Rainfall</Paragraph>
            <Title>{recommendationData.rainfall}</Title>
          </View>
        </View>

        {/* <Title style={styles.chartTitle}>Moisture Trends</Title>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
              data: sensorData.historicalMoisture
            }]
          }}
          width={Dimensions.get('window').width - 32}
          height={180}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={styles.chart}
        /> */}
      </Card.Content>
    </Card>
  );

  const renderWeatherCard = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Weather Conditions</Title>
        <View style={styles.weatherContainer}>
          {sensorData.weather.forecast.map((day, index) => (
            <View key={index} style={styles.weatherDay}>
              <Paragraph>{day.day}</Paragraph>
              <MaterialCommunityIcons
                name={day.condition === 'sunny' ? 'weather-sunny' :
                  day.condition === 'rainy' ? 'weather-rainy' : 'weather-partly-cloudy'}
                size={24}
                color="#666"
              />
              <Paragraph>{day.temp}°C</Paragraph>
            </View>
          ))}
        </View>
        <View style={styles.currentWeather}>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="thermometer" size={24} color="#FF5722" />
            <Paragraph>Temperature</Paragraph>
            <Title>{sensorData.weather.temperature}°C</Title>
          </View>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="water-percent" size={24} color="#2196F3" />
            <Paragraph>Humidity</Paragraph>
            <Title>{sensorData.weather.humidity}%</Title>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderRecommendations = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Recommendations</Title>
        <View style={styles.recommendationItem}>
          <Text>
            {yieldRec}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const [showCropRecommendation, setShowCropRecommendation] = useState(false);
  const [showYieldPrediction, setShowYieldPrediction] = useState(false);

  const renderInputs = () => (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowCropRecommendation(!showCropRecommendation)}
      >
        <Text style={styles.buttonText}>{showCropRecommendation ? 'Hide' : 'Show'} Crop Recommendation</Text>
      </TouchableOpacity>
      {showCropRecommendation && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Crop Recommendation</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nitrogen</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={recommendationData.nitrogen}
              onChangeText={(value) => handleRecommendationChange('nitrogen', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phosphorus</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={recommendationData.phosphorus}
              onChangeText={(value) => handleRecommendationChange('phosphorus', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Potassium</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={recommendationData.potassium}
              onChangeText={(value) => handleRecommendationChange('potassium', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Temperature</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={recommendationData.temperature}
              onChangeText={(value) => handleRecommendationChange('temperature', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Humidity</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={recommendationData.humidity}
              onChangeText={(value) => handleRecommendationChange('humidity', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>pH</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={recommendationData.ph}
              onChangeText={(value) => handleRecommendationChange('ph', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rainfall</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={recommendationData.rainfall}
              onChangeText={(value) => handleRecommendationChange('rainfall', value)}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={getCropRecommendation}
          >
            <Text style={styles.buttonText}>Get Recommendation</Text>
          </TouchableOpacity>
          {recommendation ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                Recommended Crop: {recommendation}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {recommendation && renderCropHealthCard()}
      {recommendation && renderSoilHealthCard()}


      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowYieldPrediction(!showYieldPrediction)}
      >
        <Text style={styles.buttonText}>{showYieldPrediction ? 'Hide' : 'Show'} Yield Prediction</Text>
      </TouchableOpacity>
      {showYieldPrediction && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Yield Prediction</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Temperature</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={yieldData.temperature}
              onChangeText={(value) => handleYieldChange('temperature', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Humidity</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={yieldData.humidity}
              onChangeText={(value) => handleYieldChange('humidity', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Soil Moisture</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={yieldData.soil_moisture}
              onChangeText={(value) => handleYieldChange('soil_moisture', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Area</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={yieldData.area}
              onChangeText={(value) => handleYieldChange('area', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Season</Text>
            <TextInput
              style={styles.input}
              value={yieldData.season}
              onChangeText={(value) => handleYieldChange('season', value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Crop</Text>
            <TextInput
              style={styles.input}
              value={yieldData.crop}
              onChangeText={(value) => handleYieldChange('crop', value)}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={getYieldPrediction}
          >
            <Text style={styles.buttonText}>Get Yield Prediction</Text>
          </TouchableOpacity>

          {yieldPred ? (
            <View style={styles.resultContainer}>
              <Text style={[styles.resultText, { marginBottom: 8 }]}>
                Predicted Yield: {yieldPred} tons/acre
              </Text>
              <Text style={styles.resultText} >
                Production: {yieldPred * yieldData.area} tons
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </ScrollView>
  )

  return (
    <>
      {/* {renderHeader()} */}
      <ScrollView style={styles.container}>
        {renderInputs()}
        {/* <Button onPress={getCropRecommendation} > Get Recommendation </Button>
        <Button onPress={getYieldPrediction} > Get Yield </Button> */}
        {/* {renderFieldSelector()} */}
        {/* {recommendation && renderCropHealthCard()} */}
        {/* {recommendation && renderSoilHealthCard()} */}
        {/* {renderWeatherCard()} */}
        {yieldPred &&
          (<>
            <View style={{ marginBottom: 50, marginTop: 20 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={getRecommendation}
              >
                <Text style={styles.buttonText}>Get Recommendation</Text>
              </TouchableOpacity>
            </View>
          </>)}
        {done && renderRecommendations()}
      </ScrollView>
    </>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: MD3Colors.primary50,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 4,
  },
  resultText: {
    fontSize: 16,
    color: '#0369a1',


  },
  fieldSelector: {
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  card: {
    margin: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthMetrics: {
    marginTop: 16,
  },
  soilMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  metricItem: {
    alignItems: 'center',
    gap: 4,
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  chartTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  weatherDay: {
    alignItems: 'center',
    gap: 4,
  },
  currentWeather: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
};

export default YieldMonitoringPage;