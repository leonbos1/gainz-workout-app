import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface EquipmentDropdownProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;  // Updated type
    selectedEquipment: string | null;
    setSelectedEquipment: React.Dispatch<React.SetStateAction<string | null>>;  // Updated type
    Equipments: Array<{ label: string, value: string }>;
    addEquipment: () => void;
}

export const EquipmentDropdown: React.FC<EquipmentDropdownProps> = ({
    open,
    setOpen,
    selectedEquipment,
    setSelectedEquipment,
    Equipments,
    addEquipment,
}) => {
    return (
        <DropDownPicker
            open={open}
            value={selectedEquipment}
            items={Equipments}
            onChangeValue={addEquipment}
            setOpen={setOpen}
            setValue={setSelectedEquipment}
            searchable={true}
            placeholder="Select Equipment"
            style={styles.dropdown}
            textStyle={{ color: Colors.light.text }}
            dropDownContainerStyle={{ backgroundColor: Colors.light.card }}
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: Colors.light.card,
        color: Colors.light.text,
    },
});