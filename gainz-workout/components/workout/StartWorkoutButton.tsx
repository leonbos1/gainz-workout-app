import React from 'react';
import { Button, View } from 'react-native';

interface StartWorkoutButtonProps {
  onStartWorkout: () => void;
}

export const StartWorkoutButton: React.FC<StartWorkoutButtonProps> = ({ onStartWorkout }) => {
  return (
    <View>
      <Button title="Start Workout" onPress={onStartWorkout} />
    </View>
  );
};
