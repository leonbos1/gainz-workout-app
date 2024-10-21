import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Exercise } from '@/models/Exercise';
import { Equipment } from '@/models/Equipment';
import { Colors } from '@/constants/Colors';

export default function ExerciseSelection() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [equipmentForExercise, setEquipmentForExercise] = useState<{ [key: string]: Equipment[] }>({});

  useEffect(() => {
    navigation.setOptions({
      title: 'Exercise Selection',
    });

    const fetchExercises = async () => {
      try {
        const exercisesData = await Exercise.findAll();
        setExercises(exercisesData);

        const equipmentPromises = exercisesData.map(async (exercise) => {
          const relevantEquipment = await Exercise.getEquipmentsForExercise(exercise.id);
          return { exerciseId: exercise.id, equipment: relevantEquipment };
        });

        const equipmentResults = await Promise.all(equipmentPromises);
        const equipmentMap: { [key: string]: Equipment[] } = {};

        equipmentResults.forEach(({ exerciseId, equipment }) => {
          equipmentMap[exerciseId] = equipment;
        });

        setEquipmentForExercise(equipmentMap);
      } catch (error) {
        console.error('Error fetching exercises or equipment:', error);
      }
    };

    fetchExercises();
  }, [navigation]);

  const handleExerciseSelect = (exercise: Exercise) => {
    navigation.navigate('EquipmentSelection', {
      selectedExercise: exercise,
      equipment: JSON.stringify(equipmentForExercise[exercise.id]),
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Exercise Selection</Text>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseItem}
            onPress={() => handleExerciseSelect(exercise)}
          >
            <Text style={styles.text}>{exercise.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  exerciseItem: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: Colors.light.text,
  },
});