import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Text, TouchableOpacity } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>1RM Calculator (Weight, Reps & RPE)</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter weight"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholderTextColor={Colors.text}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Reps</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reps"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
          placeholderTextColor={Colors.text}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>RPE</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter RPE (6-10)"
          keyboardType="numeric"
          value={rpe}
          onChangeText={setRpe}
          placeholderTextColor={Colors.text}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculate1RM}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      <Text style={styles.result}>
        Estimated 1RM: <Text style={styles.resultValue}>{estimated1RM.toFixed(2)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: Colors.background,
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
    color: Colors.text,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.text,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  button: {
    backgroundColor: Colors.textButton,
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
    color: Colors.text,
    textAlign: 'center',
  },
  resultValue: {
    fontWeight: 'bold',
    fontSize: 24,
    color: Colors.text,
  },
});
