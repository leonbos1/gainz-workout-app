import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Graph } from '@/models/Graph';
import { Colors } from '@/constants/Colors';
import IconButton from '../IconButton';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type GraphSelectorProps = {
    visible: boolean;
};

export function ChartSelector({ visible }: GraphSelectorProps) {
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
        <View style={{ display: visible ? 'flex' : 'none' }}>
            <Text style={styles.text}>Select Graphs</Text>
            {graphs.map(graph => (
                <View key={graph.id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={selectedGraphs[graph.id]}
                        onValueChange={() => toggleGraph(graph.id)}
                    />
                </View>
            ))}
            <IconButton text='Add Graph' iconName='add-outline' onPress={() => { }} />
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: Colors.light.text,
    }
});