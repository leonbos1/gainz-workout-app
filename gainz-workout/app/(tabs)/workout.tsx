import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, ScrollView, Button } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { Batch } from '@/models/Batch';
import { Set } from '@/models/Set';
import { Workout } from '@/models/Workout';
import { Exercise } from '@/models/Exercise';
import { MuscleGroup } from '@/models/MuscleGroup';

import { dropTables, createTables } from '@/database/database';

export default function ProfileScreen() {
  const handleClearBatches = () => {
    Batch.removeAll();
  }

  const handleClearSets = () => {
    Set.removeAll();
  }

  const handleClearWorkouts = () => {
    Workout.removeAll();
  }

  const handleClearExercises = () => {
    Exercise.removeAll();
  }

  const handleClearAll = async () => {
    await Batch.removeAll();
    await Set.removeAll();
    await Workout.removeAll();
    await Exercise.removeAll
  }

  const handleDropTables = async () => {
    await dropTables();
  }

  const insertDummyData = async () => {
    const workout = await Workout.create('2021-09-01T12:00:00', '2021-09-01T13:00:00');

    const batch1 = await Batch.create(workout.id, 'sample note');
    const chest = await MuscleGroup.create('Chest');
    const benchPress = await Exercise.create('Bench Press', 'The pressing of the chest', chest.id);
    const set1 = await Set.create(benchPress.id, 5, 100, 9, batch1.id);
    const set2 = await Set.create(benchPress.id, 5, 105, 9, batch1.id);
    const set3 = await Set.create(benchPress.id, 5, 110, 9, batch1.id);

    const batch2 = await Batch.create(workout.id, 'sample note');
    const legs = await MuscleGroup.create('Legs');
    const squat = await Exercise.create('Squat', 'The squatting of the legs', legs.id);
    const set4 = await Set.create(squat.id, 5, 100, 9, batch2.id);
    const set5 = await Set.create(squat.id, 5, 105, 9, batch2.id);
    const set6 = await Set.create(squat.id, 5, 110, 9, batch2.id);
  }


  return (
    <ScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Workout</ThemedText>
        <Ionicons name="person-circle" size={24} style={styles.headerImage} />
      </ThemedView>
      <Button title="Clear batches" onPress={handleClearBatches} />
      <Button title="Clear sets" onPress={handleClearSets} />
      <Button title="Clear workouts" onPress={handleClearWorkouts} />
      <Button title="Clear exercises" onPress={handleClearExercises} />
      <Button title="Clear all" onPress={handleClearAll} />
      <Button title="Insert dummy data" onPress={insertDummyData} />
      <Button title="Drop tables" onPress={handleDropTables} color={'red'} />
      <Button title="Create tables" onPress={createTables} />
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
    gap: 8,
  },
});
