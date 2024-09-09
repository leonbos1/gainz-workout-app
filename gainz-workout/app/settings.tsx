import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
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
  const [loading, setLoading] = useState(false);  // New state for loading

  const importCSV = async () => {
    setLoading(true);  // Start loading animation
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/comma-separated-values',
      });

      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        console.log('File URI:', fileUri);

        // Delay processing to ensure ActivityIndicator is displayed
        setTimeout(async () => {
          try {
            const fileContent = await FileSystem.readAsStringAsync(fileUri);

            // Manually parse the CSV content
            const rows = fileContent.trim().split('\n').map(row => row.split(';'));
            const headers = rows[0]; // Assuming the first row is the header

            // Convert rows to objects
            const records: CSVRow[] = rows.slice(1).map((row) => {
              const record: CSVRow = {} as CSVRow;
              headers.forEach((header, index) => {
                const value = row[index];
                if (value !== undefined) {
                  record[header.trim() as keyof CSVRow] = value.trim().replace(/"/g, '');
                }
              });
              return record;
            });

            console.log('Parsed CSV Data:', records);

            for (const record of records) {
              await processCSVRow(db, record);
            }

            Alert.alert('Success', 'CSV data imported successfully.');
          } catch (error) {
            console.error('Error importing CSV:', error);
            Alert.alert('Error', 'Failed to import CSV data.');
          } finally {
            setLoading(false);  // End loading animation
          }
        }, 100); // Small timeout to ensure UI renders the spinner
      } else {
        Alert.alert('Cancelled', 'No file selected.');
        setLoading(false);  // Stop loading animation
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      Alert.alert('Error', 'An error occurred while importing the CSV file.');
      setLoading(false);  // Stop loading animation
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      {loading ? ( // Conditionally render ActivityIndicator when loading
        <ActivityIndicator size="large" color="#0000ff" animating={true} />
      ) : (
        <Button title="Import Data" onPress={importCSV} />
      )}
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

async function processCSVRow(db: SQLite.SQLiteDatabase, row: CSVRow) {
  try {
    const workoutId = await getOrCreateWorkout(db, row.Date);
    const exerciseId = await getOrCreateExercise(db, row['Exercise Name']);

    const batchStatement = await db.prepareAsync(
      'INSERT INTO batch (workoutid, note) VALUES (?, ?)'
    );

    const batchResult: any = await batchStatement.executeAsync([workoutId, row.Notes || '']);
    const batchId = batchResult.lastInsertRowId;

    const setStatement = await db.prepareAsync(
      'INSERT INTO exerciseset (exerciseid, amount, weight, rpe, batchid) VALUES (?, ?, ?, ?, ?)'
    );

    if (row.Reps === undefined || row.Weight === undefined || row.RPE === undefined) {
      console.log('Skipping row with missing data:', row);
      return;
    }

    await setStatement.executeAsync([
      exerciseId,
      parseInt(row.Reps),
      parseFloat(row.Weight),
      parseFloat(row.RPE),
      batchId
    ]);

  } catch (error) {
    console.error('Transaction error:', error);
  }
}

async function getOrCreateWorkout(db: SQLite.SQLiteDatabase, date: string): Promise<number> {
  const workoutStatement = await db.prepareAsync(
    'SELECT id FROM workout WHERE starttime = ?'
  );
  const workoutResult = await workoutStatement.executeAsync([date]);

  const workoutRows = await workoutResult.getAllAsync() as { id: number, starttime: string }[];

  if (workoutRows.length > 0) {
    return workoutRows[0].id;
  }

  const insertStatement = await db.prepareAsync(
    'INSERT INTO workout (starttime, endtime) VALUES (?, ?)'
  );

  const insertResult = await insertStatement.executeAsync([date, date]);
  return insertResult.lastInsertRowId;
}

async function getOrCreateExercise(db: SQLite.SQLiteDatabase, name: string): Promise<number> {
  const exerciseStatement = await db.prepareAsync(
    'SELECT id FROM exercise WHERE name = ?'
  );

  const exerciseResult = await exerciseStatement.executeAsync([name]);

  const exerciseRows = await exerciseResult.getAllAsync() as { id: number }[];

  if (exerciseRows.length > 0) {
    return exerciseRows[0].id;
  }

  const insertStatement = await db.prepareAsync(
    'INSERT INTO exercise (name) VALUES (?)'
  );

  const insertResult = await insertStatement.executeAsync([name]);

  return insertResult.lastInsertRowId;
}
