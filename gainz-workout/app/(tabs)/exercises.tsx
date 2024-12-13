import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, View, Text, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/models/Exercise';
import { MuscleGroup } from '@/models/MuscleGroup';
import BigIconButton from '@/components/buttons/BigIconButton';
import AddExerciseMenu from '@/components/exercises/AddExerciseMenu';
import { Equipment } from '@/models/Equipment';
import ExerciseItem from '@/components/exercises/ExerciseItem';

const screenWidth = Dimensions.get('window').width;

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDescription, setNewExerciseDescription] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<any[]>([]); // Adjust type as needed

  const fetchExercises = async () => {
    try {
      const fetchedExercises = await Exercise.findAll();
      const remainingExercises = fetchedExercises.sort((a, b) => a.name.localeCompare(b.name));
      setExercises([...remainingExercises]);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleCloseExercise = () => {
    setIsAddMode(false);
    setNewExerciseName('');
    setNewExerciseDescription('');
    setSelectedMuscleGroup(null);
    setSelectedEquipment([]);
  };

  const handleAddExercise = async () => {
    console.log('Adding exercise:', newExerciseName, newExerciseDescription, selectedMuscleGroup, selectedEquipment);

    if (newExerciseName && selectedMuscleGroup && selectedEquipment.length) {
      try {
        await Exercise.create(newExerciseName, newExerciseDescription, selectedMuscleGroup.id);
        selectedEquipment.forEach(async (equipment) => {
          await Equipment.create(equipment.name);
          fetchExercises();
          handleCloseExercise();
        });
      } catch (error) {
        console.error('Error adding exercise:', error);
      }
    }
  };

  const handleOnDelete = async (exercise: Exercise) => {
    try {
      await Exercise.delete(exercise.id);
      fetchExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleOnEdit = async (exercise: Exercise) => {
    console.log('Editing exercise:', exercise);
  };

  const handleOnDetails = async (exercise: Exercise) => {
    console.log('Viewing details for exercise:', exercise);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Exercises</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <BigIconButton iconName="add-circle" text="Add" onPress={() => setIsAddMode(true)} />
      </View>
      <ScrollView>
        {exercises.map((exercise, index) => (
          <ExerciseItem key={index} exercise={exercise} onEdit={handleOnEdit} onDelete={handleOnDelete} onDetails={handleOnDetails}
          />
        ))}
      </ScrollView>

      <AddExerciseMenu
        isAddMode={isAddMode}
        setIsAddMode={setIsAddMode}
        newExerciseName={newExerciseName}
        setNewExerciseName={setNewExerciseName}
        newExerciseDescription={newExerciseDescription}
        setNewExerciseDescription={setNewExerciseDescription}
        selectedMuscleGroup={selectedMuscleGroup}
        setSelectedMuscleGroup={setSelectedMuscleGroup}
        selectedEquipment={selectedEquipment}
        setSelectedEquipment={setSelectedEquipment}
        handleAddExercise={handleAddExercise}
        handleCloseExercise={handleCloseExercise}
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
    color: Colors.light.text,
  },
});
