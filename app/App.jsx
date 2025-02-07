import * as React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/authContext';
import ScreenMenu from './screens/ScreenMenu';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={styles.centeredView}>
          <StatusBar barStyle="default" />
          <NavigationContainer>
            <AuthProvider>
              <PaperProvider>
                <ScreenMenu />
              </PaperProvider>
            </AuthProvider>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
});

export default App;
