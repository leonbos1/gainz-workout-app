import React, { useState, useEffect } from 'react';
import { Button, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Graph } from '@/models/Graph';
import { Exercise } from '@/models/Exercise';
import { GraphType } from '@/models/GraphType';
import { GraphDuration } from '@/models/GraphDuration';

const AddGraphForm: React.FC = () => {
    const [graphType, setGraphType] = useState<number | null>(null);
    const [exercise, setExercise] = useState<number | null>(null);
    const [enabled, setEnabled] = useState<boolean>(true);
    const [graphTypes, setGraphTypes] = useState<GraphType[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedGraphTypes = await GraphType.findAll();
            setGraphTypes(fetchedGraphTypes);

            const fetchedExercises = await Exercise.findAll();
            setExercises(fetchedExercises);
        };

        fetchData();
    }, []);

    const handleAddGraph = async () => {
        if (graphType !== null && exercise !== null) {
            await Graph.create(graphType, exercise, enabled);
            alert('Graph added successfully!');
        } else {
            alert('Please select a graph type and exercise.');
        }
    };

    return (
        <View>
            <Picker
                selectedValue={graphType}
                onValueChange={(itemValue: React.SetStateAction<number | null>) => setGraphType(itemValue)}
            >
                <Picker.Item label="Select Graph Type" value={null} />
                {graphTypes.map((type) => (
                    <Picker.Item key={type.id} label={type.name} value={type.id} />
                ))}
            </Picker>

            <Picker
                selectedValue={exercise}
                onValueChange={(itemValue: React.SetStateAction<number | null>) => setExercise(itemValue)}
            >
                <Picker.Item label="Select Exercise" value={null} />
                {exercises.map((ex) => (
                    <Picker.Item key={ex.id} label={ex.name} value={ex.id} />
                ))}
            </Picker>

            <Button title="Add Graph" onPress={handleAddGraph} />
        </View>
    );
};

export default AddGraphForm;