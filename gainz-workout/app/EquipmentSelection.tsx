import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link, useRoute, RouteProp } from '@react-navigation/native';
import { AppNavigatorParams } from '@/models/AppNavigatorParams';
import { Equipment } from '@/models/Equipment';
import { Colors } from '@/constants/Colors';

type EquipmentSelectionRouteProp = RouteProp<AppNavigatorParams, 'EquipmentSelection'>;

export default function EquipmentSelection() {
  // const route = useRoute<EquipmentSelectionRouteProp>();
  // const { selectedExercise } = route.params;
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const selectedExercise = 'selectedExercise';

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const data = await Equipment.findAll();
        setEquipments(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchEquipments();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Equipment Selection</Text>
        {equipments.map((equipment, index) => (
          <Link
            key={index}
            to='/AttachmentSelection?selectedExercise=selectedExercise&selectedEquipment=equipment'
            style={styles.equipmentItem}
          >
            <Text style={styles.text}>{equipment.name}</Text>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  equipmentItem: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: Colors.light.text,
  },
});
