import React from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';

export interface InputField {
    label: string;
    value: string;
    placeholder: string;
    keyboardType?: 'default' | 'numeric';
    onChangeText: (text: string) => void;
}

interface BaseCalculatorProps {
    title: string;
    inputFields: InputField[];
    onCalculate: () => void;
    result: number;
    buttonText?: string;
    outputText?: string
}

export function BaseCalculator({
    title,
    inputFields,
    onCalculate,
    result,
    buttonText = 'Calculate',
    outputText = 'Estimated'
}: BaseCalculatorProps): JSX.Element {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {inputFields.map((field, index) => (
                <View key={index} style={styles.inputContainer}>
                    <Text style={styles.label}>{field.label}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={field.placeholder}
                        keyboardType={field.keyboardType || 'default'}
                        value={field.value}
                        onChangeText={field.onChangeText}
                        placeholderTextColor={Colors.text}
                    />
                </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={onCalculate}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
            <Text style={styles.result}>
                {outputText}: <Text style={styles.resultValue}>{result.toFixed(2)}</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 40,
        backgroundColor: Colors.background,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: Colors.text,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: Colors.text,
    },
    input: {
        height: 50,
        paddingHorizontal: 15,
        borderRadius: 10,
        color: Colors.text,
        backgroundColor: Colors.card,
    },
    button: {
        backgroundColor: Colors.textButton,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    result: {
        fontSize: 20,
        marginTop: 30,
        color: Colors.text,
        textAlign: 'center',
    },
    resultValue: {
        fontWeight: 'bold',
        fontSize: 24,
        color: Colors.text,
    },
});
