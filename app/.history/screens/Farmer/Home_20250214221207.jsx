import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const weatherData = [
  { id: '1', time: '10:00', temp: '28°', condition: 'sunny' },
  { id: '2', time: '13:00', temp: '32°', condition: 'cloud' },
  { id: '3', time: '16:00', temp: '30°', condition: 'rain' },
  { id: '4', time: '19:00', temp: '27°', condition: 'cloud' },
];

const cropMetrics = [
  { id: '1', title: 'Soil Moisture', value: '45%', icon: 'opacity' },
  { id: '2', title: 'pH Level', value: '6.5', icon: 'science' },
  { id: '3', title: 'NPK', value: 'Good', icon: 'eco' },
];

const actions = [
  { id: '1', title: 'Scan Plant', icon: 'document-scanner' },
  { id: '2', title: 'Get Help', icon: 'support-agent' },
  { id: '3', title: 'Market', icon: 'store' },
];

const tutorials = [
  { id: '1', title: 'Modern Farming Techniques', duration: '5:32', category: 'Education' },
  { id: '2', title: 'Pest Control Methods', duration: '7:45', category: 'Tips' },
  { id: '3', title: 'Water Management', duration: '4:18', category: 'Guide' },
];

const schemes = [
  { id: '1', title: 'PM-KISAN', description: 'Direct income support', icon: 'payments' },
  { id: '2', title: 'Soil Health Card', description: 'Free soil testing', icon: 'grass' },
  { id: '3', title: 'Crop Insurance', description: 'Risk coverage', icon: 'security' },
];

const SectionTitle = ({ title, subtitle }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

const WeatherCard = () => (
  <View style={styles.weatherCard}>
    <View style={styles.currentWeather}>
      <Text style={styles.temperature}>28°</Text>
      <Text style={styles.weatherDesc}>Sunny</Text>
    </View>
    <FlatList
      horizontal
      data={weatherData}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.weatherHourly}>
          <Text style={styles.weatherTime}>{item.time}</Text>
          <MaterialIcons
            name={item.condition === 'sunny' ? 'wb-sunny' : item.condition === 'rain' ? 'grain' : 'cloud'}
            size={24}
            color="#FFF"
            style={styles.weatherIcon}
          />
          <Text style={styles.weatherTemp}>{item.temp}</Text>
        </View>
      )}
    />
  </View>
);

const CropMetrics = () => (
  <FlatList
    horizontal
    data={cropMetrics}
    showsHorizontalScrollIndicator={false}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <View style={styles.metricCard}>
        <View style={styles.metricIcon}>
          <MaterialIcons name={item.icon} size={24} color="#4CAF50" />
        </View>
        <Text style={styles.metricValue}>{item.value}</Text>
        <Text style={styles.metricTitle}>{item.title}</Text>
      </View>
    )}
  />
);

const QuickActions = () => (
  <View style={styles.actionsContainer}>
    {actions.map(action => (
      <TouchableOpacity key={action.id} style={styles.actionButton}>
        <View style={styles.actionIcon}>
          <MaterialIcons name={action.icon} size={24} color="#FFF" />
        </View>
        <Text style={styles.actionTitle}>{action.title}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const VideoTutorials = () => (
  <FlatList
    data={tutorials}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.tutorialCard}>
        <View style={styles.tutorialThumbnail}>
          <MaterialIcons name="play-circle-filled" size={40} color="#FFF" />
        </View>
        <View style={styles.tutorialInfo}>
          <View style={styles.tutorialMeta}>
            <Text style={styles.tutorialCategory}>{item.category}</Text>
            <Text style={styles.tutorialDuration}>{item.duration}</Text>
          </View>
          <Text style={styles.tutorialTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )}
  />
);

const GovtSchemes = () => (
  <FlatList
    data={schemes}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.schemeCard}>
        <View style={styles.schemeIcon}>
          <MaterialIcons name={item.icon} size={24} color="#4CAF50" />
        </View>
        <View style={styles.schemeInfo}>
          <Text style={styles.schemeTitle}>{item.title}</Text>
          <Text style={styles.schemeDesc}>{item.description}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
    )}
  />
);

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}></Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <MaterialIcons name="person" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <SectionTitle title="Weather Forecast" subtitle="Today's predictions" />
          <WeatherCard />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Crop Health" subtitle="Real-time metrics" />
          <CropMetrics />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Quick Actions" />
          <QuickActions />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Learning Center" subtitle="Recommended for you" />
          <VideoTutorials />
        </View>

        <View style={styles.section}>
          <SectionTitle title="Government Schemes" subtitle="Available programs" />
          <GovtSchemes />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#E8F5E9',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  weatherCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 20,
  },
  currentWeather: {
    marginBottom: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
  },
  weatherDesc: {
    fontSize: 18,
    color: '#E8F5E9',
  },
  weatherHourly: {
    alignItems: 'center',
    marginRight: 24,
  },
  weatherTime: {
    color: '#E8F5E9',
    marginBottom: 8,
  },
  weatherIcon: {
    marginVertical: 8,
  },
  weatherTemp: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  metricCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    alignItems: 'center',
    width: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  metricIcon: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  actionIcon: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionTitle: {
    fontSize: 14,
    color: '#1B5E20',
    fontWeight: '500',
  },
  tutorialCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tutorialThumbnail: {
    height: 160,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialInfo: {
    padding: 16,
  },
  tutorialMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tutorialCategory: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  tutorialDuration: {
    fontSize: 14,
    color: '#666',
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  schemeCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  schemeIcon: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  schemeInfo: {
    flex: 1,
  },
  schemeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  schemeDesc: {
    fontSize: 14,
    color: '#666',
  },
});

export default Home;