import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

interface ExerciseDropdownProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;  // Updated type
  selectedExercise: string | null;
  setSelectedExercise: React.Dispatch<React.SetStateAction<string | null>>;  // Updated type
  exercises: Array<{ label: string, value: string }>;
}

export const ExerciseDropdown: React.FC<ExerciseDropdownProps> = ({
  open,
  setOpen,
  selectedExercise,
  setSelectedExercise,
  exercises,
}) => {
  return (
    <DropDownPicker
      open={open}
      value={selectedExercise}
      items={exercises}
      setOpen={setOpen}
      setValue={setSelectedExercise}
      searchable={true}
      placeholder="Select Exercise"
    />
  );
};
