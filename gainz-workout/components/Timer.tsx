import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface TimerProps {
    onReset?: () => void;
}

export function Timer({ onReset }: TimerProps) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const resetTimer = () => {
        setSeconds(0);
        if (onReset) {
            onReset();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.timer}>{formatTime(seconds)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timer: {
        fontSize: 48,
    },
});