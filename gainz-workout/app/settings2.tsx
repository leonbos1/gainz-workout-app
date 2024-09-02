import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import * as SQLite from 'expo-sqlite';
import { Workout, WorkoutRow } from '@/models/Workout';
import { Batch } from '@/models/Batch';
import { Exercise } from '@/models/Exercise';
import { Set } from '@/models/Set';

interface CSVRow {
  Date: string;
  'Workout Name': string;
  'Exercise Name': string;
  'Set Order': string;  // or `number` if you want to parse it immediately
  Weight: string;       // or `number` if you want to parse it immediately
  'Weight Unit': string;
  Reps: string;         // or `number` if you want to parse it immediately
  RPE: string;          // or `number` if you want to parse it immediately
  Distance: string;     // or `number` if applicable
  'Distance Unit': string;
  Seconds: string;      // or `number` if applicable
  Notes: string;
  'Workout Notes': string;
  'Workout Duration': string;
}

export default function SettingsScreen() {

  const importCSV = async () => {
    console.log('starting import csv');
    const db = SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/comma-separated-values',
      });

      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        console.log('File URI:', fileUri);

        const fileContent = await FileSystem.readAsStringAsync(fileUri);

        Papa.parse(fileContent, {
          header: true,
          complete: async (results) => {
            await processCSVData(results.data as CSVRow[]);
            Alert.alert('Success', 'CSV data imported successfully.');
          },
          error: (error: any) => {
            console.error('Error parsing CSV:', error);
            Alert.alert('Error', 'Failed to parse CSV file.');
          },
        });
      } else {
        Alert.alert('Cancelled', 'No file selected.');
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      Alert.alert('Error', 'An error occurred while importing the CSV file.');
    }
    console.log('finished import csv');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <Button title="Import Data" onPress={importCSV} />
      <Button title="Export Data" onPress={() => alert('Exporting data')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

function containsWorkout(workouts: Workout[], date: string) {
  return workouts.some((workout) => workout.starttime === date);
}

async function processCSVData(data: CSVRow[]) {
  //   Date;Workout Name;Exercise Name;Set Order;Weight;Weight Unit;Reps;RPE;Distance;Distance Unit;Seconds;Notes;Workout Notes;Workout Duration
  //   2022-05-18 23:30:05;"Evening Workout";"Squat (Barbell)";1;100;kg;12;;;;0;"";"";1m
  //   2022-05-18 23:30:05;"Evening Workout";"Squat (Barbell)";2;100;kg;12;;;;0;;;1m
  //   2022-05-18 23:30:05;"Evening Workout";"Squat (Barbell)";3;100;kg;12;;;;0;;;1m
  //   2022-05-18 23:30:05;"Evening Workout";"Seated Leg Curl (Machine)";1;35;kg;12;;;;0;"";;1m
  console.log('process csv called');

  const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

  // Prepare arrays to hold the new records
  const newWorkouts: Workout[] = [];
  const newExercises: string[] = [];
  const newBatches: any[] = [];
  const newSets: any[] = [];

  var currentWorkoutDate = '';
  var currentWorkout = new Workout(0, '', '', '');
  var currentBatch = new Batch(0, 0, '');
  var currentExerciseName = '';
  var currentExercise = new Exercise(0, '', '', 0);

  // Step 1: Organize data from CSV into respective arrays
  data.forEach(async (row) => {
    // console.log('Processing row:', row);
    if (!row.Date) {
      return;
    }

    // Keep track of the current workout
    if (currentWorkoutDate !== row.Date) {
      currentWorkoutDate = row.Date;
      if (!containsWorkout(newWorkouts, currentWorkoutDate)) {
        currentWorkout = await Workout.create(row.Date, row.Date);
        newWorkouts.push(currentWorkout);
      }
    }

    // Keep track of the current batch
    if (currentExerciseName !== row['Exercise Name']) {
      currentExerciseName = row['Exercise Name'];
      currentBatch = await Batch.create(currentWorkout.id, '');

      if (!newExercises.includes(currentExerciseName)) {
        newExercises.push(currentExerciseName);
      }

      if (!newBatches.includes(currentBatch)) {
        newBatches.push(currentBatch);
      }
    }

    // Create a new exercise set
    const newSet = Set.create(
      currentExercise.id,
      parseInt(row.Reps),
      parseInt(row.Weight),
      parseInt(row.RPE),
      currentBatch.id
    );

    newSets.push(newSet);
  });

  try {
    // Start transaction
    await db.execAsync('BEGIN TRANSACTION');
    console.log('Transaction started.');

    const workoutStatement = await db.prepareAsync(
      'INSERT INTO workout (starttime, endtime) VALUES (?, ?)'
    );

    const exerciseStatement = await db.prepareAsync(
      'INSERT INTO exercise (name) VALUES (?)'
    );

    const batchStatement = await db.prepareAsync(
      'INSERT INTO batch (workoutid, note) VALUES (?, ?)'
    );

    const setStatement = await db.prepareAsync(
      'INSERT INTO exerciseset (exerciseid, amount, weight, rpe, batchid) VALUES (?, ?, ?, ?, ?)'
    );

    // Step 2: Insert Workouts
    for (const workout of newWorkouts) {
      await workoutStatement.executeAsync([workout.starttime, workout.endtime]);
      console.log('Inserted workout:', workout);
    }

    // Step 3: Insert Exercises
    for (const exerciseName of newExercises) {
      await exerciseStatement.executeAsync([exerciseName]);
      console.log('Inserted exercise:', exerciseName);
    }

    // Step 4: Insert Batches
    for (const batch of newBatches) {
      // Get the workoutId and exerciseId for this batch
      const workoutResult = await db.runAsync(
        'SELECT id FROM workout WHERE starttime = ?',
        [batch.workoutDate]
      );
      const workoutId = workoutResult.lastInsertRowId;

      await batchStatement.executeAsync([workoutId, batch.note]);
      console.log('Inserted batch:', batch);
    }

    // Step 5: Insert Sets
    for (const set of newSets) {
      await setStatement.executeAsync([
        set.exerciseId,
        set.reps,
        set.weight,
        set.rpe,
        set.batchId,
      ]);
      console.log('Inserted set:', set);
    }

    // Commit transaction
    await db.execAsync('COMMIT');
    console.log('Transaction complete.');

  } catch (error) {
    // Rollback transaction in case of error
    await db.execAsync('ROLLBACK');
    console.error('Transaction error:', error);
  }
}