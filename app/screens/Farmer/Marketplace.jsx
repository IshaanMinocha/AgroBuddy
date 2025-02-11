import React, { useState } from 'react';
import { ScrollView, View, Dimensions, RefreshControl } from 'react-native';
import { Card, Button, Title, Paragraph, Appbar, TextInput, Modal, Portal, 
         Chip, SegmentedButtons, IconButton, Surface, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';

const MarketplacePage = () => {
  // State Management
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('myCrops');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [cropMenuVisible, setCropMenuVisible] = useState(false);
  const [selectedMarketCrop, setSelectedMarketCrop] = useState('All Crops');

  // Mock Data
  const [myCrops] = useState([
    { id: 1, name: 'Wheat', quantity: 500, price: 25, status: 'listed' },
    { id: 2, name: 'Rice', quantity: 1000, price: 30, status: 'draft' },
  ]);

  const [marketPrices] = useState([
    { 
      crop: 'Wheat',
      currentPrice: 25,
      predictedPrice: 28,
      trend: 'up',
      bestTime: '2 weeks',
      confidence: 85,
      priceHistory: [20, 22, 24, 25, 26, 25],
      seasonality: 'Best selling season: Oct-Dec',
      demandForecast: 'High',
      marketInsights: 'Expected shortage due to lower production in major regions'
    },
    { 
      crop: 'Rice',
      currentPrice: 30,
      predictedPrice: 32,
      trend: 'up',
      bestTime: '1 month',
      confidence: 78,
      priceHistory: [28, 29, 30, 30, 31, 30],
      seasonality: 'Best selling season: Jan-Mar',
      demandForecast: 'Medium',
      marketInsights: 'Stable demand with slight increase expected'
    },
    { 
      crop: 'Corn',
      currentPrice: 18,
      predictedPrice: 16,
      trend: 'down',
      bestTime: '3 months',
      confidence: 82,
      priceHistory: [19, 18.5, 18, 18, 17.5, 18],
      seasonality: 'Best selling season: Jul-Sep',
      demandForecast: 'Low',
      marketInsights: 'Oversupply expected in coming months'
    }
  ]);

  // Handlers
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAddCrop = () => {
    // Add validation and API call here
    if (selectedCrop && quantity && price) {
      // Add new crop logic
      setModalVisible(false);
      setSelectedCrop(null);
      setQuantity('');
      setPrice('');
    }
  };

  // UI Components
  const renderHeader = () => (
    <Appbar.Header style={styles.header}>
      <Appbar.Content title="Marketplace" />
      <IconButton icon="bell" onPress={() => {}} />
    </Appbar.Header>
  );

  const renderTabs = () => (
    <SegmentedButtons
      value={selectedTab}
      onValueChange={setSelectedTab}
      buttons={[
        { value: 'myCrops', label: 'My Crops' },
        { value: 'market', label: 'Market Insights' },
      ]}
      style={styles.tabs}
    />
  );

  const renderMyCropsSection = () => (
    <View>
      <Surface style={styles.summary}>
        <View style={styles.summaryItem}>
          <Title>3</Title>
          <Paragraph>Active Listings</Paragraph>
        </View>
        <View style={styles.summaryItem}>
          <Title>₹45,000</Title>
          <Paragraph>Total Value</Paragraph>
        </View>
      </Surface>

      {myCrops.map(crop => (
        <Card key={crop.id} style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title>{crop.name}</Title>
              <Chip 
                icon={crop.status === 'listed' ? 'check' : 'pencil'}
                mode="outlined"
              >
                {crop.status === 'listed' ? 'Listed' : 'Draft'}
              </Chip>
            </View>
            <View style={styles.cropDetails}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="weight-kilogram" size={20} />
                <Paragraph>{crop.quantity} kg</Paragraph>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="currency-inr" size={20} />
                <Paragraph>{crop.price}/kg</Paragraph>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode={crop.status === 'listed' ? 'outlined' : 'contained'} 
              onPress={() => {}}
            >
              {crop.status === 'listed' ? 'Edit Listing' : 'List Now'}
            </Button>
          </Card.Actions>
        </Card>
      ))}

      <Button 
        mode="contained" 
        icon="plus" 
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        Add New Crop
      </Button>
    </View>
  );

  const renderMarketSection = () => (
    <View>
      <Surface style={styles.cropSelector}>
        <Title style={styles.sectionTitle}>Market Predictions</Title>
        <Menu
          visible={cropMenuVisible}
          onDismiss={() => setCropMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setCropMenuVisible(true)}
              icon="menu-down"
            >
              {selectedMarketCrop}
            </Button>
          }
        >
          <Menu.Item 
            onPress={() => {
              setSelectedMarketCrop('All Crops');
              setCropMenuVisible(false);
            }} 
            title="All Crops" 
          />
          {marketPrices.map(item => (
            <Menu.Item 
              key={item.crop}
              onPress={() => {
                setSelectedMarketCrop(item.crop);
                setCropMenuVisible(false);
              }} 
              title={item.crop} 
            />
          ))}
        </Menu>
      </Surface>

      {marketPrices
        .filter(item => selectedMarketCrop === 'All Crops' || item.crop === selectedMarketCrop)
        .map((item, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title>{item.crop}</Title>
                <Chip 
                  icon={item.trend === 'up' ? 'trending-up' : 'trending-down'}
                  mode="outlined"
                  textStyle={{ color: item.trend === 'up' ? '#4CAF50' : '#F44336' }}
                >
                  {item.trend === 'up' ? 'Rising' : 'Falling'}
                </Chip>
              </View>
              
              <LineChart
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [{
                    data: item.priceHistory
                  }]
                }}
                width={Dimensions.get('window').width - 50}
                height={180}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                style={styles.chart}
                bezier
              />

              <View style={styles.priceInfo}>
                <View style={styles.priceItem}>
                  <Paragraph>Current Price</Paragraph>
                  <Title>₹{item.currentPrice}/kg</Title>
                </View>
                <View style={styles.priceItem}>
                  <Paragraph>Predicted Price</Paragraph>
                  <Title>₹{item.predictedPrice}/kg</Title>
                </View>
              </View>

              <Surface style={styles.predictionDetails}>
                <View style={styles.predictionItem}>
                  <MaterialCommunityIcons name="calendar-month" size={24} color="#666" />
                  <Paragraph>{item.seasonality}</Paragraph>
                </View>
                <View style={styles.predictionItem}>
                  <MaterialCommunityIcons name="trending-up" size={24} color="#666" />
                  <Paragraph>Demand: {item.demandForecast}</Paragraph>
                </View>
                <View style={styles.predictionItem}>
                  <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#666" />
                  <Paragraph>{item.marketInsights}</Paragraph>
                </View>
              </Surface>

              <View style={styles.recommendation}>
                <MaterialCommunityIcons name="timer-sand" size={24} color="#4CAF50" />
                <Paragraph>Best time to sell: {item.bestTime}</Paragraph>
                <Chip mode="outlined">
                  {item.confidence}% confidence
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))}
    </View>
  );

  const renderAddCropModal = () => (
    <Portal>
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modal}
      >
        <Title style={styles.modalTitle}>Add New Crop</Title>
        
        <TextInput
          label="Crop Name"
          value={selectedCrop}
          onChangeText={setSelectedCrop}
          style={styles.input}
        />
        
        <TextInput
          label="Quantity (kg)"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
        />
        
        <TextInput
          label="Price per kg (₹)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <Button 
          mode="contained"
          onPress={handleAddCrop}
          style={styles.modalButton}
        >
          Add Crop
        </Button>
      </Modal>
    </Portal>
  );

  return (
    <>
      {renderHeader()}
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderTabs()}
        {selectedTab === 'myCrops' ? renderMyCropsSection() : renderMarketSection()}
      </ScrollView>
      {renderAddCropModal()}
    </>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 4,
  },
  tabs: {
    margin: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
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
    marginBottom: 8,
  },
  cropDetails: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  priceItem: {
    alignItems: 'center',
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  addButton: {
    margin: 16,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
  cropSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
  },
  predictionDetails: {
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
};

export default MarketplacePage;