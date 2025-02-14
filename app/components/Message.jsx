import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MD3Colors } from "react-native-paper";

export const Message = ({ message, type }) => (
    <View style={[styles.messageRow, type === 'user' ? styles.userRow : styles.botRow]}>
        {type === 'bot' && (
            <View style={styles.avatarContainer}>
                <MaterialCommunityIcons name="robot" size={24} color="#666" />
            </View>
        )}
        <View style={[
            styles.messageBubble,
            type === 'user' ? styles.userBubble : styles.botBubble
        ]}>
            <Text style={[
                styles.messageText,
                type === 'user' ? styles.userText : styles.botText
            ]}>
                {message}
            </Text>
        </View>
        {type === 'user' && (
            <View style={styles.avatarContainer}>
                <MaterialCommunityIcons name="account" size={24} color="#666" />
            </View>
        )}
    </View>
);

const styles = StyleSheet.create({
    messageRow: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'flex-end',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    botRow: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        marginHorizontal: 8,
    },
    messageBubble: {
        maxWidth: '70%',
        padding: 12,
        borderRadius: 20,
        elevation: 1,
    },
    userBubble: {
        backgroundColor: MD3Colors.primary40,
        borderBottomRightRadius: 5,
    },
    botBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 5,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    userText: {
        color: '#FFFFFF',
    },
    botText: {
        color: '#333333',
    },
});