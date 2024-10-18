import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { Equipment } from '@/models/Equipment';

interface EquipmentMultipleSelectListProps {
    onEquipmentSelected: (equipment: Equipment[]) => void;
}

export default function EquipmentMultipleSelectList({ onEquipmentSelected }: EquipmentMultipleSelectListProps) {
    const [data, setData] = useState<{ key: string, value: string }[]>([]);
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        Equipment.findAll().then((equipment) => {
            const formattedData = equipment.map(equipment => ({
                key: equipment.id.toString(),
                value: equipment.name
            }));
            setData(formattedData);
            setEquipments(equipment);
        });
    }, []);

    const handleSelection = (selectedKeys: string[]) => {
        const selectedEquipment = equipments.filter(equipment => selectedKeys.includes(equipment.name));
        onEquipmentSelected(selectedEquipment);
    }

    return (
        <View style={styles.container}>
            <MultipleSelectList
                setSelected={setSelected}
                onSelect={() => handleSelection(selected)}
                data={data}
                save="value"
                placeholder="Select Equipment"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
});
