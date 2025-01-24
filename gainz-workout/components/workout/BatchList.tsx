import React from 'react';
import { FlatList, View } from 'react-native';
import { BatchItem } from './BatchItem';
import { Set } from '@/models/Set';

interface BatchListProps {
  batches: Array<{ id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string, completed: boolean }>;
  onAddSet: (batchId: number, completed: boolean) => void;
  onInputChange: (batchId: number, field: string, value: string) => void;
  onFinishExercise: (batchId: number) => void;
  onToggleSetCompletion: (setId: number) => void;
  updateBatch: (batchId: number, updatedFields: Partial<{ id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string }>) => void;
}

export const BatchList: React.FC<BatchListProps> = ({
  batches,
  onAddSet,
  onInputChange,
  onFinishExercise,
  onToggleSetCompletion,
  updateBatch,
}) => {
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
          onToggleSetCompletion={onToggleSetCompletion}
          updateBatch={updateBatch}
        />
      )}
    />
  );
};
