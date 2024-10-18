import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text, ScrollView, Button } from 'react-native';

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

  return (
    <ScrollView>
      <View style={styles.titleContainer}>
        <Text>Workout</Text>
        <Ionicons name="person-circle" size={24} style={styles.headerImage} />
      </View>
      <Button title="Drop tables" onPress={handleDropTables} color={'red'} />
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
