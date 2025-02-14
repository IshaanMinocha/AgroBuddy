import { View, Alert, StyleSheet, Text, Modal, Pressable, ScrollView } from 'react-native';
import { Button, MD3Colors, ActivityIndicator } from 'react-native-paper';
import { useState } from 'react';
import { Audio } from 'expo-av';
import useAudioRecorder from '../hooks/useAudioRecorder';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { BACKEND_URL } from '@env';

const Voicebot = ({ onClose }) => {

  const [sound, setSound] = useState(null);
  const { recording, startRecording, stopRecording, audioUri } = useAudioRecorder();
  const [transcription, setTranscription] = useState('');
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [currentTranscriptionIndex, setCurrentTranscriptionIndex] = useState(0);
  const [userTranscriptions, setUserTranscriptions] = useState([]);
  const [botTranscriptions, setBotTranscriptions] = useState([]);
  const [languageCode, setLanguageCode] = useState('en-US');
  const [answer, setAnswer] = useState('');

  const handleSpeakAnswer = async () => {
    if (!answer) {
      Alert.alert('No answer available to speak');
      return;
    }
    Speech.speak(answer, { language: languageCode });

  }

  const handleProcessQuery = async () => {
    if (!transcription) {
      Alert.alert('No transcription available to process');
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/api/voicebot/process`, {
        transcription,
        model: "gpt-4o",
      });
      console.log('Answer:', response);
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error processing query:', error.response?.data || error.message);
      Alert.alert('Error processing query');
    }
  };

  const playSound = async () => {
    if (!audioUri) return;
    console.log('Loading sound from URI:', audioUri);

    const { sound: returnSound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(returnSound);

    console.log('Playing sound...');
    await returnSound.playAsync();
  };

  const uploadRecording = async (audioUri) => {
    console.log('Uploading recording');
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    if (!fileInfo.exists) {
      console.error('File does not exist');
      return;
    }
    console.log(fileInfo, 'fileInfo');

    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      name: 'recording.m4a',
      type: 'audio/mp4',
    });
    console.log(formData, 'formData');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/voicebot/out`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Transcription:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error uploading recording', error);
    }
  };

  const handleTranscribe = async () => {
    if (!audioUri) {
      console.warn('No audio file available to transcribe');
      return;
    }
    try {
      const transcribedText = await uploadRecording(audioUri);
      console.log(transcribedText, "transcribedText");
      setTranscription(transcribedText);
    } catch (error) {
      console.error('Error during transcription:', error);
    }
  };


  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      onRequestClose={onClose}>
      <ScrollView >
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
          <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={handleTranscribe} >Upload Recording</Button>
          {audioUri && (
            <View>
              <Text style={{ marginTop: 20 }}>
                Recorded Audio URI: {audioUri}
              </Text>
              <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={playSound} >Play Sound</Button>
            </View>
          )}
          {transcription && (
            <View>
              <Text style={{ marginTop: 20 }}>
                Transcription: {transcription}
              </Text>
            </View>
          )}
          <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={handleProcessQuery} >Process Query</Button>
          {answer !== '' && (
            <View>
              <Text style={{ marginTop: 20, fontSize: 16 }}>Answer:</Text>
              <Text style={{ marginTop: 10 }}>{answer}</Text>
            </View>
          )}
          <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={handleSpeakAnswer} >Speak Answer</Button>
        </View>
      </ScrollView>
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
