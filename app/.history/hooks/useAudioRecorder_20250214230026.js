import { useState } from "react";

export default function useAudioRecorder() {
  const [recording, setRecording] = useState();
  const [audioUri, setAudioUri] = useState(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setAudioUri(null); 
    } catch (err) {
      console.error('Failed to start recording', err);
      throw err;
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(undefined);
      return uri; 
    } catch (err) {
      console.error('Failed to stop recording', err);
      throw err;
    }
  };

  return { recording, startRecording, stopRecording, audioUri };
};