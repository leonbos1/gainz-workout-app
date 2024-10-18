import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, View, Button, TextInput, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

import { Colors } from '@/constants/Colors';
import { Exercise } from '@/models/Exercise';
import { MuscleGroup } from '@/models/MuscleGroup';
import BigIconButton from '@/components/BigIconButton';
import IconButton from '@/components/IconButton';
import MusclegroupSelectList from '@/components/selectors/MusclegroupSelectList';
import EquipmentMultipleSelectList from '@/components/selectors/EquipmentMultipleSelectList';
import { Attachment } from '@/models/Attachment';
import { Equipment } from '@/models/Equipment';

const screenWidth = Dimensions.get('window').width;

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDescription, setNewExerciseDescription] = useState('');
  const [muscleGroups, setMuscleGroups] = useState<Array<{ label: string, value: number }>>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [open, setOpen] = useState(false);

  const fetchExercises = async () => {
    try {
      const fetchedExercises = await Exercise.findAll();

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

  const handleCloseExecise = () => {
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
          setIsAddMode(false);
          setNewExerciseName('');
          setNewExerciseDescription('');
          setSelectedMuscleGroup(null);
          setSelectedEquipment([]);
        });
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
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Exercises</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <BigIconButton iconName="add-circle" text="Add" onPress={() => setIsAddMode(true)} />
      </View>
      <ScrollView>
        {exercises.map((exercise, index) => (
          <Text key={index} style={styles.exerciseItem}>{exercise.name}</Text>
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
          <MusclegroupSelectList onMuscleGroupSelected={setSelectedMuscleGroup} />
          <EquipmentMultipleSelectList onEquipmentSelected={setSelectedEquipment} />
          <View style={styles.buttonContainer}>
            <IconButton iconName="ban" text="Close" onPress={handleCloseExecise} />
            <IconButton iconName="add-circle" text="Exercise" onPress={handleAddExercise} />
          </View>
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
    color: Colors.light.text,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
