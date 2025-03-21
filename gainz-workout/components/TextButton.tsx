import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface TextButtonProps {
    title: string;
    onPress: () => void | Promise<void>;
    disabled?: boolean;
}

export default function TextButton({ title, onPress, disabled }: TextButtonProps) {
    return (
        <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    text: {
        color: Colors.textButton,
        fontSize: 16,
        margin: 10,
    },
});
