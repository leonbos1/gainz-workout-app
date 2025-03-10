import { BMICalculator } from '@/components/BmiCalculator';
import { BMRCalculator } from '@/components/BmrCalculator';
import { RmCalculator } from '@/components/RmCalculator';
import { RpeCalculator } from '@/components/RpeCalculator';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { Text, StyleSheet, TouchableOpacity, ScrollView, View, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ToolsScreen() {

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Tools</Text>
      </View>
      <RmCalculator />
      <RpeCalculator />
      <BMICalculator />
      <BMRCalculator />
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
    color: Colors.text,
    fontSize: 20,
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 40,
    backgroundColor: Colors.background,
    width: screenWidth,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    backgroundColor: Colors.background,
  },
});
