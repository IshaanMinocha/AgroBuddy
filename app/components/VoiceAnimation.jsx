import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';

const VoiceWaveAnimation = ({ isActive, isBot = false }) => {
    const animations = [...Array(5)].map(() => new Animated.Value(1));

    useEffect(() => {
        if (isActive) {
            const animateWave = () => {
                const animationSequence = animations.map((anim, index) => {
                    return Animated.sequence([
                        Animated.delay(index * 100),
                        Animated.loop(
                            Animated.sequence([
                                Animated.timing(anim, {
                                    toValue: 2 + Math.random(),
                                    duration: 500,
                                    useNativeDriver: true,
                                }),
                                Animated.timing(anim, {
                                    toValue: 1,
                                    duration: 500,
                                    useNativeDriver: true,
                                }),
                            ])
                        ),
                    ]);
                });

                Animated.parallel(animationSequence).start();
            };

            animateWave();
        } else {
            animations.forEach(anim => {
                anim.setValue(1);
                anim.stopAnimation();
            });
        }
    }, [isActive]);

    return (
        <View style={[
            styles.container,
            isBot ? styles.botContainer : styles.userContainer
        ]}>
            {animations.map((anim, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.bar,
                        isBot ? styles.botBar : styles.userBar,
                        {
                            transform: [{ scaleY: anim }],
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 60,
        marginHorizontal: 10,
    },
    botContainer: {
        alignSelf: 'flex-start',
    },
    userContainer: {
        alignSelf: 'flex-end',
    },
    bar: {
        width: 5,
        height: 30,
        borderRadius: 1.5,
        marginHorizontal: 1,
    },
    userBar: {
        backgroundColor: '#2196F3',
    },
    botBar: {
        backgroundColor: '#4CAF50',
    },
    text: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 20
    },
});

const VoiceAnimation = ({ isUserSpeaking, isBotSpeaking }) => {
    return (
        <View style={containerStyles.mainContainer}>
            <View style={containerStyles.waveContainer}>
                {isBotSpeaking && <VoiceWaveAnimation isActive={true} isBot={true} />}
            </View>
            <View>
                <Text style={styles.text}>
                    {isUserSpeaking ? "User Speaking!" : isBotSpeaking ? "Bot Speaking!" : "Start Speaking!"}
                </Text>

            </View>
            <View style={containerStyles.waveContainer}>
                {isUserSpeaking && <VoiceWaveAnimation isActive={true} isBot={false} />}
            </View>
        </View>
    );
};

const containerStyles = StyleSheet.create({
    mainContainer: {
        position: 'fixed',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        backgroundColor: 'white',
    },
    waveContainer: {
        height: 40,
        width: 60,
    }
});

export default VoiceAnimation;