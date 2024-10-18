import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Text, Button } from 'react-native';
import { Colors } from '@/constants/Colors';

export function RmCalculator() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [estimated1RM, setEstimated1RM] = useState(0);

  const calculate1RM = () => {
    const weightNum = parseFloat(weight);
    const repsNum = parseFloat(reps);

    if (!isNaN(weightNum) && !isNaN(repsNum) && repsNum > 0) {
      const oneRepMax = weightNum * (1 + repsNum / 30);
      setEstimated1RM(oneRepMax);
    } else {
      setEstimated1RM(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RM Calculator</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight</Text>
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
        <Text style={styles.label}>Reps</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reps"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
          placeholderTextColor={Colors.light.text}
        />
      </View>

      <Button title="Calculate" onPress={calculate1RM} />

      <Text style={styles.result}>
        Estimated 1RM: <Text style={styles.resultValue}>{estimated1RM.toFixed(2)}</Text>
      </Text>
    </View>
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
