import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { Attachment } from '@/models/Attachment';
import { Colors } from '@/constants/Colors';
import { AppNavigatorParams } from '@/models/AppNavigatorParams';

type AttachmentSelectionRouteProp = RouteProp<AppNavigatorParams, 'AttachmentSelection'>;

export default function AttachmentSelection() {
  const route = useRoute<AttachmentSelectionRouteProp>();
  const navigation = useNavigation<NavigationProp<any>>();
  const { selectedExercise, selectedEquipment } = route.params;
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const data = await Attachment.findAll();
        setAttachments(data);
      } catch (error) {
        console.error('Error fetching attachments:', error);
      }
    };

    fetchAttachments();
  }, []);

  const handleAttachmentSelect = (attachment: Attachment) => {
    navigation.navigate('workout', {
      exercise: selectedExercise,
      equipment: selectedEquipment,
      attachment: attachment.name,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Attachment Selection</Text>
        {attachments.map((attachment, index) => (
          <TouchableOpacity key={index} style={styles.attachmentItem} onPress={() => handleAttachmentSelect(attachment)}>
            <Text style={styles.text}>{attachment.name}</Text>
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
  attachmentItem: {
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