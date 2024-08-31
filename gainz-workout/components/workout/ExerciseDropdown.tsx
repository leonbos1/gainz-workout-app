import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/models/Exercise';

interface ExerciseDropdownProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;  // Updated type
  selectedExercise: string | null;
  setSelectedExercise: React.Dispatch<React.SetStateAction<string | null>>;  // Updated type
  exercises: Array<{ label: string, value: string }>;
  addExercise: () => void;
}

export const ExerciseDropdown: React.FC<ExerciseDropdownProps> = ({
  open,
  setOpen,
  selectedExercise,
  setSelectedExercise,
  exercises,
  addExercise,
}) => {
  return (
    <DropDownPicker
      open={open}
      value={selectedExercise}
      items={exercises}
      onChangeValue={addExercise}
      setOpen={setOpen}
      setValue={setSelectedExercise}
      searchable={true}
      placeholder="Select Exercise"
      style={styles.dropdown}
      textStyle={{ color: Colors.light.text }}
      dropDownContainerStyle={{ backgroundColor: Colors.light.card }}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: Colors.light.card,
    color: Colors.light.text,
  },
});