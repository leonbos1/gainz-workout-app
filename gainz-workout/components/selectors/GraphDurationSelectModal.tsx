import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface GraphDuration {
  label: string;
  value: string;
}

interface GraphDurationSelectModalProps {
  visible: boolean;
  graphDurations: GraphDuration[];
  onSelectGraphDuration: (value: string) => void;
  onRequestClose: () => void;
}

export const GraphDurationSelectModal: React.FC<GraphDurationSelectModalProps> = ({
  visible,
  graphDurations,
  onSelectGraphDuration,
  onRequestClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGraphDuration = graphDurations.filter((graphDuration) =>
    graphDuration.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          {/* Duration List */}
          <FlatList
            data={filteredGraphDuration}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => onSelectGraphDuration(item.value)}
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height: '80%',
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconButton: {
    padding: 10,
  },
  searchContainer: {
    marginBottom: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: Colors.text,
  },
  searchTextInput: {
    padding: 10,
    color: Colors.text,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card,
  },
  itemText: {
    color: Colors.text,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.card,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.text,
  },
});
