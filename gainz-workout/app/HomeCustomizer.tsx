import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Exercise } from '@/models/Exercise';
import { Equipment } from '@/models/Equipment';
import { Colors } from '@/constants/Colors';
import { ChartDataset } from '@/models/ChartDataset';
import { Set } from '@/models/Set';

export default function HomeCustomizer() {
  const [estimatedSquat1RM, setEstimatedSquat1RM] = useState<ChartDataset | null>(null);

  async function fetchSquat1RM() {
    const squatSets = await Set.getEstimated1RM('Squat', 100);
    setEstimatedSquat1RM(squatSets);
  }


  return (
    <View style={styles.container}>
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