import React, { useContext } from 'react';
import Auth from './Auth/Auth';
import FarmerDashboard from './Farmer/Dashboard';
import AdminDashboard from './Admin/Dashboard';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/authContext';

const ScreenMenu = () => {
    const [state] = useContext(AuthContext);

    const authenticatedUser = state?.user && state?.token;
    const userRole = state?.user?.role;
    
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Auth'>
            {authenticatedUser ? (
                userRole === 'user' ? (
                    <>
                        <Stack.Screen
                            name="FarmerDashboard"
                            component={FarmerDashboard}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="AdminDashboard"
                            component={AdminDashboard}
                            options={{ headerShown: false }}
                        />
                    </>
                )
            ) : (
                <Stack.Screen
                    name="Auth"
                    component={Auth}
                    options={{ headerShown: false }}
                />
            )}
        </Stack.Navigator>
    );
}

export default ScreenMenu;
