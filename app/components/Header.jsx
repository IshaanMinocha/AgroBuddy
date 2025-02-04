import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/authContext';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
    const [state, setState] = useContext(AuthContext);

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('token');
            setState({ user: null, token: '' });
            console.log("logged out");
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Hello, {state?.user?.name}</Text>
            <TouchableOpacity onPress={logout}>
                <Icon name="logout" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#2d2d2d',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Header;