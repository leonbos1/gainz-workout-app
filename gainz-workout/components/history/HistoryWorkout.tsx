import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { Set } from '@/models/Set';
import { HistoryWorkoutViewmodel } from '@/viewmodels/HistoryWorkoutViewmodel';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface HistoryWorkoutProps {
  viewmodel: HistoryWorkoutViewmodel;
}

export function HistoryWorkout({ viewmodel }: HistoryWorkoutProps): JSX.Element {
  const heaviestSets = Object.values(
    viewmodel.exerciseBatches.reduce((acc, batch) => {
      const sets = batch.sets;
      sets.forEach(set => {
        if (!acc[set.batchid] || acc[set.batchid].weight < set.weight) {
          acc[set.batchid] = set;
        }
      });
      return acc;
    }, {} as { [batchid: number]: Set })
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{viewmodel.title}</ThemedText>
        <ThemedText style={styles.date}>
          <FontAwesome name="calendar" size={16} color={Colors.light.text} /> {viewmodel.startTime.toLocaleDateString()}
        </ThemedText>
        <ThemedText style={styles.duration}>
          <FontAwesome name="clock-o" size={16} color={Colors.light.text} /> {`Duration: ${viewmodel.duration} seconds`}
        </ThemedText>
      </View>
      {heaviestSets.map((set, index) => (
        <View key={index} style={styles.setContainer}>
          <ThemedText style={styles.setText}>
          <MaterialCommunityIcons name="dumbbell" size={16} color={Colors.light.text} /> {`Exercise: ${set.exerciseName}`}
          </ThemedText>
          <ThemedText style={styles.setText}>
            <FontAwesome name="repeat" size={16} color={Colors.light.text} /> {`Reps: ${set.amount}`}
          </ThemedText>
          <ThemedText style={styles.setText}>
            <FontAwesome name="balance-scale" size={16} color={Colors.light.text} /> {`Weight: ${set.weight} kg`}
          </ThemedText>
          {set.rpe !== null && (
            <ThemedText style={styles.setText}>
              <FontAwesome name="heartbeat" size={16} color={Colors.light.text} /> {`RPE: ${set.rpe}`}
            </ThemedText>
          )}
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.background,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.backgroundSecondary,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundSecondary,
    paddingBottom: 10,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 5,
  },
  duration: {
    fontSize: 16,
    color: Colors.light.text,
  },
  setContainer: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    width: '100%',
  },
  setText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 5,
  },
});