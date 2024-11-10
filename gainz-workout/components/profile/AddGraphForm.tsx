import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Graph } from '@/models/Graph';
import { Exercise } from '@/models/Exercise';
import { GraphType } from '@/models/GraphType';
import { GraphDuration } from '@/models/GraphDuration';
import { Colors } from '@/constants/Colors';

interface AddGraphFormProps {
    visible: boolean;
}

const AddGraphForm: React.FC<AddGraphFormProps> = ({ visible }) => {
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
            } else {
                alert('Please select a graph type, exercise, and time.');
            }
            alert('Graph added successfully!');
        } else {
            alert('Please select a graph type and exercise.');
        }
    };

    return (
        <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
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

            <Button title="Add Graph" onPress={handleAddGraph} color={Colors.light.secundary} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        margin: 15,
        width: '90%',
    },
    title: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    picker: {
        color: 'white',
        backgroundColor: '#444',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
});

export default AddGraphForm;
