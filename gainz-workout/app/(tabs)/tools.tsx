import { RmCalculator } from '@/components/RmCalculator';
import { RpeCalculator } from '@/components/RpeCalculator';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ToolsScreen() {

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.subContainer}>
        <TouchableOpacity>
          <Link href="/databaseManagement">
            <Text style={styles.text}>Database Management</Text>
          </Link>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView>
        <RmCalculator />
        <RpeCalculator />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    padding: 10,
  },
  subContainer: {
    backgroundColor: Colors.light.background,
    padding: 10,
    marginBottom: 10,
  },
  text: {
    color: Colors.light.text,
    fontSize: 20,
  },
});
