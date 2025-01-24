import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Set } from '@/models/Set';
import { Colors } from '@/constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

interface BatchItemProps {
  batch: { id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string, completed: boolean };
  onAddSet: (batchId: number, completed: boolean) => void;
  onInputChange: (batchId: number, field: string, value: string) => void;
  onFinishExercise: (batchId: number) => void;
  onToggleSetCompletion: (setId: number) => void;
  updateBatch: (batchId: number, updatedFields: Partial<{ id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string }>) => void;
}

export const BatchItem: React.FC<BatchItemProps> = ({
  batch,
  onAddSet,
  onInputChange,
  onFinishExercise,
  onToggleSetCompletion,
  updateBatch
}) => {
  const [isExerciseFinished, setIsExerciseFinished] = useState(false);
  const isAddEnabled = batch.reps.trim() !== '' && batch.weight.trim() !== '';

  const repsInputRef = useRef<TextInput>(null);
  const weightInputRef = useRef<TextInput>(null);
  const rpeInputRef = useRef<TextInput>(null);

  const handleFinishExercise = () => {
    setIsExerciseFinished(true);
    onFinishExercise(batch.id);
  };

  const toggleDone = async (setId: number) => {
    await onToggleSetCompletion(setId);

    const updatedSets = batch.sets.map((set) => {
      if (set.id === setId) {
        return {
          ...set,
          completed: !set.completed,
        } as Set;
      }
      return set;
    });

    updateBatch(batch.id, { sets: updatedSets });
  };

  return (
    <View style={styles.batchContainer}>
      <Text style={styles.batchTitle}>{batch.name}</Text>
      <View>
        <View style={[styles.setInputRow, styles.headerRow]}>
          <View style={styles.inputContainerHeader}>
            <Text style={styles.columnLabel}>Reps</Text>
          </View>
          <View style={styles.inputContainerHeader}>
            <Text style={styles.columnLabel}>Weight (kg)</Text>
          </View>
          <View style={styles.inputContainerHeader}>
            <Text style={styles.columnLabel}>RPE</Text>
          </View>
          <View style={styles.inputContainerHeader}>
            <Text style={styles.columnLabel}>Done</Text>
          </View>
        </View>

        {batch.sets.length > 0 && (
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
                <View style={styles.inputContainer}>
                  <TouchableOpacity onPress={async () => await toggleDone(set.id)}>
                    <Icon
                      name={set.completed ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={set.completed ? Colors.green : Colors.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
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
              />
            </View>
            <View style={styles.inputContainer}>
              <TouchableOpacity
                onPress={() => onAddSet(batch.id, true)}
              >
                <Icon
                  name={batch.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={batch.completed ? Colors.green : Colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, !isAddEnabled && styles.buttonDisabled]}
              onPress={() => onAddSet(batch.id, false)}
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
    color: Colors.text,
    marginBottom: 5,
  },
  batchContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.background,
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
    color: Colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainerHeader: {
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  input: {
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.card,
    textAlign: 'center',
  },
  boolInput: {
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  buttonDisabled: {
    backgroundColor: Colors.background,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  setInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  headerRow: {
    marginBottom: 10,
  },
  resultValue: {
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.card,
    textAlign: 'center',
  },
});
