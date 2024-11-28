import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Workout, WorkoutWeekData } from '@/models/Workout';
import { Chart, ChartDataset } from './Chart';
import { WorkoutBarChart } from './WorkoutBarChart';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import { ChartSelector } from './ChartSelector';
import { Graph } from '@/models/Graph';
import { GraphDuration } from '@/models/GraphDuration';
import { Set } from '@/models/Set';

type ChartListProps = {
    enabledGraphVms: GraphViewModel[];
};

const ChartList: React.FC<ChartListProps> = ({ enabledGraphVms }) => {
    // const fetchWorkoutData = async () => {
    //     try {
    //         const data = await Workout.getWorkoutsPerWeek(8);
    //         setWorkoutData(data);
    //     } catch (error) {
    //         console.error('Error fetching workout data:', error);
    //     }
    // };

    // const fetchGraphs = async () => {
    //     try {
    //         const allGraphs = await Graph.findAllAsViewModel();
    //         const enabledGraphs = allGraphs.filter(graph => graph.graph.enabled);
    //         setGraphVms(enabledGraphs);

    //         const initialSelectedGraphs = enabledGraphs.reduce((acc, graphVm) => {
    //             acc[graphVm.graph.id] = true;
    //             return acc;
    //         }, {} as { [key: number]: boolean });

    //         setSelectedGraphs(initialSelectedGraphs);
    //     } catch (error) {
    //         console.error('Error fetching graphs:', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchWorkoutData();
    //     fetchGraphs();
    // }, []);

    // useEffect(() => {
    //     const loadGraphData = async () => {
    //         try {
    //             const dataPromises = enabledGraphVms.map(async (graphVm) => {
    //                 if (graphVm.graphType.id === 1) {
    //                     const duration = await GraphDuration.findById(graphVm.graphDuration.id);
    //                     const chartData = await Set.getEstimated1RM(graphVm.exercise.id, duration.value);
    //                     return { id: graphVm.graph.id, data: chartData };
    //                 }
    //                 return { id: graphVm.graph.id, data: null };
    //             });

    //             const results = await Promise.all(dataPromises);
    //             const dataMap = results.reduce((acc, { id, data }) => {
    //                 acc[id] = data;
    //                 return acc;
    //             }, {} as { [key: string]: ChartDataset | null });

    //             setGraphData(dataMap);
    //         } catch (error) {
    //             console.error('Error loading graph data:', error);
    //         }
    //     };

    //     if (enabledGraphVms.length > 0) {
    //         loadGraphData();
    //     }
    // }, [enabledGraphVms]);

    // const toggleGraphVisibility = (id: number) => {
    //     setSelectedGraphs(prevState => {
    //         const updatedState = { ...prevState, [id]: !prevState[id] };
    //         return updatedState;
    //     });
    // };

    return (
        <View style={styles.container}>
            {/* {workoutData && <WorkoutBarChart workoutWeekData={workoutData} />} */}
            {enabledGraphVms.map(graphVm =>
                // selectedGraphs[graphVm.graph.id] && graphData[graphVm.graph.id] ? (
                //     <Chart key={graphVm.graph.id} data={graphData[graphVm.graph.id]!} title={graphVm.graphTitle} />
                // ) : null
                <Chart key={graphVm.graph.id} data={graphVm.data} title={graphVm.graphTitle} />
            )}
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
