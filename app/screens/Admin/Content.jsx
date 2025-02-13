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
  Button,
  Portal,
  Modal,
  List,
  Searchbar,
  Chip,
  IconButton,
  Surface,
  Divider,
  FAB,
  DataTable,
} from 'react-native-paper';

const Content = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('tutorials');

  // Mock data
  const tutorials = [
    {
      id: 1,
      title: 'Organic Farming Basics',
      type: 'video',
      duration: '15:30',
      views: 1250,
      date: '2024-02-10',
    },
    {
      id: 2,
      title: 'Government Subsidy Guidelines',
      type: 'article',
      readTime: '5 min',
      views: 856,
      date: '2024-02-11',
    },
  ];

  const aiTrainingData = [
    {
      id: 1,
      image: 'corn_disease_1.jpg',
      type: 'Disease',
      status: 'Pending Review',
      submissions: 15,
      confidence: '75%',
    },
    {
      id: 2,
      image: 'pest_damage_wheat.jpg',
      type: 'Pest',
      status: 'Reviewed',
      submissions: 23,
      confidence: '88%',
    },
  ];

  const notifications = [
    {
      id: 1,
      title: 'Heavy Rain Alert',
      type: 'weather',
      status: 'Scheduled',
      date: '2024-02-13',
      targetRegion: 'North Zone',
    },
    {
      id: 2,
      title: 'New Scheme Registration',
      type: 'scheme',
      status: 'Sent',
      date: '2024-02-12',
      targetRegion: 'All Regions',
    },
  ];

  const renderTutorialsSection = () => (
    <Card style={styles.section}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Title>Tutorials & Schemes</Title>
          <Button 
            mode="contained" 
            onPress={() => setUploadModalVisible(true)}
            icon="plus"
          >
            Add New
          </Button>
        </View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Title</DataTable.Title>
            <DataTable.Title>Type</DataTable.Title>
            <DataTable.Title numeric>Views</DataTable.Title>
            <DataTable.Title>Actions</DataTable.Title>
          </DataTable.Header>

          {tutorials.map((item) => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell>{item.title}</DataTable.Cell>
              <DataTable.Cell>
                <Chip icon={item.type === 'video' ? 'video' : 'file-document'}>
                  {item.type}
                </Chip>
              </DataTable.Cell>
              <DataTable.Cell numeric>{item.views}</DataTable.Cell>
              <DataTable.Cell>
                <IconButton icon="pencil" size={20} onPress={() => {}} />
                <IconButton icon="delete" size={20} onPress={() => {}} />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card.Content>
    </Card>
  );

  const renderAITrainingSection = () => (
    <Card style={styles.section}>
      <Card.Content>
        <Title>AI Model Training</Title>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {aiTrainingData.map((item) => (
            <Surface key={item.id} style={styles.aiCard}>
              <View style={styles.imagePlaceholder}>
                <IconButton icon="image" size={40} />
              </View>
              <Text style={styles.aiCardTitle}>{item.type}</Text>
              <Text style={styles.aiCardSubtitle}>
                {item.submissions} submissions
              </Text>
              <Chip mode="outlined" style={styles.confidenceChip}>
                {item.confidence} confidence
              </Chip>
              <Button mode="contained" style={styles.reviewButton}>
                Review
              </Button>
            </Surface>
          ))}
        </ScrollView>
      </Card.Content>
    </Card>
  );

  const renderNotificationsSection = () => (
    <Card style={styles.section}>
      <Card.Content>
        <Title>Push Notifications</Title>
        {notifications.map((notification) => (
          <Surface key={notification.id} style={styles.notificationItem}>
            <View style={styles.notificationHeader}>
              <IconButton
                icon={notification.type === 'weather' ? 'weather-cloudy' : 'bell'}
                size={24}
              />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMeta}>
                  {notification.targetRegion} • {notification.date}
                </Text>
              </View>
              <Chip mode="outlined">
                {notification.status}
              </Chip>
            </View>
          </Surface>
        ))}
        <Button 
          mode="contained" 
          icon="send" 
          style={styles.sendButton}
          onPress={() => {}}
        >
          Send New Notification
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Content Management</Title>
          <Searchbar
            placeholder="Search content..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.tabScroll}
          >
            {['tutorials', 'ai-training', 'notifications'].map((tab) => (
              <Chip
                key={tab}
                selected={selectedTab === tab}
                onPress={() => setSelectedTab(tab)}
                style={styles.tabChip}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.content}>
          {renderTutorialsSection()}
          {renderAITrainingSection()}
          {renderNotificationsSection()}
        </ScrollView>

        <Portal>
          <Modal
            visible={uploadModalVisible}
            onDismiss={() => setUploadModalVisible(false)}
            contentContainerStyle={styles.modal}
          >
            <Title>Upload New Content</Title>
            <List.Section>
              <List.Item
                title="Upload Video"
                description="Add a new tutorial video"
                left={props => <List.Icon {...props} icon="video" />}
              />
              <List.Item
                title="Create Article"
                description="Write a new article or guide"
                left={props => <List.Icon {...props} icon="file-document" />}
              />
              <List.Item
                title="Add Scheme Details"
                description="Upload government scheme information"
                left={props => <List.Icon {...props} icon="government" />}
              />
            </List.Section>
            <Button 
              mode="contained" 
              onPress={() => setUploadModalVisible(false)}
              style={styles.modalButton}
            >
              Close
            </Button>
          </Modal>
        </Portal>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setUploadModalVisible(true)}
        />
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
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    marginBottom: 12,
  },
  searchBar: {
    marginBottom: 12,
  },
  tabScroll: {
    marginBottom: 8,
  },
  tabChip: {
    marginRight: 8,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiCard: {
    width: 200,
    padding: 16,
    marginRight: 16,
    borderRadius: 8,
    elevation: 4,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiCardSubtitle: {
    color: '#666',
    marginBottom: 8,
  },
  confidenceChip: {
    marginBottom: 8,
  },
  reviewButton: {
    marginTop: 8,
  },
  notificationItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationMeta: {
    color: '#666',
    fontSize: 12,
  },
  sendButton: {
    marginTop: 16,
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default Content;