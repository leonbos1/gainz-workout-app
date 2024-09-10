import { RmCalculator } from '@/components/RmCalculator';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';

export default function ToolsScreen() {

  return (
    <View style={styles.container}>
      <ThemedView>
        <TouchableOpacity>
          <Link href="./databaseManagement">
            <Text style={styles.text}>Database Management</Text>
          </Link>
        </TouchableOpacity>
      </ThemedView>
      <RmCalculator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    height: '100%',
    width: '100%',
  },
  text: {
    color: Colors.light.text,
    fontSize: 20,
  },
});
