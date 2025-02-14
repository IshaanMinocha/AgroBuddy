import React, { useState } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Appbar, Surface, IconButton, 
         SegmentedButtons, Chip, ProgressBar, 
         Button} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import {MODEL_URI} from "@env"
const YieldMonitoringPage = () => {
  const refinedData = {
    temperature: 28,
    humidity: 75,
    rainfall: 65,
    ph: 6.5,
    nitrogen: 45,
    phosphorus: 32,
    potassium: 28,
  }
  const [selectedField, setSelectedField] = useState('Field 1');
  const [envData, setEnvData] = useState(refinedData);
  const [recommendation, setRecommendation] = useState();

 

  // Mock sensor data
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


  const getCropRecommendation = ()=>{
    try{
      const response = axios.post(`${MODEL_URI}/recommend-crop`, 
        {...envData}
      )
      console.log(response.data, "Response");
    }catch(e){
      console.log(e)
    }
  } 
  const cropHealthStatus = () => {
    // Simple analysis based on sensor data
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
      <Button icon="menu"  onPress={getCropRecommendation} />
      <Appbar.Content title="Yield Monitoring" />
      <IconButton icon="refresh" onPress={() => {}} />
    </Appbar.Header>
  );

  const renderFieldSelector = () => (
    <Surface style={styles.fieldSelector}>
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
            <Title>Crop Health Status</Title>
            <Chip icon="circle" style={{ backgroundColor: health.color }}>
              {health.status}
            </Chip>
          </View>
          
          <View style={styles.healthMetrics}>
            <View style={styles.metricItem}>
              <MaterialCommunityIcons name="leaf" size={24} color="#4CAF50" />
              <Paragraph>NPK Levels</Paragraph>
              <View style={styles.progressContainer}>
                <Paragraph>N: {sensorData.soilHealth.nitrogen}%</Paragraph>
                <ProgressBar progress={sensorData.soilHealth.nitrogen / 100} color="#2196F3" />
              </View>
              <View style={styles.progressContainer}>
                <Paragraph>P: {sensorData.soilHealth.phosphorus}%</Paragraph>
                <ProgressBar progress={sensorData.soilHealth.phosphorus / 100} color="#4CAF50" />
              </View>
              <View style={styles.progressContainer}>
                <Paragraph>K: {sensorData.soilHealth.potassium}%</Paragraph>
                <ProgressBar progress={sensorData.soilHealth.potassium / 100} color="#FFC107" />
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
            <Paragraph>Moisture</Paragraph>
            <Title>{sensorData.soilHealth.moisture}%</Title>
          </View>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="test-tube" size={24} color="#FF9800" />
            <Paragraph>pH Level</Paragraph>
            <Title>{sensorData.soilHealth.pH}</Title>
          </View>
        </View>

        <Title style={styles.chartTitle}>Moisture Trends</Title>
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
        />
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
          <MaterialCommunityIcons name="alert" size={24} color="#FFC107" />
          <Paragraph>Consider irrigation in the next 24 hours due to dropping moisture levels.</Paragraph>
        </View>
        <View style={styles.recommendationItem}>
          <MaterialCommunityIcons name="leaf" size={24} color="#4CAF50" />
          <Paragraph>Nitrogen levels are optimal. No fertilization needed this week.</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <>
      {renderHeader()}
      <ScrollView style={styles.container}>
        {renderFieldSelector()}
        {renderCropHealthCard()}
        {renderSoilHealthCard()}
        {renderWeatherCard()}
        {renderRecommendations()}
      </ScrollView>
    </>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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