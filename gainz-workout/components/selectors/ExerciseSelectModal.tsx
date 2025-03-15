import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Exercise {
  label: string;
  value: string;
}

interface ExerciseSelectModalProps {
  visible: boolean;
  exercises: Exercise[];
  onSelectExercise: (value: string) => void;
  onRequestClose: () => void;
}

export const ExerciseSelectModal: React.FC<ExerciseSelectModalProps> = ({
  visible,
  exercises,
  onSelectExercise,
  onRequestClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = exercises.filter((exercise) =>
    exercise.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Icon Row */}
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="filter" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="sort-amount-desc" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search exercise"
              placeholderTextColor={Colors.text}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Exercises List */}
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => onSelectExercise(item.value)}
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height: '80%',
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconButton: {
    padding: 10,
  },
  searchContainer: {
    marginBottom: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: Colors.text,
  },
  searchTextInput: {
    padding: 10,
    color: Colors.text,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card,
  },
  itemText: {
    color: Colors.text,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.card,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.text,
  },
});
