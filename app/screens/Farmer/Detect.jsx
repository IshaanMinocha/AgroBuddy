import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Button, Card } from 'react-native-paper';
import axios from "axios";
import { MODEL_URI, BACKEND_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Detect() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [uri, setUri] = useState(null);
  const [mode, setMode] = useState("picture");
  const [facing, setFacing] = useState("back");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginBottom: 20, fontSize: 18 }}>
          click below to use the camera
        </Text>
        <Button icon="camera" mode="contained" onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri);
  };

  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      ref.current?.stopRecording();
      return;
    }
    setRecording(true);
    const video = await ref.current?.recordAsync();
    console.log({ video });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const detectDisease = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: uri,
        type: "image/jpeg", // Adjust based on your image type
        name: "photo.jpg",
      });

      console.log(MODEL_URI);
      const res = await axios.post(`${MODEL_URI}/predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data.class, "hello from res");
      setResult(res.data.class);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }

  };
  const sendAction = async (action) =>{
    try{
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const res = await axios.post(`${BACKEND_URL}/api/esp-action/post-action`, { action }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data, "res");
      if(res.data.success){
        console.log("Action sent successfully");
      }
    }catch(e){
      console.error('Processing query error:', e.response ? e.response.data : e.message);
      setError('Failed to process action. Please try again.');
    }
  }
  const getRecommendations = async () => {
    setLoadingRecommendations(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      console.log(BACKEND_URL, "url");
      console.log(token, "token");
      console.log(result, "result");

      const res = await axios.post(`${BACKEND_URL}/api/recommendation/chat`, { prompt: result, usecase: "disease" }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.answer, "res");
      setRecommendations(res.data.answer);
      await sendAction(res.data.answer)
    } catch (err) {
      setError('Failed to give recommendations. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const renderPicture = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View>
          <Image
            source={{ uri }}
            contentFit="contain"
            style={{ width: 300, aspectRatio: 1 }}
          />
          <Button style={{ margin: 50, marginTop: 10 }} icon="reload" mode="contained-tonal" onPress={() => setUri(null)}>Take another picture</Button>
          <Button
            icon="magnify"
            mode="contained-tonal"
            onPress={detectDisease}
            // loading={loading}
            disabled={loading}

          >
            Detect Disease
          </Button>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Analyzing image...</Text>
            </View>
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {!loading && renderResult()}
          {!loadingRecommendations && renderRecommendations()}
        </View>
      </ScrollView>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <>
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.resultTitle}>
              Analysis Result
            </Text>
            <Text variant="bodyLarge" style={styles.resultText}>
              Disease: {result}
            </Text>
            {/* <Text variant="bodyMedium" style={styles.confidence}>
              Confidence: {(result.confidence * 100).toFixed(2)}% 
              Confidence: {80}%
            </Text>*/}
            <Button
              mode="outlined"
              onPress={getRecommendations}
              // loading={loadingRecommendations}
              disabled={loadingRecommendations}
            >
              Get Recommendations
            </Button>
          </Card.Content>
        </Card>
        {loadingRecommendations && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Getting recommendations...</Text>
          </View>
        )}
        {/* {!loadingRecommendations && renderRecommendations()} */}
      </>
    );
  };

  const renderRecommendations = () => {
    if (!recommendations) return null;

    return (
      <View style={styles.resultCard}>
        <Text variant="titleLarge" style={styles.resultTitle}>
          Recommendations
        </Text>
        <Text variant="bodyMedium" style={styles.recommendations}>
          {recommendations}
        </Text>
      </View>

    );
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={mode}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.shutterContainer}>
          <Pressable onPress={toggleMode}>
            {mode === "picture" ? (
              <AntDesign name="picture" size={32} color="white" />
            ) : (
              <Feather name="video" size={32} color="white" />
            )}
          </Pressable>
          <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: mode === "picture" ? "white" : "red",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </CameraView>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#B00020',
    textAlign: 'center',
    marginVertical: 10,
  },
  resultCard: {
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  resultText: {
    marginBottom: 8,
  },
  confidence: {
    color: '#666',
    marginBottom: 8,
  },
  recommendations: {
    marginTop: 8,
    lineHeight: 20,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});