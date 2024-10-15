import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { Exercise } from '@/models/Exercise';
import { Workout } from '@/models/Workout';
import { Set } from '@/models/Set';
import { Batch } from '@/models/Batch';
import { StartWorkoutButton } from '@/components/workout/StartWorkoutButton';
import { BatchList } from '@/components/workout/BatchList';
import { EndWorkoutButton } from '@/components/workout/EndWorkoutButton';
import { Colors } from '@/constants/Colors';
import DangerTextButton from '@/components/DangerTextButton';
import { Timer } from '@/components/Timer';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

interface RouteParams {
  exercise: string;
  equipment: string;
  attachment: string;
}

type WorkoutScreenRouteProp = RouteProp<{ params: RouteParams }, 'params'>;

export default function WorkoutScreen() {
  const route = useRoute<WorkoutScreenRouteProp>();
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [batches, setBatches] = useState<Array<{ id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string }>>([]);
  const [exercises, setExercises] = useState<Array<{ label: string, value: string }>>([]);
  const timerRef = React.useRef<{ resetTimer: () => void } | null>(null);

  const handleReset = () => {
    if (timerRef.current) {
      timerRef.current.resetTimer();
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
    }, [])
  );

  useEffect(() => {
    if (route.params && workoutStarted) {
      handleAddExercise();
    }
  }, [route.params, workoutStarted]);

  const handleStartWorkout = async () => {
    try {
      const newWorkout = await Workout.create(new Date().toISOString(), '');
      setWorkoutId(newWorkout.id);
      setWorkoutStarted(true);
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const handleAddExercise = async () => {
    if (route.params && workoutId) {
      const { exercise, equipment, attachment } = route.params;
      try {
        const newBatch = await Batch.create(workoutId, '', 1, 1); // Adjust as needed
        const updatedBatch = {
          id: newBatch.id,
          name: `${exercise} (${equipment}${attachment ? ` - ${attachment}` : ''})`,
          sets: [],
          reps: '',
          weight: '',
          rpe: '',
        };
        setBatches([...batches, updatedBatch]);
      } catch (error) {
        console.error('Error adding batch:', error);
      }
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
  };

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
    setBatches(batches.map(batch => {
      if (batch.id === batchId) {
        return { ...batch, sets: [], reps: '', weight: '', rpe: '' };
      }
      return batch;
    }));
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
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity>
              <Link href="/ExerciseSelection">
                <Ionicons name="settings-outline" size={25} color={Colors.light.text} style={{ marginLeft: 15 }} />
              </Link>
            </TouchableOpacity>
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
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
});