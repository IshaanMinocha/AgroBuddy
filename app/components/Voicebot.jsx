import { View, Alert, StyleSheet, Text, Modal, Pressable } from 'react-native';
import { Button, MD3Colors, ActivityIndicator } from 'react-native-paper';
import { useState } from 'react';
import { Audio } from 'expo-av';
import useAudioRecorder from '../hooks/useAudioRecorder';

const Voicebot = ({ onClose }) => {

  const [sound, setSound] = useState(null);
  const { recording, startRecording, stopRecording, audioUri } = useAudioRecorder();

  const playSound = async () => {
    if (!audioUri) return;
    console.log('Loading sound from URI:', audioUri);
    const { sound: returnSound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(returnSound);
    console.log('Playing sound...');
    await sound.playAsync();
  };


  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      onRequestClose={onClose}>
      <View style={styles.fullHeightView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Voicebot</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.closeIcon}>✖</Text>
          </Pressable>
        </View>
        <View style={styles.modalContent}>
          <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={() => { Alert.alert('Start Talking Pressed'); }}>
            Start Talking
          </Button>
          <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={startRecording} >Start Recording</Button>
          <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={stopRecording} >Stop Recording</Button>
          {audioUri && (
            <View>
              <Text style={{ marginTop: 20 }}>
                Recorded Audio URI: {audioUri}
              </Text>
              <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={playSound} >Play Sound</Button>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullHeightView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: MD3Colors.primary50,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeIcon: {
    color: 'white',
    fontSize: 24,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Voicebot;
