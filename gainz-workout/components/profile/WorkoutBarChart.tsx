import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '../ThemedText';
import { WorkoutWeekData } from '@/models/Workout';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const WorkoutBarChart: React.FC<{ workoutWeekData: WorkoutWeekData }> = ({ workoutWeekData }) => {
  return (
    <ThemedView style={styles.chartContainer}>
      <ThemedText style={styles.chartTitle}>{workoutWeekData.title}</ThemedText>
      <BarChart
        data={workoutWeekData}
        width={screenWidth - 20}
        height={screenHeight / 4}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        showBarTops={true}
        fromZero={true}
        chartConfig={{
          backgroundGradientFrom: Colors.light.background,
          backgroundGradientTo: Colors.light.background,
          color: (opacity = 1) => Colors.light.secundary,
          labelColor: (opacity = 1) => Colors.light.text,
          barPercentage: 0.6,
          fillShadowGradient: Colors.light.secundary,
          fillShadowGradientOpacity: 1,
          decimalPlaces: 0,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            stroke: Colors.light.backgroundSecondary,
            strokeDasharray: '',
          },
          propsForLabels: {
            fontSize: 12,
          },
        }}
        style={styles.chart}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: Colors.light.background,
  },
  chart: {
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    shadowColor: Colors.light.backgroundSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    padding: 10,
  },
});
