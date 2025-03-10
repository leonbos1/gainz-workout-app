import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Graph } from '@/models/Graph';
import { Exercise } from '@/models/Exercise';
import { GraphType } from '@/models/GraphType';
import { GraphDuration } from '@/models/GraphDuration';
import { Colors } from '@/constants/Colors';
import formProps from '@/app/props/formProps';


const AddGraphForm: React.FC<formProps> = ({ fetchGraphs, toggleFormVisibility }) => {
    const [graphType, setGraphType] = useState<number | null>(null);
    const [exercise, setExercise] = useState<number | null>(null);
    const [enabled, setEnabled] = useState<boolean>(true);
    const [graphTypes, setGraphTypes] = useState<GraphType[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [times, setTimes] = useState<GraphDuration[]>([]);
    const [time, setTime] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedGraphTypes = await GraphType.findAll();
            setGraphTypes(fetchedGraphTypes);

            const fetchedExercises = await Exercise.findAll();
            setExercises(fetchedExercises);

            const fetchedDurations = await GraphDuration.findAll();
            setTimes(fetchedDurations);
        };

        fetchData();
    }, []);

    const handleAddGraph = async () => {
        if (graphType !== null && exercise !== null) {
            if (graphType !== null && exercise !== null && time !== null) {
                await Graph.create(graphType, exercise, enabled, time);
                alert('Graph added successfully!');
                await fetchGraphs();
            } else {
                alert('Please select a graph type, exercise, and time.');
            }
            alert('Graph added successfully!');
            await fetchGraphs();
        } else {
            alert('Please select a graph type and exercise.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Graph</Text>

            <Picker
                style={styles.picker}
                selectedValue={graphType}
                onValueChange={(itemValue) => setGraphType(itemValue)}
            >
                <Picker.Item label="Select Graph Type" value={null} />
                {graphTypes.map((type) => (
                    // console.log(type),
                    <Picker.Item key={type.id} label={type.name} value={type.id} />
                ))}
            </Picker>

            <Picker
                style={styles.picker}
                selectedValue={exercise}
                onValueChange={(itemValue) => setExercise(itemValue)}
            >
                <Picker.Item label="Select Exercise" value={null} />
                {exercises.map((ex) => (
                    <Picker.Item key={ex.id} label={ex.name} value={ex.id} />
                ))}
            </Picker>

            <Picker
                style={styles.picker}
                selectedValue={time}
                onValueChange={(itemValue) => setTime(itemValue)}
            >
                <Picker.Item label="Select Time" value={null} />
                {times.map((ex) => (
                    <Picker.Item key={ex.id} label={ex.name} value={ex.id} />
                ))}
            </Picker>
            <View style={styles.btnContainer}>
                <View style={{ margin: 5, width: '50%' }}>
                    <Button title="Add Graph" onPress={handleAddGraph} color={Colors.secundary} />
                </View>
                <View style={{ margin: 5, width: '50%' }}>
                    <Button title="Close" onPress={() => toggleFormVisibility('AddGraphForm')} color={Colors.secundary} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    btnContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: Colors.card,
        padding: 20,
        borderRadius: 5,
        margin: 20,
        position: 'absolute',
        zIndex: 10000,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    picker: {
        color: 'white',
        backgroundColor: Colors.input,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
});

export default AddGraphForm;
