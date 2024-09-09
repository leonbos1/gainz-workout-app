import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, View, Button, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { Colors } from '@/constants/Colors';
import { Exercise } from '@/models/Exercise';
import { MuscleGroup } from '@/models/MuscleGroup';

const screenWidth = Dimensions.get('window').width;

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDescription, setNewExerciseDescription] = useState('');
  const [muscleGroups, setMuscleGroups] = useState<Array<{ label: string, value: number }>>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const fetchExercises = async () => {
    try {
      // Fetch exercises and sort them
      const fetchedExercises = await Exercise.findAll();
      // const recentExercises = await Exercise.findRecent(10);

      const remainingExercises = fetchedExercises.sort((a, b) => a.name.localeCompare(b.name));
      
      setExercises([...remainingExercises]);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const fetchMuscleGroups = async () => {
    try {
      const fetchedMuscleGroups = await MuscleGroup.findAll();
      const formattedGroups = fetchedMuscleGroups.map(group => ({
        label: group.name,
        value: group.id,
      }));
      setMuscleGroups(formattedGroups);
    } catch (error) {
      console.error('Error fetching muscle groups:', error);
    }
  };

  const handleAddExercise = async () => {
    if (newExerciseName && selectedMuscleGroup) {
      try {
        await Exercise.create(newExerciseName, newExerciseDescription, selectedMuscleGroup);
        fetchExercises();
        setIsAddMode(false); 
        setNewExerciseName('');
        setNewExerciseDescription('');
        setSelectedMuscleGroup(null);
      } catch (error) {
        console.error('Error adding exercise:', error);
      }
    }
  };

  useEffect(() => {
    fetchExercises();
    fetchMuscleGroups();
  }, []);

  return (
    <View style={styles.contentContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.screenTitle}>Exercises</ThemedText>
        <FontAwesome
          name="plus-circle"
          size={24}
          color={Colors.light.tint}
          onPress={() => setIsAddMode(true)}
        />
      </ThemedView>
      <ScrollView>
        {exercises.map((exercise, index) => (
          <ThemedText key={index} style={styles.exerciseItem}>{exercise.name}</ThemedText>
        ))}
      </ScrollView>

      {isAddMode && (
        <View style={styles.addExerciseContainer}>
          <TextInput
            style={styles.input}
            placeholder="Exercise Name"
            value={newExerciseName}
            onChangeText={setNewExerciseName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newExerciseDescription}
            onChangeText={setNewExerciseDescription}
          />
          <DropDownPicker
            open={open}
            value={selectedMuscleGroup}
            items={muscleGroups}
            setOpen={setOpen}
            setValue={setSelectedMuscleGroup}
            setItems={setMuscleGroups}
            placeholder="Select Muscle Group"
          />
          <Button title="Add Exercise" onPress={handleAddExercise} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  exerciseItem: {
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  addExerciseContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    fontSize: 16,
  },
});
