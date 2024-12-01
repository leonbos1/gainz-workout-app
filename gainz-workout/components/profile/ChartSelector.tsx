import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Colors } from '@/constants/Colors';
import IconButton from '../IconButton';
import AddGraphForm from './AddGraphForm';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';

type GraphSelectorProps = {
    visible: boolean;
    graphVms: GraphViewModel[];
    selectedGraphs: { [key: number]: boolean };
    toggleGraphVisibility: (id: number) => void;
};

export function ChartSelector({ visible, graphVms, selectedGraphs, toggleGraphVisibility }: GraphSelectorProps) {
    const [addGraphFormVisible, setAddGraphFormVisible] = useState(false);

    console.log('graphVms:', graphVms);

    return (
        <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
            <Text style={styles.header}>Select Graphs</Text>
            <View style={styles.scrollViewContent}>
                {/* {graphVms.map(graphVm => (
                    <View key={graphVm.graph.id} style={styles.checkboxContainer}>
                        <CheckBox
                            value={selectedGraphs[graphVm.graph.id]}
                            onValueChange={() => toggleGraphVisibility(graphVm.graph.id)}
                            style={styles.checkBoxItem}
                        />
                        <Text style={styles.graphTitle}>{graphVm.graphTitle}</Text>
                    </View>
                ))} */}
            </View>
            <IconButton
                text="Add Chart"
                iconName="add-outline"
                onPress={() => setAddGraphFormVisible(!addGraphFormVisible)}
            />
            <AddGraphForm visible={addGraphFormVisible} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 20,
    },
    scrollViewContent: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: Colors.light.card,
        borderRadius: 10,
    },
    graphTitle: {
        fontSize: 18,
        color: Colors.light.text,
        marginLeft: 10,
    },
    checkBoxItem: {
        width: 24,
        height: 24,
    },
});
