import React from 'react';
import { FlatList, View } from 'react-native';
import { BatchItem } from './BatchItem';
import { Set } from '@/models/Set';

interface BatchListProps {
  batches: Array<{ id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string }>;
  onAddSet: (batchId: number) => void;
  onInputChange: (batchId: number, field: string, value: string) => void;
  onFinishExercise: (batchId: number) => void;
}

export const BatchList: React.FC<BatchListProps> = ({ batches, onAddSet, onInputChange, onFinishExercise }) => {
  return (
    <FlatList
      data={batches}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <BatchItem
          batch={item}
          onAddSet={onAddSet}
          onInputChange={onInputChange}
          onFinishExercise={onFinishExercise}
        />
      )}
    />
  );
};
