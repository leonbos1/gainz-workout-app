import React from 'react';
import { Button, View } from 'react-native';
import BigIconButton from '../buttons/BigIconButton';

interface StartWorkoutButtonProps {
  onStartWorkout: () => void;
}

export const StartWorkoutButton: React.FC<StartWorkoutButtonProps> = ({ onStartWorkout }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <BigIconButton iconName="play" text="Start Workout" onPress={onStartWorkout} />
    </View>
  );
};
