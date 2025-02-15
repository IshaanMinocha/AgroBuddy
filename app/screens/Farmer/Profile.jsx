import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/authContext';

const ProfileSection = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>
            {children}
        </View>
    </View>
);

const MenuItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <Ionicons name={icon} size={24} color="#2E7D32" />
        <View style={styles.menuItemText}>
            <Text style={styles.menuItemTitle}>{title}</Text>
            {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
);

const Profile = () => {

    const [state, setState] = useContext(AuthContext);

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{state?.user?.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.farmerName}>{state?.user?.name}</Text>
                <Text style={styles.farmName}>Farmer in Delhi</Text>
            </View>

            {/* Farm Details Section */}
            <ProfileSection title="Farm Details">
                <MenuItem
                    icon="leaf"
                    title="Crop History"
                    subtitle="View past and current crops"
                    onPress={() => { Alert.alert('View past and current crops', "from your farm") }}
                />
                <MenuItem
                    icon="resize"
                    title="Land Size"
                    subtitle="50 acres"
                    onPress={() => { Alert.alert('50 acres of land', "in your farm") }}
                />
                <MenuItem
                    icon="hardware-chip"
                    title="IoT Devices"
                    subtitle="0 devices connected"
                    onPress={() => { Alert.alert('No IoT devices connected') }}
                />
            </ProfileSection>

            {/* Notifications Section */}
            <ProfileSection title="Notifications">
                <MenuItem
                    icon="notifications"
                    title="Alert Settings"
                    subtitle="Weather, pests, marketplace"
                    onPress={() => { }}
                />
                <MenuItem
                    icon="bar-chart"
                    title="Market Updates"
                    subtitle="Price alerts and trends"
                    onPress={() => { }}
                />
            </ProfileSection>

            {/* Preferences Section */}
            <ProfileSection title="Preferences">
                <MenuItem
                    icon="language"
                    title="Language"
                    subtitle="English"
                    onPress={() => { }}
                />
                <MenuItem
                    icon="color-palette"
                    title="Theme"
                    subtitle="Light mode"
                    onPress={() => { }}
                />
            </ProfileSection>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2E7D32',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    farmerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    farmName: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    section: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        padding: 15,
        backgroundColor: '#f9f9f9',
    },
    sectionContent: {
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuItemText: {
        flex: 1,
        marginLeft: 15,
    },
    menuItemTitle: {
        fontSize: 16,
        color: '#333',
    },
    menuItemSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
});

export default Profile;