import React from 'react';
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Set } from '@/models/Set';
import { HistoryWorkoutViewmodel } from '@/viewmodels/HistoryWorkoutViewmodel';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Workout } from '@/models/Workout';

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
      <TouchableOpacity onPress={deleteWorkout} style={styles.deleteButton}>
        <FontAwesome name="trash" size={24} color={Colors.text} />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>{viewmodel.title}</Text>
        <Text style={styles.date}>
          <FontAwesome name="calendar" size={16} color={Colors.text} /> {viewmodel.startTime.toLocaleDateString()}
        </Text>
        <Text style={styles.duration}>
          <FontAwesome name="clock-o" size={16} color={Colors.text} /> {`Duration: ${viewmodel.duration} seconds`}
        </Text>
      </View>
      {heaviestSets.map((set, index) => (
        <View key={index} style={styles.setContainer}>
          <View style={styles.textRow}>
            <MaterialCommunityIcons style={styles.icon} name="dumbbell" size={16} color={Colors.text} />
            <Text style={styles.setText}>
              {`${set.exerciseName}`}
            </Text>
          </View>
          <View style={styles.textRow}>
            <FontAwesome style={styles.icon} name="repeat" size={16} color={Colors.text} />

            <Text style={styles.setText}>
              {`${set.amount} Reps`}
            </Text>
          </View>
          <View style={styles.textRow}>
            <FontAwesome style={styles.icon} name="balance-scale" size={16} color={Colors.text} />
            <Text style={styles.setText}>
              {`${set.weight} kg`}
            </Text>
          </View>
          {
            set.rpe !== null && (
              <View style={styles.textRow}>
                <FontAwesome style={styles.icon} name="heartbeat" size={16} color={Colors.text} />
                <Text style={styles.setText}>
                  {`${set.rpe} RPE`}
                </Text>
              </View>
            )
          }

        </View>
      ))
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.background,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
    paddingBottom: 10,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 5,
  },
  duration: {
    fontSize: 16,
    color: Colors.text,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 40,
    width: 40,
    zIndex: 1,
  },
  setContainer: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.white,
  },
  setText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 5,
  },
  icon: {
    height: 25,
    width: 45
  },
  textRow: {
    flex: 1,
    flexDirection: 'row',
  },
});