import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Modal, Portal, TextInput, IconButton, ActivityIndicator } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';

const VisitManagement = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [clients, setClients] = useState([]);
  const [visitDetails, setVisitDetails] = useState({
    clientId: '',
    dateOfVisit: '',
    worker: '',
    status: 'pending',
  });

  useEffect(() => {
    fetchVisits();
    fetchWorkers();
    fetchClients();
  }, []);

  const fetchVisits = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${BACKEND_URL}/visit/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setVisits(response.data.visits);
      } else {
        Alert.alert('Error', 'Failed to fetch visits.');
      }
    } catch (error) {
      console.error('Error fetching visits', error);
      Alert.alert('Error', 'Failed to fetch visits.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${BACKEND_URL}/user/workers/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setWorkers(response.data.workers);
      } else {
        Alert.alert('Error', 'Failed to fetch workers.');
      }
    } catch (error) {
      console.error('Error fetching workers', error);
      Alert.alert('Error', 'Failed to fetch workers.');
    }
  };

  const fetchClients = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${BACKEND_URL}/client/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setClients(response.data.clients);
      } else {
        Alert.alert('Error', 'Failed to fetch clients.');
      }
    } catch (error) {
      console.error('Error fetching clients', error);
      Alert.alert('Error', 'Failed to fetch clients.');
    }
  };

  const addVisit = async (token) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/visit/`, visitDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setVisits((prevVisits) => [...prevVisits, response.data.visit]);
        Alert.alert('Success', 'Visit added successfully');
      } else {
        Alert.alert('Error', 'Failed to add visit');
      }
    } catch (error) {
      console.error('Error adding visit', error);
      Alert.alert('Error', 'Failed to add visit');
    } finally {
      resetVisitForm();
    }
  };

  const editVisit = async (token) => {
    if (!selectedVisit || !selectedVisit._id) {
      Alert.alert('Error', 'No visit selected for editing');
      return;
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/visit/${selectedVisit._id}`, visitDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setVisits((prevVisits) =>
          prevVisits.map((visit) =>
            visit._id === selectedVisit._id ? response.data.visit : visit
          )
        );
        Alert.alert('Success', 'Visit updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update visit');
      }
    } catch (error) {
      console.error('Error editing visit', error);
      Alert.alert('Error', 'Failed to update visit');
    } finally {
      resetVisitForm();
    }
  };

  const handleSaveVisit = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No token found');
      return;
    }

    if (selectedVisit) {
      await editVisit(token);
    } else {
      await addVisit(token);
    }
  };

  const handleDeleteVisit = async (visitId) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No token found');
      return;
    }

    try {
      const response = await axios.delete(`${BACKEND_URL}/visit/${visitId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setVisits((prevVisits) => prevVisits.filter((visit) => visit._id !== visitId));
        Alert.alert('Success', 'Visit deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete visit');
      }
    } catch (error) {
      console.error('Error deleting visit', error);
      Alert.alert('Error', 'Failed to delete visit');
    }
  };

  const openEditModal = (visit) => {
    setVisitDetails({
      clientId: visit.client._id,
      dateOfVisit: visit.dateOfVisit,
      worker: visit.worker._id,
      status: visit.status,
    });
    setSelectedVisit(visit);
    setModalVisible(true);
  };

  const openAddModal = () => {
    resetVisitForm();
    setModalVisible(true);
  };

  const resetVisitForm = () => {
    setVisitDetails({
      clientId: '',
      dateOfVisit: '',
      worker: '',
      status: 'pending',
    });
    setSelectedVisit(null);
    setModalVisible(false);
  };

  const renderVisit = ({ item }) => (
    <View style={styles.visitItem}>
      <View>
        <Text style={styles.visitDate}>{item.dateOfVisit}</Text>
        <Text style={styles.clientName}>Client: {item.client?.clientName}</Text>
        <Text style={styles.workerName}>Worker: {item.worker?.name}</Text>
      </View>
      <View style={styles.visitActions}>
        <IconButton icon="pencil" size={20} onPress={() => openEditModal(item)} />
        <IconButton icon="delete" size={20} onPress={() => handleDeleteVisit(item._id)} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Loading Visits...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={openAddModal}>
        Add Visit
      </Button>

      <Text style={styles.heading}>Pending Visits</Text>
      {visits.length > 0 ? (
        <FlatList
          data={visits.filter((visit) => visit.status === 'pending')}
          renderItem={renderVisit}
          keyExtractor={(item) => item._id}
          style={styles.visitList}
        />
      ) : (
        <View style={styles.center}>
          <Text>No pending visits found</Text>
        </View>
      )}

      <Text style={styles.heading}>Completed Visits</Text>
      {visits.length > 0 ? (
        <FlatList
          data={visits.filter((visit) => visit.status === 'complete')}
          renderItem={renderVisit}
          keyExtractor={(item) => item._id}
          style={styles.visitList}
        />
      ) : (
        <View style={styles.center}>
          <Text>No completed visits found</Text>
        </View>
      )}

      <Portal>
        <Modal visible={modalVisible} onDismiss={resetVisitForm} contentContainerStyle={styles.modalView}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <RNPickerSelect
              onValueChange={(value) => setVisitDetails({ ...visitDetails, clientId: value })}
              items={clients.map((client) => ({ label: client.clientName, value: client._id }))}
              value={visitDetails.clientId}
              placeholder={{ label: 'Select Client', value: null }}
            />
            <TextInput
              label="Date of Visit"
              value={visitDetails.dateOfVisit}
              onChangeText={(text) => setVisitDetails({ ...visitDetails, dateOfVisit: text })}
              style={styles.input}
            />
            <RNPickerSelect
              onValueChange={(value) => setVisitDetails({ ...visitDetails, worker: value })}
              items={workers.map((worker) => ({ label: worker.name, value: worker._id }))}
              value={visitDetails.worker}
              placeholder={{ label: 'Select Worker', value: null }}
              />
              <RNPickerSelect
                onValueChange={(value) => setVisitDetails({ ...visitDetails, status: value })}
                items={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Complete', value: 'complete' },
                ]}
                value={visitDetails.status}
                placeholder={{ label: 'Select Status', value: 'pending' }}
              />
              <Button mode="contained" onPress={handleSaveVisit} style={styles.button}>
                {selectedVisit ? 'Update Visit' : 'Add Visit'}
              </Button>
              <Button mode="text" onPress={resetVisitForm} style={styles.button}>
                Cancel
              </Button>
            </ScrollView>
          </Modal>
        </Portal>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    visitList: {
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10,
    },
    visitItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      backgroundColor: '#f9f9f9',
      marginBottom: 10,
      borderRadius: 5,
    },
    visitDate: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    clientName: {
      fontSize: 14,
      color: '#555',
    },
    workerName: {
      fontSize: 14,
      color: '#555',
    },
    visitActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 5,
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    input: {
      marginBottom: 15,
    },
    button: {
      marginTop: 15,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  export default VisitManagement;
  
