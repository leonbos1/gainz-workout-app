import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';
import { Exercise } from '@/models/Exercise';
import { Equipment } from '@/models/Equipment';
import { Colors } from '@/constants/Colors';

export default function ExerciseSelection() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [equipmentForExercise, setEquipmentForExercise] = useState<{ [key: string]: Equipment[] }>({});

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: 'Exercise Selection',
    });
    const fetchExercises = async () => {
      try {
        const exercisesData = await Exercise.findAll();

        setExercises(exercisesData);

        const equipmentMap: { [key: string]: Equipment[] } = {};

        for (let exercise of exercisesData) {
          const relevantEquipment = await Exercise.getEquipmentsForExercise(exercise.id);
          equipmentMap[exercise.id] = relevantEquipment;
        }

        setEquipmentForExercise(equipmentMap);

      } catch (error) {
        console.error('Error fetching exercises or equipment:', error);
      }
    };

    fetchExercises();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {exercises.map((exercise, index) => (
          <Link
            key={index}
            to={`/EquipmentSelection?selectedExercise=${exercise.name}&equipment=${encodeURIComponent(JSON.stringify(equipmentForExercise[exercise.id]))}`}
            style={styles.exerciseItem}
          >
            <Text style={styles.text}>{exercise.name}</Text>
          </Link>
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
