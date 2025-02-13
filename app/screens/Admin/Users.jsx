import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Provider as PaperProvider,
  Card,
  Title,
  Text,
  Searchbar,
  Chip,
  Avatar,
  Badge,
  Button,
  IconButton,
  Menu,
  Divider,
  List,
  Portal,
  Modal,
  TextInput,
} from 'react-native-paper';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);

  const users = [
    {
      id: '1',
      name: 'John Doe',
      location: 'North Farm District',
      cropTypes: ['Wheat', 'Corn'],
      role: 'Farmer',
      yield: '85 tons',
      activeTickets: 2,
    },
    {
      id: '2',
      name: 'Jane Smith',
      location: 'South Farm District',
      cropTypes: ['Rice', 'Vegetables'],
      role: 'Field Agent',
      yield: '120 tons',
      activeTickets: 0,
    },
  ];

  const renderUserCard = (user) => (
    <Card style={styles.card} key={user.id}>
      <Card.Content>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Avatar.Text size={40} label={user.name[0] + user.name.split(' ')[1][0]} />
            <View style={styles.userDetails}>
              <Title>{user.name}</Title>
              <Text style={styles.locationText}>{user.location}</Text>
            </View>
          </View>
          <Menu
            visible={menuVisible === user.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(user.id)}
              />
            }
          >
            <Menu.Item onPress={() => {}} title="Edit Profile" />
            <Menu.Item onPress={() => {}} title="Change Role" />
            <Menu.Item onPress={() => {}} title="Disable Account" />
          </Menu>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.cropTypes}>
          {user.cropTypes.map((crop, index) => (
            <Chip key={index} style={styles.chip}>{crop}</Chip>
          ))}
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Role</Text>
            <Text style={styles.statValue}>{user.role}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Yield</Text>
            <Text style={styles.statValue}>{user.yield}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tickets</Text>
            <Badge style={user.activeTickets > 0 ? styles.activeBadge : styles.zeroBadge}>
              {user.activeTickets}
            </Badge>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>User Management</Title>
          <Button mode="contained" icon="account-plus" onPress={() => setUserModalVisible(true)}>
            Add User
          </Button>
        </View>
        <Searchbar
          placeholder="Search users..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <ScrollView style={styles.userList}>
          {users.map(renderUserCard)}
        </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 22,
  },
  searchBar: {
    margin: 16,
  },
  userList: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 8,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  locationText: {
    color: '#666',
  },
  divider: {
    marginVertical: 12,
  },
  cropTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeBadge: {
    backgroundColor: '#ff5722',
  },
  zeroBadge: {
    backgroundColor: '#4caf50',
  },
});

export default Users;
