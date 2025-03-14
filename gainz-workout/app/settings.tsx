import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Colors } from '@/constants/Colors';
import { processCSVRowsInBatch, CSVRow } from '@/helpers/csvHelper';
import { createTables, Database, dropTables, seedDatabase } from '@/database/database';
import { Set } from '@/models/Set';

export default function SettingsScreen() {
  const [loading, setLoading] = useState(false);
  const [parsedRows, setParsedRows] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  const importCSV = async () => {
    setLoading(true);
    const db = await Database.getDbConnection();

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/comma-separated-values',
      });

      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);

        const rows = fileContent.trim().split('\n').map(row => row.split(';'));
        const headers = rows[0].map(header => header.trim().replace(/"/g, ''));

        const records: CSVRow[] = rows.slice(1).map((row) => {
          const record = {} as CSVRow;
          headers.forEach((header, index) => {
            const value = row[index];
            if (value !== undefined) {
              record[header as keyof CSVRow] = value.trim().replace(/"/g, '');
            }
          });
          return record;
        });

        setTotalRows(records.length);

        await processCSVRowsInBatch(db, records, 100, setParsedRows);

        Alert.alert('Success', 'CSV data imported successfully.');
      } else {
        Alert.alert('Cancelled', 'No file selected.');
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      Alert.alert('Error', 'Failed to import CSV data.');
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async () => {
    setLoading(true);
    await dropTables();
    await createTables();
    await seedDatabase();
    setLoading(false);
  };

  const scrubData = async () => {
    await Set.scrubData();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.description}>
        Use the button below to import a CSV file from the Strong app.
      </Text>
      <TouchableOpacity style={styles.button} onPress={importCSV} disabled={loading}>
        <Text style={styles.buttonText}>Import CSV</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={deleteData} disabled={loading}>
        <Text style={styles.buttonText}>Delete Data</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={scrubData} disabled={loading}>
        <Text style={styles.buttonText}>Scrub bad data</Text>
      </TouchableOpacity>
      {loading && (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.progress}>
            {`Parsed ${parsedRows} of ${totalRows} rows`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.trinairy,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '80%',
    margin: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progress: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.text,
  },
});
