import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from './ThemedView';
import { Colors } from '@/constants/Colors';

export function RpeCalculator() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [estimated1RM, setEstimated1RM] = useState(0);

  const calculate1RM = () => {
    const weightNum = parseFloat(weight);
    const repsNum = parseFloat(reps);
    const rpeNum = parseFloat(rpe);

    if (!isNaN(weightNum) && !isNaN(repsNum) && !isNaN(rpeNum) && repsNum > 0 && rpeNum >= 6 && rpeNum <= 10) {
      // Adjust reps for RPE using a commonly used correction factor
      const adjustedReps = repsNum + (10 - rpeNum);
      // The formula: 1RM = weight / (1.0278 - 0.0278 * adjustedReps)
      const oneRepMax = weightNum / (1.0278 - 0.0278 * adjustedReps);
      setEstimated1RM(oneRepMax);
    } else {
      setEstimated1RM(0);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>1RM Calculator (Weight, Reps & RPE)</ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Weight</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter weight"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholderTextColor={Colors.light.text}
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
          placeholderTextColor={Colors.light.text}
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>RPE</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Enter RPE (6-10)"
          keyboardType="numeric"
          value={rpe}
          onChangeText={setRpe}
          placeholderTextColor={Colors.light.text}
        />
      </View>

      <Button title="Calculate" onPress={calculate1RM} />

      <ThemedText style={styles.result}>
        Estimated 1RM: <ThemedText style={styles.resultValue}>{estimated1RM.toFixed(2)}</ThemedText>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: Colors.light.text,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.light.text,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  button: {
    backgroundColor: Colors.light.textButton,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  result: {
    fontSize: 20,
    marginTop: 30,
    color: Colors.light.text,
    textAlign: 'center',
  },
  resultValue: {
    fontWeight: 'bold',
    fontSize: 24,
    color: Colors.light.text,
  },
});