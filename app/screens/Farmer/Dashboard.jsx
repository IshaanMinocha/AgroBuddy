import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/authContext';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Home from './Home';
import Profile from './Profile';
import Yield from './Yield';
import Marketplace from './Marketplace';
import Detect from './Detect';


const Dashboard = () => {
  const [state] = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const routes = [
    { key: 'dashboard', title: 'Dashboard', focusedIcon: 'home' },
    { key: 'yield', title: 'Yield++', focusedIcon: 'leaf' },
    { key: 'detect', title: 'Detect', focusedIcon: 'camera' },
    { key: 'marketplace', title: 'Marketplace', focusedIcon: 'shopping' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account' },
  ];

  const scenes = {
    dashboard: () =><Home/>,
    yield: () =><Yield/>,
    detect: () => <Detect/>,
    marketplace: () => <Marketplace/>,
    profile: () => <Profile/>,
  };

  return (
    <View style={styles.container}>
      <Header state={state}/>
      <Footer routes={routes} scenes={scenes} onNavigate={setCurrentPage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16, 
  },
});

export default Dashboard;
