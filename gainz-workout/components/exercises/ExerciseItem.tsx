import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { Exercise } from '@/models/Exercise';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import IconButton from '../buttons/IconButton';

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
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleDelete = () => {
        setIsModalVisible(false);
        onDelete(exercise);
    };

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
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    <Ionicons name="trash" size={24} color={Colors.white} />
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to delete this exercise?</Text>
                        <View style={styles.modalButtonContainer}>
                            <IconButton iconName='ban' text='Cancel' onPress={() => setIsModalVisible(false)} />
                            <IconButton iconName='trash' text='Delete' onPress={handleDelete} />
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: Colors.light.card,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        color: Colors.light.text,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        width: '45%',
        backgroundColor: Colors.light.trinairy,
        borderRadius: 5,
    },
    modalButtonText: {
        color: Colors.light.text,
        textAlign: 'center',
    },
});