import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';
import { WorkoutWeekData } from '@/models/Workout';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const WorkoutBarChart: React.FC<{ workoutWeekData: WorkoutWeekData }> = ({ workoutWeekData }) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{workoutWeekData.title}</Text>
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
          backgroundGradientFrom: Colors.background,
          backgroundGradientTo: Colors.background,
          color: (opacity = 1) => Colors.secundary,
          labelColor: (opacity = 1) => Colors.text,
          barPercentage: 0.6,
          fillShadowGradient: Colors.secundary,
          fillShadowGradientOpacity: 1,
          decimalPlaces: 0,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            stroke: Colors.backgroundSecondary,
            strokeDasharray: '',
          },
          propsForLabels: {
            fontSize: 12,
          },
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: Colors.background,
  },
  chart: {
    borderRadius: 16,
    backgroundColor: Colors.backgroundSecondary,
    shadowColor: Colors.backgroundSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    padding: 10,
  },
});
