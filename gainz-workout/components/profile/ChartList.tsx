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
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import { ChartSelector } from './ChartSelector';

type ChartListProps = {};

const ChartList: React.FC<ChartListProps> = ({ }) => {
    const [workoutData, setWorkoutData] = useState<WorkoutWeekData | null>(null);
    const [graphVms, setGraphVms] = useState<GraphViewModel[]>([]);
    const [graphData, setGraphData] = useState<{ [key: string]: ChartDataset | null }>({});
    const [selectedGraphs, setSelectedGraphs] = useState<{ [key: number]: boolean }>({});

    useFocusEffect(
        useCallback(() => {
            async function fetchWorkoutData() {
                const data = await Workout.getWorkoutsPerWeek(8);
                setWorkoutData(data);
            }

            async function fetchGraphs() {
                var allGraphs = await Graph.findAllAsViewModel();
                allGraphs = allGraphs.filter(graph => graph.graph.enabled);
                setGraphVms(allGraphs);
                const initialSelectedGraphs = allGraphs.reduce((acc, graphVm) => {
                    acc[graphVm.graph.id] = graphVm.graph.enabled;
                    return acc;
                }, {} as { [key: number]: boolean });
                setSelectedGraphs(initialSelectedGraphs);
            }

            fetchWorkoutData();
            fetchGraphs();
            return () => { };
        }, [])
    );

    useEffect(() => {
        async function loadGraphData() {
            const dataPromises = graphVms.map(async (graphVm) => {
                const duration = await GraphDuration.findById(graphVm.graphDuration.id);
                if (graphVm.graphType.id === 1) {
                    const chartData = await Set.getEstimated1RM(graphVm.exercise.id, duration.value);
                    return { id: graphVm.graph.id, data: chartData };
                }
                return { id: graphVm.graph.id, data: null };
            });

            const data = await Promise.all(dataPromises);
            const dataMap = data.reduce((acc, { id, data }) => ({ ...acc, [id]: data }), {});
            setGraphData(dataMap);
        }

        if (graphVms.length > 0) loadGraphData();
    }, [graphVms]);

    const toggleGraphVisibility = (id: number) => {
        setSelectedGraphs(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <View style={styles.container}>
            <ChartSelector
                visible={true}
                graphVms={graphVms}
                selectedGraphs={selectedGraphs}
                toggleGraphVisibility={toggleGraphVisibility}
            />
            {workoutData && <WorkoutBarChart workoutWeekData={workoutData} />}
            {graphVms.map(graphVm => (
                selectedGraphs[graphVm.graph.id] && graphData[graphVm.graph.id] ? (
                    <Chart key={graphVm.graph.id} data={graphData[graphVm.graph.id] as ChartDataset} title={graphVm.graphTitle} />
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