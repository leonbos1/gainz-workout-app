import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { Exercise } from '@/models/Exercise';
import { Workout } from '@/models/Workout';
import { Set } from '@/models/Set';
import { Batch } from '@/models/Batch';
import { StartWorkoutButton } from '@/components/workout/StartWorkoutButton';
import { BatchList } from '@/components/workout/BatchList';
import { Colors } from '@/constants/Colors';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import IconButton from '@/components/IconButton';
import { Equipment } from '@/models/Equipment';
import { Attachment } from '@/models/Attachment';
import { getExerciseNameFromExerciseString } from '@/helpers/csvHelper';
import { ExerciseDropdown } from '@/components/workout/ExerciseDropdown';

const screenWidth = Dimensions.get('window').width;


export default function WorkoutScreen() {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [batches, setBatches] = useState<Array<{ id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string }>>([]);
  const [exercises, setExercises] = useState<Array<{ label: string, value: string }>>([]);
  const [exerciseSelectionOpen, setExerciseSelectionOpen] = useState(false);
  const [equipmentSelectionOpen, setEquipmentSelectionOpen] = useState(false);
  const [attachmentSelectionOpen, setAttachmentSelectionOpen] = useState(false);

  const fetchExercises = async () => {
    try {
      const fetchedExercises = await Exercise.findAll();
      setExercises(fetchedExercises.map(exercise => ({
        label: exercise.name,
        value: exercise.name,
      })));
    } catch (error) {
      Logger.log_error('Error fetching exercises:', error as string);
    }
  };

  const handleStartWorkout = async () => {
    try {
      const newWorkout = await Workout.create(new Date().toISOString(), '');
      setWorkoutId(newWorkout.id);
      setWorkoutStarted(true);
    } catch (error) {
      Logger.log_error('Error starting workout:', error as string);
    }
  };

  const handleEndWorkout = async () => {
    try {
      await Workout.endWorkout(workoutId!, new Date().toISOString());
      resetWorkoutState();
    } catch (error) {
      Logger.log_error('Error ending workout:', error as string);
    }
  };

  const handleCancelWorkout = async () => {
    try {
      await Workout.delete(workoutId!);
      resetWorkoutState();
    } catch (error) {
      Logger.log_error('Error canceling workout:', error as string);
    }
  };

  const resetWorkoutState = () => {
    setWorkoutId(null);
    setWorkoutStarted(false);
    setBatches([]);
  };

  const handleAddSet = async (batchId: number) => {
    const batch = batches.find(b => b.id === batchId);
    const exerciseName = getExerciseNameFromExerciseString(batch!.name);

    const exerciseId = await Exercise.findIdByName(exerciseName);

    if (batch && exerciseId !== null) {
      try {
        const newSet = await Set.create(
          exerciseId,
          parseInt(batch.reps),
          parseFloat(batch.weight),
          parseFloat(batch.rpe),
          batchId
        );

        updateBatch(batchId, { sets: [...batch.sets, newSet], reps: '', weight: '', rpe: '' });
      } catch (error) {
        Logger.log_error('Error adding set:', error as string);
      }
    }
  };

  const updateBatch = (batchId: number, updatedFields: Partial<typeof batches[0]>) => {
    setBatches(batches.map(b => (b.id === batchId ? { ...b, ...updatedFields } : b)));
  };

  const handleInputChange = (batchId: number, field: string, value: string) => {
    updateBatch(batchId, { [field]: value });
  };

  const handleFinishExercise = (batchId: number) => {
    updateBatch(batchId, { sets: [], reps: '', weight: '', rpe: '' });
  };

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Workout</Text>
      </View>
      <View style={styles.popOverContainer}>
        <ExerciseDropdown
          // open,
          // setOpen,
          // selectedExercise,
          // setSelectedExercise,
          // exercises,
          // addExercise,
          open={exerciseSelectionOpen}
          setOpen={setExerciseSelectionOpen}
          selectedExercise={null}
          setSelectedExercise={null}
          exercises={exercises}
          addExercise={null}

        />
      </View>
      {!workoutStarted ? (
        <StartWorkoutButton onStartWorkout={handleStartWorkout} />
      ) : (
        <>
          <BatchList
            batches={batches}
            onAddSet={handleAddSet}
            onInputChange={handleInputChange}
            onFinishExercise={handleFinishExercise}
          />
          <View style={styles.buttonContainer}>
            <IconButton iconName="add-circle-outline" text="Exercise" onPress={ } />
          </View>
          <View style={styles.buttonContainer}>
            <IconButton iconName="close-circle-outline" text="Cancel" onPress={ } />
            <IconButton iconName="checkmark-circle-outline" text="Finish" onPress={ } />
          </View>
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
  popOverContainer: {
    padding: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 5,
    margin: 20,
  },
});
