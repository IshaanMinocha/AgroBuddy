import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        token: '',
    })

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const userProfile = await AsyncStorage.getItem('userData')
                const token = await AsyncStorage.getItem('token')
                if (userProfile && token) {
                    setState({ ...state, user: JSON.parse(userProfile), token })
                }
            } catch (error) {
                console.error(error)
            }
        }
        getUserProfile()
    }, [])

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    )

}
export { AuthContext, AuthProvider }