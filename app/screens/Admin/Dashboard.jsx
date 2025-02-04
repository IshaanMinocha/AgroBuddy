import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/authContext';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Home from './Home';
import Content from './Content';
import Users from './Users';
import Usage from './Usage';

const Dashboard = () => {
  const [state] = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const routes = [
    { key: 'dashboard', title: 'Dashboard', focusedIcon: 'home' },
    { key: 'users', title: 'Users', focusedIcon: 'account-group' },
    { key: 'usage', title: 'Usage', focusedIcon: 'graph' },
    { key: 'content', title: 'Content', focusedIcon: 'newspaper' },
  ];

  const scenes = {
    dashboard: () => <Home />,
    content: () => <Content/>,
    users: () => <Users/>,
    usage: () => <Usage/>,
  };

  return (
    <View style={styles.container}>
      <Header state={state} />
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
