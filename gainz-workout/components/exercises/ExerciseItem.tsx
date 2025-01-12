import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { Exercise } from '@/models/Exercise';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import IconButton from '../IconButton';

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
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDelete = () => {
        setIsModalVisible(false);
        onDelete(exercise);
    };

    return (
        <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDescription}>{exercise.description}</Text>

            {/* Expandable Button */}
            <TouchableOpacity
                style={styles.expandButton}
                onPress={() => setIsExpanded(!isExpanded)}
            >
                <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={Colors.white}
                />
            </TouchableOpacity>

            {/* Expanded Button Section */}
            {isExpanded && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => onDetails(exercise)} style={styles.actionButton}>
                        <Ionicons name="newspaper" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onEdit(exercise)} style={styles.actionButton}>
                        <Ionicons name="pencil" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.actionButton}>
                        <Ionicons name="trash" size={24} color={Colors.white} />
                    </TouchableOpacity>
                </View>
            )}

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
                            <IconButton iconName="ban" text="Cancel" onPress={() => setIsModalVisible(false)} />
                            <IconButton iconName="trash" text="Delete" onPress={handleDelete} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    exerciseItem: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    exerciseName: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text,
    },
    exerciseDescription: {
        fontSize: 14,
        color: Colors.text,
        marginVertical: 5,
    },
    expandButton: {
        alignItems: 'center',
        paddingVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        padding: 8,
        backgroundColor: Colors.secundary,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: 320,
        padding: 25,
        backgroundColor: Colors.card,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 15,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
});
