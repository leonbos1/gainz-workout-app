import React from 'react';
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Set } from '@/datamodels/Set';
import { HistoryWorkoutViewmodel } from '@/viewmodels/HistoryWorkoutViewmodel';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Workout } from '@/datamodels/Workout';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface HistoryWorkoutProps {
  viewmodel: HistoryWorkoutViewmodel;
  onDelete: (workoutId: number) => void;
}

export function HistoryWorkout({ viewmodel, onDelete }: HistoryWorkoutProps): JSX.Element {
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

  const deleteWorkout = async () => {
    console.log('Delete workout:', viewmodel);
    // show confirmation dialog
    Alert.alert("Are you sure you want to delete this workout?", "This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await Workout.deleteFullWorkout(viewmodel.workoutId);
            onDelete(viewmodel.workoutId);
          } catch (error) {
            console.error('Failed to delete workout:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={deleteWorkout} style={ styles.deleteButton }>
        <FontAwesome name="trash" size={24} color={Colors.light.text} />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>{viewmodel.title}</Text>
        <Text style={styles.date}>
          <FontAwesome name="calendar" size={16} color={Colors.light.text} /> {viewmodel.startTime.toLocaleDateString()}
        </Text>
        <Text style={styles.duration}>
          <FontAwesome name="clock-o" size={16} color={Colors.light.text} /> {`Duration: ${viewmodel.duration} seconds`}
        </Text>
      </View>
      {heaviestSets.map((set, index) => (
        <View key={index} style={styles.setContainer}>
          <Text style={styles.setText}>
          <MaterialCommunityIcons name="dumbbell" size={16} color={Colors.light.text} /> {`Exercise: ${set.exerciseName}`}
          </Text>
          <Text style={styles.setText}>
            <FontAwesome name="repeat" size={16} color={Colors.light.text} /> {`Reps: ${set.amount}`}
          </Text>
          <Text style={styles.setText}>
            <FontAwesome name="balance-scale" size={16} color={Colors.light.text} /> {`Weight: ${set.weight} kg`}
          </Text>
          {set.rpe !== null && (
            <Text style={styles.setText}>
              <FontAwesome name="heartbeat" size={16} color={Colors.light.text} /> {`RPE: ${set.rpe}`}
            </Text>
          )}
        </View>
      ))}
    </View>
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
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 40,
    width: 40,
    zIndex: 1,
  },
});