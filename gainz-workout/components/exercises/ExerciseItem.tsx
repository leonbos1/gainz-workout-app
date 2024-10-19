import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '@/models/Exercise';
import IconButton from '@/components/IconButton';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface ExerciseItemProps {
    exercise: Exercise;
    onDetails: (exercise: Exercise) => void;
    onEdit: (exercise: Exercise) => void;
    onDelete: (exercise: Exercise) => void;
}

export default function ExerciseItem({
    exercise,
    onDetails,
    onEdit,
    onDelete,
}: ExerciseItemProps) {
    return (
        <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => onDetails(exercise)}>
                    <Ionicons name="newspaper" size={24} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onEdit(exercise)}>
                    <Ionicons name="pencil" size={24} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(exercise)}>
                    <Ionicons name="trash" size={24} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    exerciseItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: Colors.light.card,
        borderRadius: 10,
        color: Colors.light.text,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    exerciseDescription: {
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
