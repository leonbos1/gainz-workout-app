import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HistoryWorkout } from '@/components/HistoryWorkout';

import { Colors } from '@/constants/Colors';
import { Workout } from '@/models/Workout';
import { Batch } from '@/models/Batch';
import { Set } from '@/models/Set';

const screenWidth = Dimensions.get('window').width;

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<Array<{ workout: Workout; heaviestSets: Set[] }>>([]);

  useEffect(() => {
    const fetchWorkoutsData = async () => {
      try {
        const fetchedWorkouts = await Workout.findAll();

        console.log('fetchedWorkouts', fetchedWorkouts);

        const workoutsWithHeaviestSets = await Promise.all(
          fetchedWorkouts.map(async (workout) => {
            const batches = await Batch.findByWorkoutId(workout.id);

            console.log('batches', batches);

            const heaviestSets = await Promise.all(
              batches.map(async (batch) => {
                const sets = await Set.findByBatchId(batch.id);
                const heaviestSet = sets.reduce((maxSet, set) => (set.weight > maxSet.weight ? set : maxSet), sets[0]);
                return heaviestSet;
              })
            );

            return { workout, heaviestSets };
          })
        );

        setWorkouts(workoutsWithHeaviestSets);
      } catch (error) {
      }
    };

    fetchWorkoutsData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.screenTitle}>History</ThemedText>
      </ThemedView>
      {workouts.map(({ workout, heaviestSets }) => (
        <HistoryWorkout
          key={workout.id}
          sets={heaviestSets}
          date={new Date(workout.starttime)}
          title={`Workout on ${new Date(workout.starttime).toLocaleDateString()}`}
          durationSeconds={workout.endtimeDate.getTime() - workout.starttimeDate.getTime()}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
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
