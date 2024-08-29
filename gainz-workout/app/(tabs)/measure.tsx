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

export default function MeasureScreen() {
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

  const handleAddDumbbellPress = async () => {
    await Exercise.create('Dumbbell Press', 'The pressing of the chest', 1);
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
