import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { MuscleGroup } from '@/models/MuscleGroup';

interface MusclegroupSelectListProps {
    onMuscleGroupSelected: (muscleGroup: MuscleGroup) => void;
}

export default function MusclegroupSelectList({ onMuscleGroupSelected }: MusclegroupSelectListProps) {
    const [data, setData] = useState<{ key: string, value: string }[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

    useEffect(() => {
        MuscleGroup.findAll().then((musclegroups) => {
            const formattedData = musclegroups.map(musclegroup => ({
                key: musclegroup.id.toString(),
                value: musclegroup.name,
            }));
            setData(formattedData);
            setMuscleGroups(musclegroups);
        });
    }, []);

    const handleSelection = (selectedKey: string) => {
        const selectedMuscleGroup = muscleGroups.find(musclegroup => musclegroup.name === selectedKey);

        if (selectedMuscleGroup) {
            onMuscleGroupSelected(selectedMuscleGroup);
        }
    };

    return (
        <View style={styles.container}>
            <SelectList
                setSelected={handleSelection}
                data={data}
                save="value"
                placeholder="Select Muscle Group"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
});