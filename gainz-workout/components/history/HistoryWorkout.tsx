import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { Set } from '@/models/Set';
import { HistoryWorkoutViewmodel } from '@/viewmodels/HistoryWorkoutViewmodel';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface HistoryWorkoutProps {
    viewmodel: HistoryWorkoutViewmodel;
}

export function HistoryWorkout({ viewmodel }: HistoryWorkoutProps): JSX.Element {
    const heaviestSets = Object.values(
        viewmodel.exerciseBatches.reduce((acc, batch) => {
            const sets = batch.sets;
            sets.forEach(set => {
                if (!acc[set.batchid] || acc[set.batchid].weight < set.weight) {
                    acc[set.batchid] = set;
                }
            });
            return acc;
        }, {} as { [batchid: number]: Set })
    );

    return (
        <ThemedView style={styles.Container}>
            <View style={styles.Header}>
                <ThemedText style={styles.Title}>{viewmodel.title}</ThemedText>
                <ThemedText style={styles.Date}>{viewmodel.startTime.toLocaleDateString()}</ThemedText>
                <ThemedText style={styles.Date}>{`Duration: ${viewmodel.duration} seconds`}</ThemedText>
            </View>
            {heaviestSets.map((set, index) => (
                <View key={index} style={styles.SetContainer}>
                    <ThemedText style={styles.SetText}>
                        {`Exercise: ${set.exerciseName}, Reps: ${set.amount}, Weight: ${set.weight} kg, RPE: ${set.rpe}`}
                    </ThemedText>
                </View>
            ))}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: Colors.light.background,
        marginBottom: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    Header: {
        marginBottom: 10,
    },
    Title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    Date: {
        fontSize: 16,
        color: Colors.light.text,
    },
    SetContainer: {
        marginVertical: 5,
    },
    SetText: {
        fontSize: 16,
        color: Colors.light.text,
    },
});
