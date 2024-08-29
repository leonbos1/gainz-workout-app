import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Chart, ChartDataset } from '@/components/profile/Chart';
import { WorkoutBarChart } from '@/components/profile/WorkoutBarChart';
import { Colors } from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width;

export default function ProfileScreen() {
  const workoutData = {
    title: 'Workouts Per Week',
    labels: ['7/15', '7/22', '7/29', '8/5', '8/12', '8/19', '8/26'],
    datasets: [
      {
        data: [3, 3, 4, 3, 5, 3, 2],
      },
    ],
  };

  const benchPressData = new ChartDataset(
    [100, 100, 105, 110, 115, 120, 125, 130, 135],
    ['7/8', '7/15', '7/22', '7/29', '8/5', '8/12', '8/19', '8/26', '9/2'],
    2,
    'Bench Press'
  );

  const squatData = new ChartDataset(
    [150, 155, 160, 165, 170, 175, 180, 185, 190],
    ['7/8', '7/15', '7/22', '7/29', '8/5', '8/12', '8/19', '8/26', '9/2'],
    2,
    'Squat'
  );

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.screenTitle}>Profile</ThemedText>
      </ThemedView>

      <WorkoutBarChart data={workoutData} />
      <Chart data={benchPressData} title="Estimated Bench Press 1RM" />
      <Chart data={squatData} title="Estimated Squat 1RM" />
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
