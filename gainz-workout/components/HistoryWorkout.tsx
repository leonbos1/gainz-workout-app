import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { Set } from '@/models/Set';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface HistoryWorkoutProps {
    sets: Array<Set>;
    date: Date;
    title: string;
    durationSeconds: number;
}

export function HistoryWorkout({ sets, date, title, durationSeconds }: HistoryWorkoutProps): JSX.Element {
    const heaviestSets = Object.values(
        sets.reduce((acc, set) => {
            const existingSet = acc[set.batchid];

            if (!existingSet || set.weight > existingSet.weight) {
                acc[set.batchid] = set;
            }

            return acc;
        }, {} as Record<number, Set>)
    );

    return (
        <ThemedView style={styles.Container}>
            <View style={styles.Header}>
                <ThemedText style={styles.Title}>{title}</ThemedText>
                <ThemedText style={styles.Date}>{date.toDateString()}</ThemedText>
                <ThemedText style={styles.Date}>{`Duration: ${durationSeconds} seconds`}</ThemedText>
            </View>
            {heaviestSets.map((set, index) => (
                <View key={index} style={styles.SetContainer}>
                    <ThemedText style={styles.SetText}>
                        {`Batch ID: ${set.batchid}, Reps: ${set.amount}, Weight: ${set.weight} kg, RPE: ${set.rpe}`}
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
