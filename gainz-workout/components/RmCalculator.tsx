import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from './ThemedView';
import { Colors } from '@/constants/Colors';

export function RmCalculator() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [estimated1RM, setEstimated1RM] = useState(0);

  useEffect(() => {
    const weightNum = parseFloat(weight);
    const repsNum = parseFloat(reps);

    if (!isNaN(weightNum) && !isNaN(repsNum) && repsNum > 0) {
      const oneRepMax = weightNum * (1 + repsNum / 30);
      setEstimated1RM(oneRepMax);
    } else {
      setEstimated1RM(0);
    }
  }, [weight, reps]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>RM Calculator</ThemedText>
      
      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Weight</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter weight"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Reps</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter reps"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
        />
      </View>
      
      <ThemedText style={styles.result}>
        Estimated 1RM: <ThemedText style={styles.resultValue}>{estimated1RM.toFixed(2)}</ThemedText>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.light.text,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.light.text,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: Colors.light.text,
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    color: Colors.light.text,
  },
  resultValue: {
    fontWeight: 'bold',
    color: Colors.light.text,
  },
});