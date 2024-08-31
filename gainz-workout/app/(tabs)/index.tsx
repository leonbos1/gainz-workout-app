import React, { useState, useCallback } from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Chart, ChartDataset } from '@/components/profile/Chart';
import { WorkoutBarChart } from '@/components/profile/WorkoutBarChart';
import { Colors } from '@/constants/Colors';
import { Workout, WorkoutWeekData } from '@/models/Workout';
import { useFocusEffect } from '@react-navigation/native';
import { Set } from '@/models/Set';

const screenWidth = Dimensions.get('window').width;

export default function ProfileScreen() {
  const [workoutData, setWorkoutData] = useState<WorkoutWeekData | null>(null);
  const [estimatedBenchPress1RM, setEstimatedBenchPress1RM] = useState<ChartDataset | null>(null);
  const [estimatedSquat1RM, setEstimatedSquat1RM] = useState<ChartDataset | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function fetchWorkoutData() {
        const data = await Workout.getWorkoutsPerWeek(8);
        setWorkoutData(data);
      }

      async function fetchBenchPress1RM() {
        const benchPressSets = await Set.getEstimated1RM(1);
        setEstimatedBenchPress1RM(benchPressSets);
      }

      async function fetchSquat1RM() {
        const squatSets = await Set.getEstimated1RM(2);
        setEstimatedSquat1RM(squatSets);
      }

      fetchWorkoutData();
      fetchBenchPress1RM();
      fetchSquat1RM();
      return () => {
      };
    }, [])
  );

  // const benchPressData = new ChartDataset(
  //   [100, 100, 105, 110, 115, 120, 125, 130, 135],
  //   ['7/8', '7/15', '7/22', '7/29', '8/5', '8/12', '8/19', '8/26', '9/2'],
  //   'Bench Press'
  // );

  // const squatData = new ChartDataset(
  //   [150, 155, 160, 165, 170, 175, 180, 185, 190],
  //   ['7/8', '7/15', '7/22', '7/29', '8/5', '8/12', '8/19', '8/26', '9/2'],
  //   'Squat'
  // );

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.screenTitle}>Profile</ThemedText>
      </ThemedView>

      {workoutData && <WorkoutBarChart workoutWeekData={workoutData} />}
      {/* <Chart data={benchPressData} title="Estimated Bench Press 1RM" /> */}
      {estimatedBenchPress1RM && <Chart data={estimatedBenchPress1RM} title="Estimated Bench Press 1RM" />}
      {/* <Chart data={squatData} title="Estimated Squat 1RM" /> */}
      {estimatedSquat1RM && <Chart data={estimatedSquat1RM} title="Estimated Squat 1RM" />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
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
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 40,
    backgroundColor: Colors.light.background,
    width: screenWidth,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
});
