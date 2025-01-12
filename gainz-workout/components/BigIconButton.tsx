import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';

type ButtonProps = {
    iconName: keyof typeof Ionicons.glyphMap;
    text: string;
    onPress?: () => void;
};

const ButtonComponent: React.FC<ButtonProps> = ({ iconName, text, onPress }) => {
    const handlePress = onPress || (() => { });

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handlePress} style={styles.buttonContent}>
                <Ionicons name={iconName} size={24} color="white" />
                <Text style={styles.buttonText}>
                    {text}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        width: '90%',
        padding: 10,
        backgroundColor: Colors.secundary,
        borderRadius: 5,
        borderColor: Colors.text,
        alignItems: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        color: Colors.text,
        marginLeft: 10,
        fontSize: 16,
    },
});

export default ButtonComponent;
