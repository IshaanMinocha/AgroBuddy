import { View, Alert, StyleSheet, Text, Modal, Pressable, ScrollView } from 'react-native';
import { Button, MD3Colors, ActivityIndicator } from 'react-native-paper';
import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import useAudioRecorder from '../hooks/useAudioRecorder';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { BACKEND_URL } from '@env';
import { Picker } from '@react-native-picker/picker';
import { Message } from './Message';
import VoiceAnimation from './VoiceAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Voicebot = ({ onClose }) => {

  const scrollViewRef = useRef();

  const [sound, setSound] = useState(null);
  const { recording, startRecording, stopRecording, audioUri } = useAudioRecorder();
  const [transcription, setTranscription] = useState('');
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [transcriptions, setTranscriptions] = useState([]);
  const [languageCode, setLanguageCode] = useState('hi-IN');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);

  const languageMapping = {
    English: { modelLang: "english", tts: "en-IN" },
    Hindi: { modelLang: "hindi", tts: "hi-IN" },
    Tamil: { modelLang: "tamil", tts: "ta-IN" },
    Telugu: { modelLang: "telugu", tts: "te-IN" },
    Kannada: { modelLang: "kannada", tts: "kn-IN" },
    Malayalam: { modelLang: "malayalam", tts: "ml-IN" },
    Punjabi: { modelLang: "punjabi", tts: "pa-IN" },
    Gujarati: { modelLang: "gujarati", tts: "gu-IN" },
    Bengali: { modelLang: "bengali", tts: "bn-IN" },
    Marathi: { modelLang: "marathi", tts: "mr-IN" },
    Odia: { modelLang: "odia", tts: "or-IN" },
    Assamese: { modelLang: "assamese", tts: "as-IN" },
    Sanskrit: { modelLang: "sanskrit", tts: "sa-IN" },
  };

  const handleConversation = async () => {
    console.log("first")
    const text = await handleTranscribe();
    console.log(text, "text")

  }

  const getTranscriptions = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`${BACKEND_URL}/api/voicebot/transciptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Transcriptions:', response.data.transcriptions);
      setTranscriptions(response.data.transcriptions);
    } catch (error) {
      console.error('Error getting transcriptions:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getTranscriptions();
  }, []);

  const handleSpeakAnswerExpo = async () => {
    if (!answer) {
      Alert.alert('No answer available to speak');
      return;
    }
    Speech.speak(answer, { language: languageCode });
  }

  const handleSpeakAnswerEleven = async () => {
    if (!answer) {
      Alert.alert('No answer available to speak');
      return;
    }
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.post(`${BACKEND_URL}/api/voicebot/in`, {
        text: answer,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { audio } = response.data;
      if (audio) {
        const audioUri = `data:audio/mpeg;base64,${audio}`;
        const { sound: ttsSound } = await Audio.Sound.createAsync({ uri: audioUri });
        setSound(ttsSound);
        await ttsSound.playAsync();
      }
    } catch (error) {
      console.error('Error with TTS:', error.response?.data || error.message);
    }
  };


  const handleProcessQuery = async () => {
    if (!transcription) {
      Alert.alert('No transcription available to process');
      return;
    }
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.post(`${BACKEND_URL}/api/voicebot/process`, {
        transcription,
        model: "gpt-4o",
      }, {
        headers: { Authorization: `Bearer ${token}` },
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

    const token = await AsyncStorage.getItem('token');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/voicebot/out`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
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
      return transcribedText;
    } catch (error) {
      console.error('Error during transcription:', error);
    }
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
      await handleConversation();
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      onRequestClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Voicebot</Text>
        <Pressable onPress={onClose}>
          <Text style={styles.closeIcon}>✖</Text>
        </Pressable>
      </View>
      {/* <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedLanguage}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          >
            {Object.keys(languageMapping).map((lang) => (
              <Picker.Item key={lang} label={lang} value={lang} />
            ))}
          </Picker>
        </View>
      </View> */}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        <View style={{ marginBottom: 50, marginTop: 20 }}>
          {transcriptions.map((transcription) => (
            <View key={transcription._id}>
              {transcription.userQuery && (
                <Message
                  message={transcription.userQuery}
                  type="userQuery"
                />
              )}
              {transcription.botResponse && (
                <Message
                  message={transcription.botResponse}
                  type="botResponse"
                />
              )}
            </View>
          ))}
        </View>
        {/* <View >
            <Text >
              {transcriptions.map((transcription) => (
                <View key={transcription._id}>
                  <Text>User Query: {transcription.userQuery}</Text>
                  <Text>Bot Response: {transcription.botResponse}</Text>
                </View>
              ))}
            </Text>
          </View> */}
        {/* <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={startRecording} >Start Recording</Button>
        <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={stopRecording} >Stop Recording</Button> */}
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
        <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={handleSpeakAnswerExpo} >Speak Answer Expo</Button>
        <Button style={{ margin: 50, marginTop: 10 }} icon="microphone" mode="contained" onPress={handleSpeakAnswerEleven} >Speak Answer Eleven</Button>
      </ScrollView>
      <View>
        <VoiceAnimation
          isUserSpeaking={isUserSpeaking}
          isBotSpeaking={isBotSpeaking}
        />
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedLanguage}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          >
            {Object.keys(languageMapping).map((lang) => (
              <Picker.Item
                key={lang}
                label={lang}
                value={lang}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>
        <Pressable
          onPressIn={handleStartRecording}
          onPressOut={()=>{
            handleStopRecording();
            handleTranscribe();
            handleProcessQuery();
            handle
          }}
          // disabled={isProcessing || isBotSpeaking}
          style={styles.recordingStatus}>
          <Text style={styles.recordingText}>
            {isRecording ? 'Recording...' : 'Hold to Record'}
          </Text>
        </Pressable>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: 15,
    height: 80,
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    flex: 1,
    maxWidth: '50%',
    height: 80,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    // borderRadius: 8,
    // marginRight: 10,
    paddingHorizontal: 5,
    borderRightColor: '#e0e0e0',
    borderRightWidth: 1,
  },
  picker: {
    height: 100,
    color: '#333',
  },
  pickerItem: {
    fontSize: 14,
  },
  recordingStatus: {
    flex: 1,
    height: 80,
    backgroundColor: '#f8f8f8',
    // borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#e0e0e0',
  },
  recordingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  closeIcon: {
    color: 'white',
    fontSize: 24,
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
