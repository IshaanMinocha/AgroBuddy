import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, ActivityIndicator, Modal, Portal, Provider, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND_URL } from '@env';

const VisitDetails = () => {
  const [currentVisits, setCurrentVisits] = useState([]);
  const [pastVisits, setPastVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [modalType, setModalType] = useState('view'); 
  
  const showModal = (visit, type) => {
    setSelectedVisit(visit);
    setModalType(type);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedVisit(null);
  };

  const markAsComplete = async () => {
    if (selectedVisit) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await axios.patch(`${BACKEND_URL}/visit/${selectedVisit._id}`, { status: 'complete' }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCurrentVisits(currentVisits.filter(visit => visit._id !== selectedVisit._id));
          setPastVisits([...pastVisits, { ...selectedVisit, status: 'complete' }]);
          hideModal();
        }
      } catch (error) {
        console.error('Failed to update visit', error);
      }
    }
  };

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${BACKEND_URL}/visit/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const visits = response.data.visits;
          const current = visits.filter(visit => visit.status === 'pending');
          const past = visits.filter(visit => visit.status === 'complete');
          setCurrentVisits(current);
          setPastVisits(past);
        } else {
          console.error('No token found');
        }
      } catch (error) {
        setError('Failed to fetch visits');
        console.error('Failed to fetch visits', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Loading Visits...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <Provider>
      <View style={styles.container}>
      <Text style={styles.title}>Current Visits</Text>
        {currentVisits.length === 0 ? (
          <Text style={styles.noVisits}>No current visits</Text>
        ) : (
          <FlatList
            data={currentVisits}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => showModal(item, 'edit')}>
                <View style={styles.visitCard}>
                  <Text style={styles.label}>Client: {item.client.clientName}</Text>
                  <Text style={styles.label}>Firm: {item.client.firmName}</Text>
                  <Text style={styles.label}>Mobile: {item.client.number}</Text>
                  <Text style={styles.label}>Date: {item.dateOfVisit}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <Text style={styles.title}>Past Visits</Text>
        {pastVisits.length === 0 ? (
          <Text style={styles.noVisits}>No past visits</Text>
        ) : (
          <FlatList
            data={pastVisits}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => showModal(item, 'view')}>
                <View style={styles.visitCard}>
                  <Text style={styles.label}>Client: {item.client.clientName}</Text>
                  <Text style={styles.label}>Date: {item.dateOfVisit}</Text>
                  <Text style={styles.label}>Status: {item.status}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            {modalType === 'view' && selectedVisit ? (
              <View>
                <Text style={styles.modalTitle}>Visit Details</Text>
                <Text style={styles.modalLabel}>Client: {selectedVisit.client.clientName}</Text>
                <Text style={styles.modalLabel}>Firm: {selectedVisit.client.firmName}</Text>
                <Text style={styles.modalLabel}>Mobile: {selectedVisit.client.number}</Text>
                <Text style={styles.modalLabel}>Date: {selectedVisit.dateOfVisit}</Text>
                <Text style={styles.modalLabel}>Status: {selectedVisit.status}</Text>
                <Button mode="contained" onPress={hideModal}>Close</Button>
              </View>
            ) : modalType === 'edit' && selectedVisit ? (
              <View>
                <Text style={styles.modalTitle}>Mark Visit as Complete</Text>
                <Text style={styles.modalLabel}>Client: {selectedVisit.client.clientName}</Text>
                <Text style={styles.modalLabel}>Firm: {selectedVisit.client.firmName}</Text>
                <Text style={styles.modalLabel}>Date: {selectedVisit.dateOfVisit}</Text>
                <Button mode="contained" onPress={markAsComplete}>Mark as Complete</Button>
                <Button mode="outlined" onPress={hideModal}>Cancel</Button>
              </View>
            ) : null}
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  visitCard: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
  },
  noVisits: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default VisitDetails;
