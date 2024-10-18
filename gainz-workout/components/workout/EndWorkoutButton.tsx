import { Colors } from '@/constants/Colors';
import React from 'react';
import { Button, View } from 'react-native';

interface EndWorkoutButtonProps {
  onEndWorkout: () => void;
}

export const EndWorkoutButton: React.FC<EndWorkoutButtonProps> = ({ onEndWorkout }) => {
  return (
    <View>
      <Button title="End Workout" onPress={onEndWorkout} color={Colors.light.secundary} />
    </View>
  );
};
