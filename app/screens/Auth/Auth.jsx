import axios from 'axios';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { BACKEND_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/authContext';

const Auth = ({navigation}) => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegisterToggle = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: 'black' }}
            behavior="height"
            keyboardVerticalOffset={0}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ flex: 1, backgroundColor: '#1a1a1a', paddingTop: 20 }}>
                    <View style={{ flex: 1, paddingHorizontal: 16 }}>
                        <Heading isRegistering={isRegistering} />
                        {isRegistering ? <RegisterSection navigation={navigation}  /> : <LoginSection navigation={navigation} />}
                    </View>
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                        <TouchableOpacity onPress={handleRegisterToggle}>
                            <Text style={{ color: 'gray', textAlign: 'center', paddingHorizontal: 8 }}>
                                {isRegistering ? (
                                    <Text>
                                        Already have an account?{' '}
                                        <Text style={{ color: 'white' }}>Login</Text>
                                    </Text>
                                ) : (
                                    <Text>
                                        Don't have an account?{' '}
                                        <Text style={{ color: 'white' }}>Register</Text>
                                    </Text>
                                )}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const Heading = ({ isRegistering }) => {
    return (
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 32 }}>
            {isRegistering ? "Register" : "Log In"}
        </Text>
    );
};

const LoginSection = ({ navigation }) => {
    const [state, setState] = useContext(AuthContext);

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('worker');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {

        console.log(BACKEND_URL);
        
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/login`, { mobile: phone, password });
            if (response.data && response.data.user) {
                setState(response.data);
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
                // console.log('Login successful:', state);
                Alert.alert(response && response.data.message);

                const userRole = response.data.user.role;
                if (userRole === 'worker') {
                    navigation.navigate("WorkerDashboard");
                } else if (userRole === 'manager') {
                    navigation.navigate("ManagerDashboard");
                }
            } else {
                throw new Error('Invalid response from the server');
            }
        } catch (error) {
            // console.log('Login error:', error);
            Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred');
        }
    };
    

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <TextInput
                style={{ backgroundColor: '#333', padding: 16, borderRadius: 8, color: 'white', marginBottom: 16 }}
                placeholder="Phone Number"
                placeholderTextColor="gray"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
            <View style={{ position: 'relative', marginBottom: 16 }}>
                <TextInput
                    style={{ backgroundColor: '#333', padding: 16, borderRadius: 8, color: 'white' }}
                    placeholder="Password"
                    placeholderTextColor="gray"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={{ position: 'absolute', right: 16, top: 16 }}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row', alignItems: 'center', padding: 8, marginRight: 8,
                        backgroundColor: role === 'manager' ? '#555' : '#333', borderRadius: 8
                    }}
                    onPress={() => setRole('manager')}
                >
                    <View
                        style={{
                            width: 20, height: 20, borderWidth: 2, borderColor: 'white', borderRadius: 10,
                            backgroundColor: role === 'manager' ? 'white' : 'transparent'
                        }}
                    />
                    <Text style={{ color: 'white', marginLeft: 8, fontWeight: role === 'manager' ? 'bold' : 'normal' }}>
                        Manager
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row', alignItems: 'center', padding: 8,
                        backgroundColor: role === 'worker' ? '#555' : '#333', borderRadius: 8
                    }}
                    onPress={() => setRole('worker')}
                >
                    <View
                        style={{
                            width: 20, height: 20, borderWidth: 2, borderColor: 'white', borderRadius: 10,
                            backgroundColor: role === 'worker' ? 'white' : 'transparent'
                        }}
                    />
                    <Text style={{ color: 'white', marginLeft: 8, fontWeight: role === 'worker' ? 'bold' : 'normal' }}>
                        Worker
                    </Text>
                </TouchableOpacity>
            </View> */}
            <TouchableOpacity
                style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 16 }}
                onPress={handleSubmit}
            >
                <Text style={{ color: 'black', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                    Login
                </Text>
            </TouchableOpacity>
            {/* <Text>{JSON.stringify({phone, password, role} )}</Text> */}
        </View>
    );
};

const RegisterSection = ({ navigation }) => {
    const [state, setState] = useContext(AuthContext);

    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/register`, { name, mobile: phone, password });
    
            if (response.data && response.data.user) {
                setState(response.data);
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
                // console.log('Registration successful:', state);
                Alert.alert('Success', response.data.message);

                const userRole = response.data.user.role;
                if (userRole === 'worker') {
                    navigation.navigate("WorkerDashboard");
                } else if (userRole === 'manager') {
                    navigation.navigate("ManagerDashboard");
                }

            } else {
                throw new Error('Invalid response from the server');
            }
        } catch (error) {
            // console.log('Registration error:', error);
            Alert.alert('Registration Failed', error.response?.data?.message || 'An error occurred');
        }
    };
    
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <TextInput
                style={{ backgroundColor: '#333', padding: 16, borderRadius: 8, color: 'white', marginBottom: 16 }}
                placeholder="Name"
                placeholderTextColor="gray"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={{ backgroundColor: '#333', padding: 16, borderRadius: 8, color: 'white', marginBottom: 16 }}
                placeholder="Phone Number"
                placeholderTextColor="gray"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
            <View style={{ position: 'relative', marginBottom: 16 }}>
                <TextInput
                    style={{ backgroundColor: '#333', padding: 16, borderRadius: 8, color: 'white' }}
                    placeholder="Password"
                    placeholderTextColor="gray"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={{ position: 'absolute', right: 16, top: 16 }}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 16 }}
                onPress={handleSubmit}
            >
                <Text style={{ color: 'black', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                    Register
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Auth;
