import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface DangerTextButtonProps {
    title: string;
    onPress: () => void;
}

export default function DangerTextButton({ title, onPress }: DangerTextButtonProps) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    text: {
        color: Colors.light.dangerButton,
        fontSize: 16,
        margin: 10,
    },
});
