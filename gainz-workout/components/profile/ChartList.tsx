import React, { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { Workout, WorkoutWeekData } from '@/models/Workout';
import { Chart, ChartDataset } from './Chart';
import { WorkoutBarChart } from './WorkoutBarChart';
import { Set } from '@/models/Set';

type ChartListProps = {
};

const ChartList: React.FC<ChartListProps> = ({ }) => {
    const [workoutData, setWorkoutData] = useState<WorkoutWeekData | null>(null);
    const [estimatedBenchPress1RM, setEstimatedBenchPress1RM] = useState<ChartDataset | null>(null);
    const [estimatedSquat1RM, setEstimatedSquat1RM] = useState<ChartDataset | null>(null);


    useFocusEffect(
        useCallback(() => {
            async function fetchWorkoutData() {
                const data = await Workout.getWorkoutsPerWeek(8);
                setWorkoutData(data);
            }

            async function fetchBenchPress1RM() {
                const benchPressSets = await Set.getEstimated1RM('Bench Press', 100);
                setEstimatedBenchPress1RM(benchPressSets);
            }

            async function fetchSquat1RM() {
                const squatSets = await Set.getEstimated1RM('Squat', 100);
                setEstimatedSquat1RM(squatSets);
            }

            fetchWorkoutData();
            fetchBenchPress1RM();
            fetchSquat1RM();
            return () => { };
        }, [])
    );

    return (
        <View style={styles.container}>
            {workoutData && <WorkoutBarChart workoutWeekData={workoutData} />}
            {estimatedBenchPress1RM && <Chart data={estimatedBenchPress1RM} title="Estimated Bench Press 1RM" />}
            {estimatedSquat1RM && <Chart data={estimatedSquat1RM} title="Estimated Squat 1RM" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
});

export default ChartList;
