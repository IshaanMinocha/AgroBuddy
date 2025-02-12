import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Surface,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { LineChart } from 'react-native-chart-kit';

const Home = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const yieldData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43],
    }]
  };

  const renderMetricCard = (title, value, change, icon) => (
    <Surface style={styles.metricCard}>
      <Icon name={icon} size={18} color="#444" style={styles.metricIcon} />
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={styles.metricChange}>
        <Icon 
          name={change >= 0 ? 'arrowup' : 'arrowdown'} 
          size={10} 
          color={change >= 0 ? '#4CAF50' : '#F44336'} 
        />
        <Text style={[
          styles.changeText,
          { color: change >= 0 ? '#4CAF50' : '#F44336' }
        ]}>
          {Math.abs(change)}%
        </Text>
      </View>
    </Surface>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Data Insights</Title>
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <Chip
              key={period}
              selected={selectedPeriod === period}
              onPress={() => setSelectedPeriod(period)}
              style={styles.periodChip}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.metricsGrid}>
        {renderMetricCard('Active Farmers', '2,450', 12, 'user')}
        {renderMetricCard('Total Revenue', '$125K', 8, 'wallet')}
        {renderMetricCard('Device Health', '98%', -2, 'API')}
        {renderMetricCard('App Usage', '15.2K', 15, 'appstore')}
      </View>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Title>Yield Analytics</Title>
          <LineChart
            data={yieldData}
            width={Dimensions.get('window').width - 48}
            height={180}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(45, 45, 45, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 12,
  },
  headerTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  periodChip: {
    marginRight: 6,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  metricIcon: {
    marginBottom: 4,
  },
  metricTitle: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 2,
    textAlign: 'center',
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    marginLeft: 4,
    fontSize: 10,
  },
  chartCard: {
    margin: 12,
    elevation: 3,
    borderRadius: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default Home;
