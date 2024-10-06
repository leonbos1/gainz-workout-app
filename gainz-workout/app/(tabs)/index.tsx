// app/index.js (ProfileScreen)
import React, { useState, useCallback } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Chart, ChartDataset } from '@/components/profile/Chart';
import { WorkoutBarChart } from '@/components/profile/WorkoutBarChart';
import { Colors } from '@/constants/Colors';
import { Workout, WorkoutWeekData } from '@/models/Workout';
import { useFocusEffect } from '@react-navigation/native';
import { Set } from '@/models/Set';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';

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
        const benchPressSets = await Set.getEstimated1RM('Bench Press', 100);
        setEstimatedBenchPress1RM(benchPressSets);
      }

      async function fetchSquat1RM() {
        const squatSets = await Set.getEstimated1RM('Squat', 100);
        setEstimatedSquat1RM(squatSets);
      }

      fetchWorkoutData();
      fetchBenchPress1RM();
      fetchSquat1RM();
      return () => { };
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.screenTitle}>Profile</ThemedText>
        <TouchableOpacity>
          <Link href="./Settings">
            <Ionicons name="settings-outline" size={25} color={Colors.light.text} style={{ marginLeft: 15 }} />
          </Link>
        </TouchableOpacity>
      </ThemedView>

      {workoutData && <WorkoutBarChart workoutWeekData={workoutData} />}
      {estimatedBenchPress1RM && <Chart data={estimatedBenchPress1RM} title="Estimated Bench Press 1RM" />}
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
    backgroundColor: Colors.light.background,
  },
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: Colors.light.background,
  },
});
