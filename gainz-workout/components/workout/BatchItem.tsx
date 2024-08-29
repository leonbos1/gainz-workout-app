import React from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Set } from '@/models/Set';

interface BatchItemProps {
  batch: { id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string };
  onAddSet: (batchId: number) => void;
  onInputChange: (batchId: number, field: string, value: string) => void;
}

export const BatchItem: React.FC<BatchItemProps> = ({ batch, onAddSet, onInputChange }) => {
  const isAddEnabled = batch.reps.trim() !== '' && batch.weight.trim() !== '';

  return (
    <View style={styles.batchContainer}>
      <Text style={styles.batchTitle}>{batch.name}</Text>

      <TextInput
        style={styles.input}
        placeholder="Reps"
        value={batch.reps}
        keyboardType="numeric"
        onChangeText={(value) => onInputChange(batch.id, 'reps', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={batch.weight}
        keyboardType="numeric"
        onChangeText={(value) => onInputChange(batch.id, 'weight', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="RPE"
        value={batch.rpe}
        keyboardType="numeric"
        onChangeText={(value) => onInputChange(batch.id, 'rpe', value)}
      />

      <Button title="Add Set" onPress={() => onAddSet(batch.id)} disabled={!isAddEnabled} />

      <FlatList
        data={batch.sets}
        keyExtractor={set => set.id.toString()}
        renderItem={({ item: set }) => (
          <Text style={styles.setText}>
            {`Reps: ${set.amount}, Weight: ${set.weight}kg, RPE: ${set.rpe}`}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  batchContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  batchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    fontSize: 16,
  },
  setText: {
    fontSize: 16,
    marginTop: 5,
  },
});
