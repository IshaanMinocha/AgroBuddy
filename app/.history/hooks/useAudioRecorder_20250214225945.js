
export default useAudioRecorde {
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
      setAudioUri(null); // Reset previous URI
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
      return uri; // Ensure we return the URI
    } catch (err) {
      console.error('Failed to stop recording', err);
      throw err;
    }
  };

  return { recording, startRecording, stopRecording, audioUri };
};