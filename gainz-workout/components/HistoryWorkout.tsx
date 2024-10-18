// HistoryWorkout.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { HistoryWorkoutViewmodel } from '@/viewmodels/HistoryWorkoutViewmodel';

interface HistoryWorkoutProps {
    viewmodel: HistoryWorkoutViewmodel;
}

export const HistoryWorkout: React.FC<HistoryWorkoutProps> = ({ viewmodel }) => {
    var formattedDate = '';
    try {
        formattedDate = viewmodel.startTime.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    }
    catch (error) {
        console.error('Error formatting date', error);
    }

    return (
        <View style={styles.workoutContainer}>
            <Text style={styles.dateText}>{formattedDate}</Text>
            <View style={styles.headerRow}>
                <Text style={styles.headerText}>Exercise</Text>
                <Text style={styles.headerText}>| Best set</Text>
            </View>
            {viewmodel.exerciseBatches.map((batch) => {
                if (batch.bestSet) {
                    return (
                        <View key={batch.batchId} style={styles.exerciseRow}>
                            <Text style={styles.exerciseText}>
                                {batch.numSets}x {batch.exercisename}
                            </Text>
                            <Text style={styles.bestSetText}>
                                {batch.bestSet.weight}kg {batch.bestSet.amount}x
                            </Text>
                        </View>
                    );
                } else {
                    return null;
                }
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    workoutContainer: {
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 5,
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginRight: 10,
    },
    exerciseRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    exerciseText: {
        fontSize: 16,
        color: Colors.light.text,
        marginRight: 10,
    },
    bestSetText: {
        fontSize: 16,
        color: Colors.light.text,
    },
});
