import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, FlatList } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Attachment } from '@/models/Attachment';
import { Equipment } from '@/models/Equipment';

interface EquipmentDropdownProps {
    selectedEquipment: string | null;
    setSelectedEquipment: React.Dispatch<React.SetStateAction<string | null>>;
    equipment: Equipment[];
    addEquipment: () => void;
}

export const EquipmentDropdown: React.FC<EquipmentDropdownProps> = ({
    selectedEquipment,
    setSelectedEquipment,
    equipment,
    addEquipment,
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelectEquipment = (value: string) => {
        setSelectedEquipment(value);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
                <Text style={styles.dropdownText}>
                    {selectedEquipment ? equipment.find(ex => ex.value === selectedEquipment)?.label : 'Select an equipment'}
                </Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={equipment}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.item} onPress={() => handleSelectEquipment(item.value)}>
                                    <Text style={styles.itemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: Colors.light.card,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.light.card,
    },
    dropdownText: {
        color: Colors.light.text,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        height: '80%',
        backgroundColor: Colors.light.card,
        padding: 20,
        borderRadius: 10,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.card,
    },
    itemText: {
        color: Colors.light.text,
    },
    addButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: Colors.light.primary,
        color: Colors.light.text,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: Colors.light.text,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: Colors.light.card,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: Colors.light.text,
    },
});

