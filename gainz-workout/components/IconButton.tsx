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
        width: '45%',
        padding: 10,
        backgroundColor: Colors.light.trinairy,
        borderRadius: 5,
        borderColor: Colors.light.text,
        alignItems: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        color: Colors.light.text,
        marginLeft: 10,
        fontSize: 16,
    },
});

export default ButtonComponent;
