import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFocusEffect } from '@react-navigation/native';

import { Exercise } from '@/models/Exercise';
import { Workout } from '@/models/Workout';
import { Set } from '@/models/Set';

import { StartWorkoutButton } from '@/components/workout/StartWorkoutButton';
import { ExerciseDropdown } from '@/components/workout/ExerciseDropdown';
import { BatchList } from '@/components/workout/BatchList';
import { EndWorkoutButton } from '@/components/workout/EndWorkoutButton';

export default function WorkoutScreen() {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [batches, setBatches] = useState<Array<{ id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string }>>([]);
  const [exercises, setExercises] = useState<Array<{ label: string, value: string }>>([]);

  // Fetch exercises from the database
  const fetchExercises = async () => {
    try {
      const fetchedExercises = await Exercise.findAll();
      const formattedExercises = fetchedExercises.map(exercise => ({
        label: exercise.name,
        value: exercise.name,
      }));
      setExercises(formattedExercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  // useFocusEffect to reload data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchExercises();
      setOpen(false);
    }, [])
  );

  // Function to handle starting a workout
  const handleStartWorkout = async () => {
    try {
      // Create a new workout in the database
      const newWorkout = await Workout.create({
        start: new Date().toISOString(),
        end: '',
      });

      // Set workout ID and mark workout as started
      setWorkoutId(newWorkout.id);
      setWorkoutStarted(true);
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const handleEndWorkout = async () => {
    try {
      // Update the workout in the database
      await Workout.endWorkout(workoutId!, new Date().toISOString());

      // Reset state
      setWorkoutId(null);
      setWorkoutStarted(false);
      setBatches([]);
    } catch (error) {
      console.error('Error ending workout:', error);
    }
  }

  const handleAddExercise = () => {
    if (selectedExercise) {
      const newBatch = {
        id: batches.length + 1,
        name: selectedExercise,
        sets: [],
        reps: '',
        weight: '',
        rpe: '',
      };
      setBatches([...batches, newBatch]);
      setSelectedExercise(null);
    }
  };

  const handleAddSet = (batchId: number) => {
    setBatches(batches.map(batch => {
      if (batch.id === batchId) {
        const newSet = new Set(
          batch.sets.length + 1,
          0,  // Assuming exerciseId is not needed here
          parseInt(batch.reps),
          parseFloat(batch.weight),
          parseFloat(batch.rpe),
          batchId
        );
        return { ...batch, sets: [...batch.sets, newSet], reps: '', weight: '', rpe: '' };
      }
      return batch;
    }));
  };

  const handleInputChange = (batchId: number, field: string, value: string) => {
    setBatches(batches.map(batch => {
      if (batch.id === batchId) {
        return { ...batch, [field]: value };
      }
      return batch;
    }));
  };

  return (
    <View style={styles.contentContainer}>
      {!workoutStarted ? (
        <StartWorkoutButton onStartWorkout={handleStartWorkout} />
      ) : (
        <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.screenTitle}>Log Workout</ThemedText>
          </ThemedView>

          <ExerciseDropdown
            open={open}
            setOpen={setOpen}
            selectedExercise={selectedExercise}
            setSelectedExercise={setSelectedExercise}
            exercises={exercises}
          />

          <Button title="Add Exercise" onPress={handleAddExercise} disabled={!selectedExercise} />

          <BatchList
            batches={batches}
            onAddSet={handleAddSet}
            onInputChange={handleInputChange}
          />
          <EndWorkoutButton onEndWorkout={handleEndWorkout} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
    marginTop: 30,
  },
  titleContainer: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
