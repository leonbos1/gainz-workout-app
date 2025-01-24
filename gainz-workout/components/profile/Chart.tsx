import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ChartDataset } from '@/models/ChartDataset';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface ChartProps {
    data: ChartDataset;
    title: string;
}

export function Chart({ data, title }: ChartProps): JSX.Element {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                data: data.data,
                strokeWidth: data.strokeWidth || 2,
            },
        ],
    };

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>{title}</Text>
            <LineChart
                data={chartData}
                width={screenWidth - 20}
                height={screenHeight / 4}
                chartConfig={{
                    backgroundGradientFrom: Colors.background,
                    backgroundGradientTo: Colors.background,
                    color: (opacity = 1) => Colors.secundary,
                    labelColor: (opacity = 1) => Colors.text,
                    barPercentage: 0.5,
                    fillShadowGradient: Colors.secundary,
                    fillShadowGradientOpacity: 1,
                    decimalPlaces: 0,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: '0',
                    },
                    propsForBackgroundLines: {
                        stroke: Colors.background,
                        strokeDasharray: '',
                    },
                    propsForLabels: {
                        fontSize: 12,
                    },
                }}
                bezier
                style={styles.chart}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: 'center',
        marginVertical: 16,
        backgroundColor: Colors.background,
    },
    chart: {
        borderRadius: 16,
        backgroundColor: Colors.background,
        shadowColor: Colors.background,
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


export { ChartDataset };