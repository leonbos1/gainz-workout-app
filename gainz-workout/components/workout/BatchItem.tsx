import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Set } from '@/models/Set';
import { Colors } from '@/constants/Colors';
import TextButton from '../TextButton';
import { ThemedView } from '../ThemedView';

interface BatchItemProps {
  batch: { id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string };
  onAddSet: (batchId: number) => void;
  onInputChange: (batchId: number, field: string, value: string) => void;
  onFinishExercise: (batchId: number) => void;
}

export const BatchItem: React.FC<BatchItemProps> = ({ batch, onAddSet, onInputChange, onFinishExercise }) => {
  const [isExerciseFinished, setIsExerciseFinished] = useState(false);
  const isAddEnabled = batch.reps.trim() !== '' && batch.weight.trim() !== '';

  const handleFinishExercise = () => {
    setIsExerciseFinished(true);
    onFinishExercise(batch.id);
  };

  return (
    <View style={styles.batchContainer}>
      <Text style={styles.batchTitle}>{batch.name}</Text>

      {!isExerciseFinished && (
        <>
          <Text style={styles.label}>Reps</Text>
          <TextInput
            style={styles.input}
            value={batch.reps}
            keyboardType="numeric"
            onChangeText={(value) => onInputChange(batch.id, 'reps', value)}
          />
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={batch.weight}
            keyboardType="numeric"
            onChangeText={(value) => onInputChange(batch.id, 'weight', value)}
          />
          <Text style={styles.label}>RPE</Text>
          <TextInput
            style={styles.input}
            value={batch.rpe}
            keyboardType="numeric"
            onChangeText={(value) => onInputChange(batch.id, 'rpe', value)}
          />
          <ThemedView style={styles.buttonContainer}>
            <TextButton title="Add Set" onPress={() => onAddSet(batch.id)} disabled={!isAddEnabled} />
            <TextButton title='Finish Exercise' onPress={handleFinishExercise} disabled={false} />
          </ThemedView>
        </>
      )}
      {isExerciseFinished && (
        <Button title='Continue Exercise' onPress={() => setIsExerciseFinished(false)} />
      )}

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
    backgroundColor: Colors.light.backgroundSecondary,
    color: Colors.light.text,
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
    color: Colors.light.text,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.input,
  },
  setText: {
    fontSize: 16,
    marginTop: 5,
    color: Colors.light.text,
  },
  label: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
});
