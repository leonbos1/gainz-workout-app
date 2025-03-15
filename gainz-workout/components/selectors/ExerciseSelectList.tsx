import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ExerciseSelectModal } from './ExerciseSelectModal'; // adjust the path as needed

interface ExerciseSelectListProps {
  selectedExercise: string | null;
  setSelectedExercise: (exercise: string | null) => void;
  exercises: Array<{ label: string; value: string }>;
}

export const ExerciseSelectList: React.FC<ExerciseSelectListProps> = ({
  selectedExercise,
  setSelectedExercise,
  exercises,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectExercise = (value: string) => {
    setSelectedExercise(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>
          {selectedExercise
            ? exercises.find((ex) => ex.value === selectedExercise)?.label
            : 'Select an exercise'}
        </Text>
      </TouchableOpacity>
            
      <ExerciseSelectModal
        visible={modalVisible}
        exercises={exercises}
        onSelectExercise={handleSelectExercise}
        onRequestClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: Colors.card,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.card,
  },
  dropdownText: {
    color: Colors.text,
  },
});
