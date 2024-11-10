import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Graph } from '@/models/Graph';
import { Colors } from '@/constants/Colors';
import IconButton from '../IconButton';
import AddGraphForm from './AddGraphForm';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type GraphSelectorProps = {
    visible: boolean;
};

export function ChartSelector({ visible }: GraphSelectorProps) {
    const [graphVms, setGraphs] = useState<GraphViewModel[]>([]);
    const [selectedGraphs, setSelectedGraphs] = useState<{ [key: number]: boolean }>({});
    const [addGraphFormVisible, setAddGraphFormVisible] = useState(false);

    useEffect(() => {
        async function fetchGraphs() {
            const allGraphsVms = await Graph.findAllAsViewModel();

            setGraphs(allGraphsVms);
            const initialSelectedGraphs = allGraphsVms.reduce((acc, graphVm) => {
                acc[graphVm.graph.id] = graphVm.graph.enabled;
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
            {graphVms.map(graphVm => (
                <View key={graphVm.graph.id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={selectedGraphs[graphVm.graph.id]}
                        onValueChange={() => toggleGraph(graphVm.graph.id)}
                        style={styles.checkBoxItem}
                    />
                    <Text style={styles.text}>{graphVm.graphTitle}</Text>
                </View>
            ))}
            <IconButton text='Add Chart' iconName='add-outline' onPress={() => setAddGraphFormVisible(!addGraphFormVisible)} />
            <AddGraphForm visible={addGraphFormVisible} />
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
    },
    checkBoxItem: {
    },
});