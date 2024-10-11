import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from '@react-navigation/native';
import { Exercise } from '@/models/Exercise';
import { Colors } from '@/constants/Colors';

export default function ExerciseSelection() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await Exercise.findAll();
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Exercise Selection</Text>
        {exercises.map((exercise, index) => (
          <Link
            key={index}
            to={`/EquipmentSelection?selectedExercise=${encodeURIComponent(JSON.stringify(exercise))}`}
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
