import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import IconButton from '@/components/buttons/IconButton';
import MusclegroupSelectList from '@/components/selectors/MusclegroupSelectList';
import EquipmentMultipleSelectList from '@/components/selectors/EquipmentMultipleSelectList';
import { Colors } from '@/constants/Colors';

interface AddExerciseMenuProps {
  isAddMode: boolean;
  setIsAddMode: (isAddMode: boolean) => void;
  newExerciseName: string;
  setNewExerciseName: (name: string) => void;
  newExerciseDescription: string;
  setNewExerciseDescription: (desc: string) => void;
  selectedMuscleGroup: any;
  setSelectedMuscleGroup: (group: any) => void;
  selectedEquipment: any[];
  setSelectedEquipment: (equipment: any[]) => void;
  handleAddExercise: () => void;
  handleCloseExercise: () => void;
}

export default function AddExerciseMenu({
  isAddMode,
  setIsAddMode,
  newExerciseName,
  setNewExerciseName,
  newExerciseDescription,
  setNewExerciseDescription,
  selectedMuscleGroup,
  setSelectedMuscleGroup,
  selectedEquipment,
  setSelectedEquipment,
  handleAddExercise,
  handleCloseExercise,
}: AddExerciseMenuProps) {
  if (!isAddMode) return null;

  return (
    <View style={styles.addExerciseContainer}>
      <TextInput
        style={styles.input}
        placeholder="Exercise Name"
        value={newExerciseName}
        onChangeText={setNewExerciseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={newExerciseDescription}
        onChangeText={setNewExerciseDescription}
      />
      <MusclegroupSelectList onMuscleGroupSelected={setSelectedMuscleGroup} />
      <EquipmentMultipleSelectList onEquipmentSelected={setSelectedEquipment} />
      <View style={styles.buttonContainer}>
        <IconButton iconName="ban" text="Close" onPress={handleCloseExercise} />
        <IconButton iconName="add-circle" text="Add Exercise" onPress={handleAddExercise} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addExerciseContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: Colors.light.backgroundSecondary,
    borderColor: Colors.white,
    borderRadius: 25,
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});
