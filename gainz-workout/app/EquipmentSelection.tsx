import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { Equipment } from '@/models/Equipment';
import { Exercise } from '@/models/Exercise';

interface RouteParams {
  selectedExercise: Exercise;
  equipment: string;
}

type EquipmentSelectionRouteProp = RouteProp<{ params: RouteParams }, 'params'>;

export default function EquipmentSelection() {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<EquipmentSelectionRouteProp>();

  const { selectedExercise, equipment: equipmentString } = route.params;

  const [relevantEquipment, setRelevantEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Equipment Selection',
    });
    const parsedEquipment: Equipment[] = JSON.parse(equipmentString);
    setRelevantEquipment(parsedEquipment);
  }, [equipmentString]);

  const handleEquipmentSelect = (equip: Equipment) => {
    if (equip.name === 'Cable') {
      navigation.navigate('AttachmentSelection', {
        exercise: selectedExercise,
        equipment: equip.name,
      });
    } else {
      navigation.navigate('workout', {
        exercise: selectedExercise,
        equipment: equip.name,
        attachment: '',
      });
    }
  };

  return (
    <View style={styles.container}>
      {selectedExercise && (
        <Text style={styles.title}>Select Equipment for {selectedExercise.name}</Text>
      )}
      <ScrollView>
        {relevantEquipment.map((equip, index) => (
          <TouchableOpacity
            key={index}
            style={styles.equipmentItem}
            onPress={() => handleEquipmentSelect(equip)}
          >
            <Text style={styles.text}>{equip.name}</Text>
          </TouchableOpacity>
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
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: Colors.light.text,
  },
});
