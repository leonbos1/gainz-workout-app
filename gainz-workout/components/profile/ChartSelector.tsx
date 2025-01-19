import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Colors } from '@/constants/Colors';
import IconButton from '../IconButton';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import AddGraphForm from './AddGraphForm';

type ChartSelectorProps = {
    enabledGraphVms: GraphViewModel[];
    setEnabledGraphVms: (enabledGraphVms: GraphViewModel[]) => void;
    toggleGraphEnabled: (id: number) => void;
    allChartVms: GraphViewModel[];
    setAllChartVms: (allChartVms: GraphViewModel[]) => void;
    toggleFormVisibility: (formName: string | null) => void;
};

export function ChartSelector({
    enabledGraphVms,
    setEnabledGraphVms,
    allChartVms,
    setAllChartVms,
    toggleFormVisibility,
}: ChartSelectorProps) {
    const enabledGraphIds = new Set(enabledGraphVms.map(vm => vm.graph.id));

    return (
        <View>
            <View style={styles.scrollView}>
                {allChartVms.map(graphVm => (
                    <View key={graphVm.graph.id} style={styles.checkboxContainer}>
                        <CheckBox
                            value={enabledGraphIds.has(graphVm.graph.id)}
                            onValueChange={() => {
                                const isCurrentlyEnabled = enabledGraphIds.has(graphVm.graph.id);
                                let updatedEnabledGraphs;

                                if (isCurrentlyEnabled) {
                                    updatedEnabledGraphs = enabledGraphVms.filter(
                                        g => g.graph.id !== graphVm.graph.id
                                    );
                                } else {
                                    updatedEnabledGraphs = [...enabledGraphVms, graphVm];
                                }

                                setEnabledGraphVms(updatedEnabledGraphs);
                            }}
                        />
                        <Text style={styles.graphTitle}>{graphVm.graphTitle}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <IconButton
                    text="Add Chart"
                    iconName="add-outline"
                    onPress={() => {
                        toggleFormVisibility('AddGraphForm');
                    }}
                    style={
                        styles.iconButton
                    }
                />
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 20,
    },
    scrollView: {
        width: '100%',
        marginVertical: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 5,
        width: '100%',
        backgroundColor: Colors.secundary,
        borderRadius: 5,
    },
    graphTitle: {
        fontSize: 16,
        color: Colors.text,
        flex: 1,
        marginLeft: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    iconButton: {
        width: '100%'
    }
});
