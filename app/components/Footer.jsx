import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Footer = ({ routes, scenes, onNavigate }) => {
  const [index, setIndex] = React.useState(0);

  const handleIndexChange = (newIndex) => {
    setIndex(newIndex);
    onNavigate(routes[newIndex].key);
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleIndexChange}
      renderScene={BottomNavigation.SceneMap(scenes)}
      style={styles.footer}
    />
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#171717',
    height: 60,
  },
});

export default Footer;
