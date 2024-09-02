import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import * as SQLite from 'expo-sqlite';

interface CSVRow {
  Date: string;
  'Workout Name': string;
  'Exercise Name': string;
  'Set Order': string;
  Weight: string;
  Reps: string;
  RPE: string;
  Notes: string;
}

export default function SettingsScreen() {

  const importCSV = async () => {
    console.log('starting import csv');
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/comma-separated-values',
      });

      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        console.log('File URI:', fileUri);

        const fileContent = await FileSystem.readAsStringAsync(fileUri);

        Papa.parse<CSVRow>(fileContent, {
          header: true,
          step: async (results, parser) => {
            parser.pause();
            await processCSVRow(db, results.data);
            parser.resume();
          },
          complete: async () => {
            console.log('CSV import completed');
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

async function processCSVRow(db: SQLite.Database, row: CSVRow) {
  try {
    // Start transaction
    await db.execAsync('BEGIN TRANSACTION');

    // Get or create workout
    const workoutId = await getOrCreateWorkout(db, row.Date);

    // Get or create exercise
    const exerciseId = await getOrCreateExercise(db, row['Exercise Name']);

    // Insert batch
    const batchStatement = await db.prepareAsync(
      'INSERT INTO Batch (workoutid, exerciseid, note) VALUES (?, ?, ?)'
    );
    const batchResult = await batchStatement.executeAsync([
      workoutId,
      exerciseId,
      row.Notes || ''
    ]);
    const batchId = batchResult[0].insertId; // Access insertId from the first element

    // Insert set
    const setStatement = await db.prepareAsync(
      'INSERT INTO Set (exerciseid, amount, weight, rpe, batchid) VALUES (?, ?, ?, ?, ?)'
    );
    await setStatement.executeAsync([
      exerciseId,
      parseInt(row.Reps),
      parseFloat(row.Weight),
      parseFloat(row.RPE),
      batchId
    ]);

    // Commit transaction
    await db.execAsync('COMMIT');
    console.log(`Processed row for workout date: ${row.Date}`);
  } catch (error) {
    // Rollback transaction in case of error
    await db.execAsync('ROLLBACK');
    console.error('Transaction error:', error);
  }
}

async function getOrCreateWorkout(db: SQLite.Database, date: string): Promise<number> {
  const workoutStatement = await db.prepareAsync(
    'SELECT id FROM Workout WHERE starttime = ?'
  );
  const workoutResult = await workoutStatement.executeAsync([date]);

  if (workoutResult[0].rows.length > 0) {
    return workoutResult[0].rows.item(0).id;
  } else {
    const insertStatement = await db.prepareAsync(
      'INSERT INTO Workout (starttime, endtime) VALUES (?, ?)'
    );
    const insertResult = await insertStatement.executeAsync([date, date]);
    return insertResult[0].insertId;
  }
}

async function getOrCreateExercise(db: SQLite.SQLiteDatabase, name: string): Promise<number> {
  const exerciseStatement = await db.prepareAsync(
    'SELECT id FROM Exercise WHERE name = ?'
  );
  const exerciseResult = await exerciseStatement.executeAsync([name]);

  if (exerciseResult[0].rows.length > 0) {
    return exerciseResult[0].rows.item(0).id;
  } else {
    const insertStatement = await db.prepareAsync(
      'INSERT INTO Exercise (name) VALUES (?)'
    );
    const insertResult = await insertStatement.executeAsync([name]);
    return insertResult[0].insertId;
  }
}
