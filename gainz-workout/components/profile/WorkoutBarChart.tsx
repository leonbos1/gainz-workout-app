import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '../ThemedText';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface WorkoutBarChartProps {
  data: {
    title: string;
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

export const WorkoutBarChart: React.FC<WorkoutBarChartProps> = ({ data }) => {
  return (
    <ThemedView style={styles.chartContainer}>
      <ThemedText style={styles.chartTitle}>{data.title}</ThemedText>
      <BarChart
        data={data}
        width={screenWidth - 20}
        height={screenHeight / 4}
        yAxisLabel=""
        yAxisSuffix=""
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
