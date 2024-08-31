import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HistoryWorkout } from '@/components/history/HistoryWorkout';

import { Colors } from '@/constants/Colors';
import { Workout } from '@/models/Workout';
import { Batch } from '@/models/Batch';
import { Set } from '@/models/Set';
import { HistoryWorkoutViewmodel } from '@/viewmodels/HistoryWorkoutViewmodel';
import { useFocusEffect } from 'expo-router/build/useFocusEffect';

const screenWidth = Dimensions.get('window').width;

export default function HistoryScreen() {
  const [historyWorkoutViewmodels, setHistoryWorkoutViewmodels] = useState<HistoryWorkoutViewmodel[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchAndPrepareData();
    }, [])
  );

  async function fetchExerciseNames(sets: Set[]) {
    const promises = sets.map(async (set) => {
      return await set.getExerciseName();
    });

    await Promise.all(promises);
  }

  const fetchAndPrepareData = async () => {
    try {
      const fetchedWorkouts = await Workout.findAllFinished();

      const historyWorkoutViewmodels = await Promise.all(
        fetchedWorkouts.map(async (workout) => {
          const batches = await Batch.findByWorkoutId(workout.id);
          const heaviestSets = await Promise.all(
            batches.map(async (batch) => {
              const sets = await Set.findByBatchId(batch.id);
              await fetchExerciseNames(sets);

              const heaviestSet = sets.reduce((maxSet, set) => (set.weight > maxSet.weight ? set : maxSet), sets[0]);
              return heaviestSet;
            })
          );

          const exerciseBatches = await Promise.all(
            heaviestSets.map(async (set) => {
              const exerciseName = await set.getExerciseName();
              return { batchId: set.batchid, sets: [set], exercisename: exerciseName };
            })
          );

          return new HistoryWorkoutViewmodel(
            exerciseBatches,
            workout.title,
            workout.starttimeDate.getTime() - workout.endtimeDate.getTime(),
            workout.starttimeDate
          );
        })
      );

      setHistoryWorkoutViewmodels(historyWorkoutViewmodels);
    } catch (error) {
      console.error('Error fetching and preparing data:', error);
    }
  };

  useEffect(() => {
    fetchAndPrepareData();
  }, []);

  return (
    <View style={styles.contentContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.screenTitle}>History</ThemedText>
      </ThemedView>
      <ScrollView>
        {historyWorkoutViewmodels.map((viewmodel, index) => (
          <HistoryWorkout key={index} viewmodel={viewmodel} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 40,
    backgroundColor: Colors.light.background,
    width: screenWidth,
    height: '100%',
  },
});
