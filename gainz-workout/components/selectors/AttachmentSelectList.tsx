import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SearchInput } from '../SearchSelectList';

interface AttachmentSelectListProps {
  selectedAttachment: string | null;
  setSelectedAttachment: (exercise: string | null) => void;
  attachments: Array<{ label: string, value: string }>;
}

export const AttachmentSelectList: React.FC<AttachmentSelectListProps> = ({
  selectedAttachment,
  setSelectedAttachment,
  attachments,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAttachment = (value: string) => {
    setSelectedAttachment(value);
    setModalVisible(false);
  };

  const filteredAttachments = attachments.filter((eq) =>
    eq.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>
          {selectedAttachment
            ? attachments.find(at => at.value === selectedAttachment)?.label
            : 'Select an equipment'}
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
            <SearchInput
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              placeholder="Search for attachment..."
            />

            <FlatList
              data={filteredAttachments}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleSelectAttachment(item.value)}>
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
  searchContainer: {
    marginBottom: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: Colors.light.text,
    color: Colors.light.text,
  },
  searchTextInput: {
    padding: 10,
    color: Colors.light.text,
  },
});
