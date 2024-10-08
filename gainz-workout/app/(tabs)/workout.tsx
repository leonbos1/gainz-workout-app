import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Button, Dimensions, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFocusEffect } from '@react-navigation/native';

import { Exercise } from '@/models/Exercise';
import { Workout } from '@/models/Workout';
import { Set } from '@/models/Set';
import { Batch } from '@/models/Batch';

import { StartWorkoutButton } from '@/components/workout/StartWorkoutButton';
import { ExerciseDropdown } from '@/components/workout/ExerciseDropdown';
import { BatchList } from '@/components/workout/BatchList';
import { EndWorkoutButton } from '@/components/workout/EndWorkoutButton';

import { Colors } from '@/constants/Colors';
import DangerTextButton from '@/components/DangerTextButton';

import { Timer } from '@/components/Timer';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WorkoutScreen() {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [batches, setBatches] = useState<Array<{ id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string }>>([]);
  const [exercises, setExercises] = useState<Array<{ label: string, value: string }>>([]);
  const timerRef = React.useRef<{ resetTimer: () => void } | null>(null);

  const handleReset = () => {
      if (timerRef.current) {
      }
  };

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

  useFocusEffect(
    useCallback(() => {
      fetchExercises();
      setOpen(false);
    }, [])
  );

  const handleStartWorkout = async () => {
    try {
      const newWorkout = await Workout.create(new Date().toISOString(), '');

      setWorkoutId(newWorkout.id);
      setWorkoutStarted(true);
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const handleEndWorkout = async () => {
    try {
      await Workout.endWorkout(workoutId!, new Date().toISOString());

      setWorkoutId(null);
      setWorkoutStarted(false);
      setBatches([]);
    } catch (error) {
      console.error('Error ending workout:', error);
    }
  }

  const handleAddExercise = async () => {
    if (selectedExercise && workoutId) {
      try {
        const newBatch = await Batch.create(workoutId, '', 1, 1); //TODO equipmentid en attachmentid implementeren

        const updatedBatch = {
          id: newBatch.id,
          name: selectedExercise,
          sets: [],
          reps: '',
          weight: '',
          rpe: '',
        };

        setBatches([...batches, updatedBatch]);
        setSelectedExercise(null);
      } catch (error) {
        console.error('Error adding batch:', error);
      }
    }
  };

  const handleCancelWorkout = async () => {
    try {
      await Workout.delete(workoutId!);
      setWorkoutId(null);
      setWorkoutStarted(false);
      setBatches([]);
    } catch (error) {
      console.error('Error canceling workout:', error);
    }
  }

  const handleAddSet = async (batchId: number) => {
    const batch = batches.find(b => b.id === batchId);
    const exercise = exercises.find(e => e.value === batch?.name);
    const exerciseId = await Exercise.findIdByName(exercise?.value || '');

    if (batch && exercise && exerciseId !== null) {
      try {
        const newSet = await Set.create(
          exerciseId,
          parseInt(batch.reps),
          parseFloat(batch.weight),
          parseFloat(batch.rpe),
          batchId
        );

        const updatedBatch = {
          ...batch,
          sets: [...batch.sets, newSet],
          reps: '',
          weight: '',
          rpe: '',
        };

        setBatches(batches.map(b => (b.id === batchId ? updatedBatch : b)));
      } catch (error) {
        console.error('Error adding set:', error);
      }
    }
  };

  const handleInputChange = (batchId: number, field: string, value: string) => {
    setBatches(batches.map(batch => {
      if (batch.id === batchId) {
        return { ...batch, [field]: value };
      }
      return batch;
    }));
  };

  const handleFinishExercise = (batchId: number) => {

  }

  return (
    <View style={styles.contentContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.screenTitle}>Workout</ThemedText>
      </ThemedView>
      {!workoutStarted ? (
        <StartWorkoutButton onStartWorkout={handleStartWorkout} />
      ) : (
        <>
          <Timer onReset={() => timerRef.current?.resetTimer()} />
          <BatchList
            batches={batches}
            onAddSet={handleAddSet}
            onInputChange={handleInputChange}
            onFinishExercise={handleFinishExercise}
          />

          <ExerciseDropdown
            open={open}
            setOpen={setOpen}
            selectedExercise={selectedExercise}
            setSelectedExercise={setSelectedExercise}
            exercises={exercises}
            addExercise={handleAddExercise}
          />

          <ThemedView style={styles.buttonContainer}>
            <DangerTextButton onPress={handleCancelWorkout} title="Cancel Workout" />
          </ThemedView>

          <EndWorkoutButton onEndWorkout={handleEndWorkout} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 40,
    backgroundColor: Colors.light.background,
    width: screenWidth,
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
});
