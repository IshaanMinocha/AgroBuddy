// IoTAdminPanel.js
import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { 
  Provider as PaperProvider,
  Card, 
  Title, 
  Text, 
  Switch,
  Button,
  FAB,
  Portal,
  Modal,
  List,
  Searchbar,
  IconButton,
  ProgressBar,
  Menu,
  Divider,
  useTheme
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Usage = () => {
  const [devices, setDevices] = useState([
    {
      id: '1',
      name: 'Soil Sensor Pod A1',
      batteryLevel: 85,
      connected: true,
      accuracy: 98,
      assignedTo: 'Field 1 - John Doe',
      firmwareVersion: '2.1.0',
      lastUpdate: '2024-02-12 10:30 AM'
    },
    // Add more mock devices as needed
  ]);

  const [fabOpen, setFabOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const getBatteryColor = (level) => {
    if (level > 70) return '#4CAF50';
    if (level > 30) return '#FFC107';
    return '#F44336';
  };

  const renderDeviceCard = (device) => (
    <Card style={styles.card} key={device.id}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{device.name}</Title>
          <IconButton
            icon={device.connected ? 'wifi' : 'wifi-off'}
            color={device.connected ? '#4CAF50' : '#F44336'}
          />
        </View>

        <View style={styles.deviceStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons 
              name="battery"
              size={24}
              color={getBatteryColor(device.batteryLevel)}
            />
            <Text>{`${device.batteryLevel}%`}</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons 
              name="chart-bell-curve"
              size={24}
              color="#2196F3"
            />
            <Text>{`${device.accuracy}% Accuracy`}</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <List.Item
          title="Assigned To"
          description={device.assignedTo}
          left={props => <List.Icon {...props} icon="account" />}
        />

        <List.Item
          title="Firmware Version"
          description={device.firmwareVersion}
          left={props => <List.Icon {...props} icon="cog" />}
          right={() => (
            <Button mode="outlined" onPress={() => {}}>
              Update
            </Button>
          )}
        />

        <Text style={styles.lastUpdate}>
          Last Updated: {device.lastUpdate}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Searchbar
            placeholder="Search devices..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          <IconButton
            icon="filter-variant"
            onPress={() => setFilterMenuVisible(true)}
          />
        </View>

        <ScrollView style={styles.deviceList}>
          {devices.map(renderDeviceCard)}
        </ScrollView>

        <Portal>
          <FAB.Group
            open={fabOpen}
            icon={fabOpen ? 'close' : 'plus'}
            actions={[
              {
                icon: 'plus',
                label: 'Add Device',
                onPress: () => {},
              },
              {
                icon: 'file-export',
                label: 'Export Report',
                onPress: () => setReportModalVisible(true),
              },
            ]}
            onStateChange={({ open }) => setFabOpen(open)}
          />

          <Modal
            visible={reportModalVisible}
            onDismiss={() => setReportModalVisible(false)}
            contentContainerStyle={styles.modal}>
            <Title>Generate Report</Title>
            <List.Section>
              <List.Item
                title="Farmer Progress Report"
                left={props => <List.Icon {...props} icon="chart-line" />}
                onPress={() => {}}
              />
              <List.Item
                title="Financial Summary"
                left={props => <List.Icon {...props} icon="cash" />}
                onPress={() => {}}
              />
              <List.Item
                title="Device Health Report"
                left={props => <List.Icon {...props} icon="devices" />}
                onPress={() => {}}
              />
            </List.Section>
            <Button 
              mode="contained" 
              onPress={() => setReportModalVisible(false)}
              style={styles.modalButton}
            >
              Close
            </Button>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
  },
  deviceList: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'right',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalButton: {
    marginTop: 16,
  },
});

export default Usage;