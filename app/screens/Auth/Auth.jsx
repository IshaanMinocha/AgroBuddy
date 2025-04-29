import axios from 'axios';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { BACKEND_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/authContext';

const Auth = ({ navigation }) => {
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.innerContainer}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                    <Heading isRegistering={isRegistering} />
                    {isRegistering ? <RegisterSection navigation={navigation} /> : <LoginSection navigation={navigation} />}
                    <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)} style={styles.toggleButton}>
                        <Text style={styles.toggleText}>
                            {isRegistering ? "Already have an account? " : "Don't have an account? "}
                            <Text style={styles.toggleTextBold}>{isRegistering ? "Login" : "Register"}</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const Heading = ({ isRegistering }) => (
    <Text style={styles.heading}>{isRegistering ? "Create Account" : "Welcome Back"}</Text>
);

const AuthInput = ({ placeholder, value, onChangeText, secureTextEntry }) => (
    <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
    />
);

const AuthButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const LoginSection = ({ navigation }) => {
    const [state, setState] = useContext(AuthContext);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/login`, { mobile: phone, password });
            if (response.data?.user) {
                setState(response.data);
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
                Alert.alert("Success", response.data.message);
                navigation.navigate(response.data.user.role === 'worker' ? "WorkerDashboard" : "ManagerDashboard");
            }
        } catch (error) {
            Alert.alert("Login Failed", error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <View style={styles.authSection}>
            <AuthInput placeholder="Phone Number" value={phone} onChangeText={setPhone} />
            <View style={styles.passwordContainer}>
                <AuthInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <AuthButton title="Login" onPress={handleLogin} />
        </View>
    );
};

const RegisterSection = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        console.log(BACKEND_URL);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/register`, { name, mobile: phone, password });
            console.log(response.data);
            if (response.data?.user) {
                Alert.alert("Success", response.data.message);
                navigation.navigate(response.data.user.role === 'worker' ? "WorkerDashboard" : "ManagerDashboard");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Registration Failed", error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <View style={styles.authSection}>
            <AuthInput placeholder="Full Name" value={name} onChangeText={setName} />
            <AuthInput placeholder="Phone Number" value={phone} onChangeText={setPhone} />
            <View style={styles.passwordContainer}>
                <AuthInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <AuthButton title="Register" onPress={handleRegister} />
        </View>
    );
};

const styles = {
    container: { flex: 1, backgroundColor: '#000' },
    scrollContainer: { flexGrow: 1 },
    innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    logo: { width: 120, height: 120, marginBottom: 20 },
    heading: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    authSection: { width: '100%', alignItems: 'center' },
    input: { 
        backgroundColor: '#222', 
        padding: 15, 
        borderRadius: 8, 
        color: '#fff', 
        marginBottom: 15, 
        width: 300, // Fixed width for all inputs
        height: 50, // Fixed height for all inputs
    },
    button: { 
        backgroundColor: '#007bff', 
        padding: 15, 
        borderRadius: 8, 
        width: 300, // Fixed width for the button
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    toggleButton: { marginTop: 20 },
    toggleText: { color: 'gray', fontSize: 14 },
    toggleTextBold: { color: '#fff', fontWeight: 'bold' },
    passwordContainer: { position: 'relative', width: 300, marginBottom: 15 }, // Fixed width for password container
    eyeIcon: { position: 'absolute', right: 15, top: 13 }
};

export default Auth;