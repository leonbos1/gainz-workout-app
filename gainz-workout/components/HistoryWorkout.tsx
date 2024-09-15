// HistoryWorkout.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
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
            <ThemedText style={styles.dateText}>{formattedDate}</ThemedText>
            <View style={styles.headerRow}>
                <ThemedText style={styles.headerText}>Exercise</ThemedText>
                <ThemedText style={styles.headerText}>| Best set</ThemedText>
            </View>
            {viewmodel.exerciseBatches.map((batch) => {
                if (batch.bestSet) {
                    return (
                        <View key={batch.batchId} style={styles.exerciseRow}>
                            <ThemedText style={styles.exerciseText}>
                                {batch.numSets}x {batch.exercisename}
                            </ThemedText>
                            <ThemedText style={styles.bestSetText}>
                                {batch.bestSet.weight}kg {batch.bestSet.amount}x
                            </ThemedText>
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
