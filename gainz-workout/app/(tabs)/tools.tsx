import { RmCalculator } from '@/components/RmCalculator';
import { RpeCalculator } from '@/components/RpeCalculator';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { Text, StyleSheet, TouchableOpacity, ScrollView, View, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const screenWidth = Dimensions.get('window').width;

export default function ToolsScreen() {

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.screenTitle}>Tools</ThemedText>
      </ThemedView>
      <TouchableOpacity>
        <Link href="/databaseManagement">
          <Text style={styles.text}>Database Management</Text>
        </Link>
      </TouchableOpacity>
      <RmCalculator />
      <RpeCalculator />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subContainer: {
    backgroundColor: Colors.green,
    padding: 10,
    marginBottom: 10,
  },
  text: {
    color: Colors.light.text,
    fontSize: 20,
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 40,
    backgroundColor: Colors.light.background,
    width: screenWidth,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
});
