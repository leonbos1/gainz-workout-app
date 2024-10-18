import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { Exercise } from '@/models/Exercise';
import { Workout } from '@/models/Workout';
import { Set } from '@/models/Set';
import { Batch } from '@/models/Batch';
import { StartWorkoutButton } from '@/components/workout/StartWorkoutButton';
import { BatchList } from '@/components/workout/BatchList';
import { EndWorkoutButton } from '@/components/workout/EndWorkoutButton';
import { Colors } from '@/constants/Colors';
import { Timer } from '@/components/Timer';
import { Link } from 'expo-router';
import IconButton from '@/components/IconButton';

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
  const timerRef = useRef<{ resetTimer: () => void } | null>(null);

  useEffect(() => {
    if (route.params && workoutStarted) {
      handleAddExercise();
    }
  }, [route.params, workoutStarted]);

  useFocusEffect(
    useCallback(() => {
      fetchExercises();
    }, [])
  );

  const fetchExercises = async () => {
    try {
      const fetchedExercises = await Exercise.findAll();
      setExercises(fetchedExercises.map(exercise => ({
        label: exercise.name,
        value: exercise.name,
      })));
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

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
        setBatches(prevBatches => [
          ...prevBatches,
          {
            id: newBatch.id,
            name: `${exercise} (${equipment}${attachment ? ` - ${attachment}` : ''})`,
            sets: [],
            reps: '',
            weight: '',
            rpe: '',
          }
        ]);
      } catch (error) {
        console.error('Error adding batch:', error);
      }
    }
  };

  const handleEndWorkout = async () => {
    try {
      await Workout.endWorkout(workoutId!, new Date().toISOString());
      resetWorkoutState();
    } catch (error) {
      console.error('Error ending workout:', error);
    }
  };

  const handleCancelWorkout = async () => {
    try {
      await Workout.delete(workoutId!);
      resetWorkoutState();
    } catch (error) {
      console.error('Error canceling workout:', error);
    }
  };

  const resetWorkoutState = () => {
    setWorkoutId(null);
    setWorkoutStarted(false);
    setBatches([]);
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

        updateBatch(batchId, { sets: [...batch.sets, newSet], reps: '', weight: '', rpe: '' });
      } catch (error) {
        console.error('Error adding set:', error);
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
          <View style={styles.buttonContainer}>
            <Link href="/ExerciseSelection" asChild>
              <IconButton iconName="add-circle-outline" text="Exercise" />
            </Link>
          </View>
          <View style={styles.buttonContainer}>
            <IconButton iconName="close-circle-outline" text="Cancel" onPress={handleCancelWorkout} />
            <IconButton iconName="checkmark-circle-outline" text="Finish" onPress={handleEndWorkout} />
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
});
