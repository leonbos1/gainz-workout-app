import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, FlatList } from 'react-native';

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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchAndPrepareData(page);
    }, [page])
  );

  const fetchAndPrepareData = async (page: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const fetchedWorkouts = await Workout.findAllFinished(10, page);

      if (fetchedWorkouts.length === 0) {
        setHasMore(false);
        return;
      }

      const newHistoryWorkoutViewmodels = await Promise.all(
        fetchedWorkouts.map(async (workout) => {
          const startTime = new Date(workout.starttimeDate);
          const endTime = new Date(workout.endtimeDate);

          if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            console.error(`Invalid startTime or endTime for workout ID ${workout.id}`);
            return null;
          }

          const batches = await Batch.findByWorkoutId(workout.id);
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

              const exerciseName = await sets[0].getExerciseName();
              if (uniqueExercises[exerciseName]) {
                return null;
              }

              uniqueExercises[exerciseName] = true;

              const bestSet = sets.reduce(
                (maxSet, set) => (set.weight > maxSet.weight ? set : maxSet),
                sets[0]
              );

              return {
                batchId: batch.id,
                sets: sets,
                bestSet: bestSet,
                exercisename: exerciseName,
                numSets: sets.length,
              };
            })
          )).filter(batch => batch !== null) as ExerciseBatchViewmodel[];

          return {
            workoutId: workout.id,
            startTime: startTime,
            endTime: endTime,
            exerciseBatches: exerciseBatches,
            title: workout.title,
            duration: (endTime.getTime() - startTime.getTime()) / 1000,
          };
        })
      );

      const filteredNewHistoryWorkoutViewmodels = newHistoryWorkoutViewmodels.filter(viewmodel => viewmodel !== null);
      setHistoryWorkoutViewmodels(prev => [...prev, ...filteredNewHistoryWorkoutViewmodels]);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = (workoutId: number) => {
    setHistoryWorkoutViewmodels(prevViewmodels =>
      prevViewmodels.filter(viewmodel => viewmodel.workoutId !== workoutId)
    );
  };

  const loadMoreData = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchAndPrepareData(page);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={historyWorkoutViewmodels}
        keyExtractor={(item, index) => item.workoutId.toString() + index}
        renderItem={({ item }) => <HistoryWorkout viewmodel={item} onDelete={handleDeleteWorkout} />}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.screenTitle}>History</ThemedText>
          </ThemedView>
        }
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
      />
    </View>
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
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  }
});