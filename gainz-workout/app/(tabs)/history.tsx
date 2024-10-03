import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HistoryWorkout } from '@/components/history/HistoryWorkout';

import { Colors } from '@/constants/Colors';
import { Workout } from '@/models/Workout';
import { Batch } from '@/models/Batch';
import { Set } from '@/models/Set';
import { HistoryWorkoutViewmodel, ExerciseBatchViewmodel } from '@/viewmodels/HistoryWorkoutViewmodel';
import { useFocusEffect } from 'expo-router/build/useFocusEffect';

const screenWidth = Dimensions.get('window').width;

export default function HistoryScreen() {
  const [historyWorkoutViewmodels, setHistoryWorkoutViewmodels] = useState<HistoryWorkoutViewmodel[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchAndPrepareData();
    }, [])
  );

  const fetchAndPrepareData = async () => {
    try {
      const fetchedWorkouts = await Workout.findAllFinished(10);

      const historyWorkoutViewmodels = await Promise.all(
        fetchedWorkouts.map(async (workout) => {
          const startTime = new Date(workout.starttimeDate);
          const endTime = new Date(workout.endtimeDate);

          // Check if parsing was successful
          if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            console.error(`Invalid startTime or endTime for workout ID ${workout.id}`);
            return null; // Skip this workout or handle appropriately
          }

          const batches = await Batch.findByWorkoutId(workout.id);

          // Rest of your code remains the same
          const uniqueExercises: { [key: string]: boolean } = {};

          const exerciseBatches: ExerciseBatchViewmodel[] = (await Promise.all(
            batches.map(async (batch) => {
              const sets = await Set.findByBatchId(batch.id);

              if (sets.length === 0) {
                return {
                  batchId: batch.id,
                  sets: [],
                  bestSet: null,
                  exercisename: '',
                  numSets: 0,
                };
              }

              // Assuming all sets in a batch are for the same exercise
              const exerciseName = await sets[0].getExerciseName();

              // Skip if the exercise name is already in the object
              if (uniqueExercises[exerciseName]) {
                return null;
              }

              // Add the exercise name to the object
              uniqueExercises[exerciseName] = true;

              // Find the best set (heaviest)
              var bestSet = sets.reduce((prev, current) => {
                return (prev.weight > current.weight) ? prev : current;
              });

              const numSets = sets.length;

              return {
                batchId: batch.id,
                sets: sets,
                bestSet: bestSet,
                exercisename: exerciseName,
                numSets: numSets,
              };
            })
          )).filter(batch => batch !== null) as ExerciseBatchViewmodel[];

          // Filter out null values
          const filteredExerciseBatches = exerciseBatches.filter(batch => batch !== null);

          return {
            workoutId: workout.id,
            startTime: startTime,
            endTime: endTime,
            exerciseBatches: filteredExerciseBatches,
            title: workout.title,
            duration: (endTime.getTime() - startTime.getTime()) / 1000,
          };
        })
      );

      // Filter out null values from the historyWorkoutViewmodels array
      const filteredHistoryWorkoutViewmodels = historyWorkoutViewmodels.filter(viewmodel => viewmodel !== null);

      setHistoryWorkoutViewmodels(filteredHistoryWorkoutViewmodels);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };


  useEffect(() => {
    fetchAndPrepareData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.screenTitle}>History</ThemedText>
      </ThemedView>
      {historyWorkoutViewmodels.map((viewmodel, index) => (
        <HistoryWorkout key={index} viewmodel={viewmodel} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 40,
    backgroundColor: Colors.light.background,
    width: screenWidth,
  },
});
