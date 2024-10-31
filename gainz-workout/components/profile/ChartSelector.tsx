import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Graph } from '@/models/Graph';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export function ChartSelector(): JSX.Element {
    const [graphs, setGraphs] = useState<Graph[]>([]);
    const [selectedGraphs, setSelectedGraphs] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        async function fetchGraphs() {
            const allGraphs = await Graph.findAll();
            setGraphs(allGraphs);
            const initialSelectedGraphs = allGraphs.reduce((acc, graph) => {
                acc[graph.id] = graph.enabled;
                return acc;
            }, {} as { [key: number]: boolean });
            setSelectedGraphs(initialSelectedGraphs);
        }
        fetchGraphs();
    }, []);

    const toggleGraph = (id: number) => {
        setSelectedGraphs(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <View>
            <Text>ChartSelector</Text>
            {graphs.map(graph => (
                <View key={graph.id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={selectedGraphs[graph.id]}
                        onValueChange={() => toggleGraph(graph.id)}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
});