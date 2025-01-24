import React from 'react';
import { Button, View } from 'react-native';
import BigIconButton from '../BigIconButton';

interface StartWorkoutButtonProps {
  onStartWorkout: () => void;
}

export const StartWorkoutButton: React.FC<StartWorkoutButtonProps> = ({ onStartWorkout }) => {
  return (
    <View>
      <BigIconButton iconName="play" text="Start Workout" onPress={onStartWorkout} />
    </View>
  );
};
