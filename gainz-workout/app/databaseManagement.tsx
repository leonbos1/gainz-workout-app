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

export default function DatabaseManagementScreen() {
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
    await Exercise.removeAll();
    await MuscleGroup.removeAll();
  }

  const handleDropTables = async () => {
    await dropTables();
  }

  const handleAddDumbbellPress = async () => {
    await Exercise.create('Dumbbell Press', 'The pressing of the chest', 1);
  }

  const insertExercises = async () => {
    await MuscleGroup.create('Chest');
    await MuscleGroup.create('Legs');
    await MuscleGroup.create('Back');
    await MuscleGroup.create('Shoulders');
    await MuscleGroup.create('Arms');
    await Exercise.create('Bench Press', 'The pressing of the chest', 1);
    await Exercise.create('Squat', 'The squatting of the legs', 2);
    await Exercise.create('Deadlift', 'The lifting of the back', 3);
    await Exercise.create('Shoulder Press', 'The pressing of the shoulders', 4);
    await Exercise.create('Bicep Curl', 'The curling of the biceps', 5);
  }

  const insertDummyData = async () => {
    const workout1 = await Workout.create('2021-09-01T12:00:00', '2021-09-01T13:00:00');

    const batch1 = await Batch.create(workout1.id, 'sample note');
    const chest = await MuscleGroup.create('Chest');
    const benchPress = await Exercise.create('Bench Press', 'The pressing of the chest', chest.id);
    const set1 = await Set.create(benchPress.id, 5, 100, 9, batch1.id);
    const set2 = await Set.create(benchPress.id, 5, 105, 9, batch1.id);
    const set3 = await Set.create(benchPress.id, 5, 110, 9, batch1.id);

    const batch2 = await Batch.create(workout1.id, 'sample note');
    const legs = await MuscleGroup.create('Legs');
    const squat = await Exercise.create('Squat', 'The squatting of the legs', legs.id);
    const set4 = await Set.create(squat.id, 5, 100, 9, batch2.id);
    const set5 = await Set.create(squat.id, 5, 105, 9, batch2.id);
    const set6 = await Set.create(squat.id, 5, 110, 9, batch2.id);

    const workout2 = await Workout.create('2021-09-02T12:00:00', '2021-09-02T13:00:00');

    const batch3 = await Batch.create(workout2.id, 'sample note');
    const back = await MuscleGroup.create('Back');
    const deadlift = await Exercise.create('Deadlift', 'The lifting of the back', back.id);
    const set7 = await Set.create(deadlift.id, 5, 100, 9, batch3.id);
    const set8 = await Set.create(deadlift.id, 5, 105, 9, batch3.id);
    const set9 = await Set.create(deadlift.id, 5, 110, 9, batch3.id);

    const batch4 = await Batch.create(workout2.id, 'sample note');
    const shoulders = await MuscleGroup.create('Shoulders');
    const shoulderPress = await Exercise.create('Shoulder Press', 'The pressing of the shoulders', shoulders.id);
    const set10 = await Set.create(shoulderPress.id, 5, 100, 9, batch4.id);
    const set11 = await Set.create(shoulderPress.id, 5, 105, 9, batch4.id);
    const set12 = await Set.create(shoulderPress.id, 5, 110, 9, batch4.id);

    const batch5 = await Batch.create(workout2.id, 'sample note');
    const arms = await MuscleGroup.create('Arms');
    const bicepCurl = await Exercise.create('Bicep Curl', 'The curling of the biceps', arms.id);
    const set13 = await Set.create(bicepCurl.id, 5, 100, 9, batch5.id);
    const set14 = await Set.create(bicepCurl.id, 5, 105, 9, batch5.id);
    const set15 = await Set.create(bicepCurl.id, 5, 110, 9, batch5.id);
  }

  const insertWorkouts = async () => {
    const currentWeek = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(currentWeek.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(currentWeek.getDate() - 14);
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(currentWeek.getDate() - 21);
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(currentWeek.getDate() - 28);
    const fiveWeeksAgo = new Date();
    fiveWeeksAgo.setDate(currentWeek.getDate() - 35);
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(currentWeek.getDate() - 42);
    const sevenWeeksAgo = new Date();
    sevenWeeksAgo.setDate(currentWeek.getDate() - 49);
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(currentWeek.getDate() - 56);
    const nineWeeksAgo = new Date();
    nineWeeksAgo.setDate(currentWeek.getDate() - 63);
    const tenWeeksAgo = new Date();
    tenWeeksAgo.setDate(currentWeek.getDate() - 70);
    const elevenWeeksAgo = new Date();
    elevenWeeksAgo.setDate(currentWeek.getDate() - 77);
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(currentWeek.getDate() - 84);

    const workout1 = await Workout.create(currentWeek.toISOString(), currentWeek.toISOString());
    const workout2 = await Workout.create(lastWeek.toISOString(), lastWeek.toISOString());
    const workout3 = await Workout.create(twoWeeksAgo.toISOString(), twoWeeksAgo.toISOString());
    const workout4 = await Workout.create(threeWeeksAgo.toISOString(), threeWeeksAgo.toISOString());
    const workout5 = await Workout.create(fourWeeksAgo.toISOString(), fourWeeksAgo.toISOString());
    const workout6 = await Workout.create(fiveWeeksAgo.toISOString(), fiveWeeksAgo.toISOString());
    const workout7 = await Workout.create(sixWeeksAgo.toISOString(), sixWeeksAgo.toISOString());
    const workout8 = await Workout.create(sevenWeeksAgo.toISOString(), sevenWeeksAgo.toISOString());
    const workout9 = await Workout.create(eightWeeksAgo.toISOString(), eightWeeksAgo.toISOString());
    const workout10 = await Workout.create(nineWeeksAgo.toISOString(), nineWeeksAgo.toISOString());
    const workout11 = await Workout.create(tenWeeksAgo.toISOString(), tenWeeksAgo.toISOString());
    const workout12 = await Workout.create(elevenWeeksAgo.toISOString(), elevenWeeksAgo.toISOString());
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
      <Button title="Add Dumbbell Press" onPress={handleAddDumbbellPress} />
      <Button title="Insert exercises" onPress={insertExercises} />
      <Button title="Insert workouts" onPress={insertWorkouts} />
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
