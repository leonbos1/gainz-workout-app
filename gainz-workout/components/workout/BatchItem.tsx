import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Set } from '@/models/Set';
import { Colors } from '@/constants/Colors';
import { Icon } from 'react-native-vector-icons/Icon';

interface BatchItemProps {
  batch: { id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string };
  onAddSet: (batchId: number) => void;
  onInputChange: (batchId: number, field: string, value: string) => void;
  onFinishExercise: (batchId: number) => void;
}

export const BatchItem: React.FC<BatchItemProps> = ({ batch, onAddSet, onInputChange, onFinishExercise }) => {
  const [isExerciseFinished, setIsExerciseFinished] = useState(false);
  const isAddEnabled = batch.reps.trim() !== '' && batch.weight.trim() !== '';

  const repsInputRef = useRef<TextInput>(null);
  const weightInputRef = useRef<TextInput>(null);
  const rpeInputRef = useRef<TextInput>(null);

  const handleFinishExercise = () => {
    setIsExerciseFinished(true);
    onFinishExercise(batch.id);
  };

  return (
    <View style={styles.batchContainer}>
      <Text style={styles.batchTitle}>{batch.name}</Text>
      <View>
        {/* Header row with column labels */}
        <View style={styles.setInputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.columnLabel}>Reps</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.columnLabel}>Weight (kg)</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.columnLabel}>RPE</Text>
          </View>
        </View>

        {batch.sets.length > 0 ? (
          <FlatList
            data={batch.sets}
            keyExtractor={(set) => set.id.toString()}
            renderItem={({ item: set }) => (
              <View style={styles.setInputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.resultValue}>{set.amount}</Text>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.resultValue}>{set.weight}</Text>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.resultValue}>{set.rpe ? set.rpe : '-'}</Text>
                </View>
              </View>
            )}
          />
        ) : (
          <View></View>
        )}
      </View>
      {!isExerciseFinished && (
        <>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={repsInputRef}
                style={styles.input}
                value={batch.reps}
                keyboardType="number-pad"
                returnKeyType="next"
                onChangeText={(value) => onInputChange(batch.id, 'reps', value)}
                onSubmitEditing={() => weightInputRef.current?.focus()}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                ref={weightInputRef}
                style={styles.input}
                value={batch.weight}
                keyboardType="number-pad"
                returnKeyType="next"
                onChangeText={(value) => onInputChange(batch.id, 'weight', value)}
                onSubmitEditing={() => rpeInputRef.current?.focus()}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                ref={rpeInputRef}
                style={styles.input}
                value={batch.rpe}
                keyboardType="number-pad"
                returnKeyType="done"
                onChangeText={(value) => onInputChange(batch.id, 'rpe', value)}
                onSubmitEditing={() => isAddEnabled && onAddSet(batch.id)}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, !isAddEnabled && styles.buttonDisabled]}
              onPress={() => onAddSet(batch.id)}
              disabled={!isAddEnabled}
            >
              <Text style={styles.buttonText}>Add Set</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleFinishExercise}
            >
              <Text style={styles.buttonText}>Finish Exercise</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {isExerciseFinished && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsExerciseFinished(false)}
        >
          <Text style={styles.buttonText}>Continue Exercise</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  columnLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.text,
    marginBottom: 5,
  },
  placeholderRow: {
    marginTop: 10,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.light.text,
    fontStyle: 'italic',
  },
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
  setDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 5,
  },
  setLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  setValue: {
    fontSize: 16,
    fontWeight: 'normal',
    color: Colors.light.text,
  },
  batchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.text,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.card,
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
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    marginVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonDisabled: {
    marginVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
  },
  buttonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  setInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  resultValue: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.card,
    textAlign: 'center',
  },
});