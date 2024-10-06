import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Colors } from '@/constants/Colors';
import { processCSVRow, CSVRow } from '@/helpers/csvHelper';

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
        // console.log('File URI:', fileUri);

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

            // console.log('Parsed CSV Data:', records);

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
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.description}>
        Use the button below to import a CSV file from the Strong app.
      </Text>
      <TouchableOpacity style={styles.button} onPress={importCSV} disabled={loading}>
        <Text style={styles.buttonText}>Import CSV</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.light.text,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.textButton,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});


