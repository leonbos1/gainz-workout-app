import React, { useCallback, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { Workout, WorkoutWeekData } from '@/models/Workout';
import { Chart, ChartDataset } from './Chart';
import { WorkoutBarChart } from './WorkoutBarChart';
import { Set } from '@/models/Set';
import { Graph } from '@/models/Graph';
import { GraphDuration } from '@/models/GraphDuration';

type ChartListProps = {};

const ChartList: React.FC<ChartListProps> = ({ }) => {
    const [workoutData, setWorkoutData] = useState<WorkoutWeekData | null>(null);
    const [graphs, setGraphs] = useState<Graph[]>([]);
    const [graphData, setGraphData] = useState<{ [key: string]: ChartDataset | null }>({});

    useFocusEffect(
        useCallback(() => {
            async function fetchWorkoutData() {
                const data = await Workout.getWorkoutsPerWeek(8);
                setWorkoutData(data);
            }

            async function fetchGraphs() {
                const allGraphs = await Graph.findAllEnabled();
                setGraphs(allGraphs);
            }

            fetchWorkoutData();
            fetchGraphs();
            return () => { };
        }, [])
    );

    useEffect(() => {
        async function loadGraphData() {
            const dataPromises = graphs.map(async (graph) => {
                const duration = await GraphDuration.findById(graph.graph_durationid);
                if (graph.graph_typeid === 1) {
                    const chartData = await Set.getEstimated1RM(graph.exerciseid, duration.value);
                    return { id: graph.id, data: chartData };
                }
                return { id: graph.id, data: null };
            });

            const data = await Promise.all(dataPromises);
            const dataMap = data.reduce((acc, { id, data }) => ({ ...acc, [id]: data }), {});
            setGraphData(dataMap);
        }

        if (graphs.length > 0) loadGraphData();
    }, [graphs]);

    return (
        <View style={styles.container}>
            {workoutData && <WorkoutBarChart workoutWeekData={workoutData} />}
            {graphs.map(graph => (
                graphData[graph.id] ? (
                    <Chart key={graph.id} data={graphData[graph.id] as ChartDataset} title={graph.graph_typeid.toString()} />
                ) : null
            ))}
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
