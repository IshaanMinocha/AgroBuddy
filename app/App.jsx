import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/authContext';
import ScreenMenu from './screens/ScreenMenu';
import { PaperProvider } from 'react-native-paper';

const App = () => {

  return (
    <>
      <StatusBar barStyle="default" />
      <NavigationContainer>
        <AuthProvider>
          <PaperProvider>
            <ScreenMenu />
          </PaperProvider>
        </AuthProvider>
      </NavigationContainer>
    </>
  );
};

export default App;
