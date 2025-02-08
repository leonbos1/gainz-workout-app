import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Exercise } from '@/models/Exercise';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import IconButton from '../IconButton';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface ExerciseItemProps {
  exercise: Exercise;
  onDetails: (exercise: Exercise) => void;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
}

export default function ExerciseItem({
  exercise,
  onDetails,
  onEdit,
  onDelete,
}: ExerciseItemProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  const toggleActionMenu = () => {
    // Animate the next layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActionMenuVisible(!actionMenuVisible);
  };

  const handleDelete = () => {
    setIsModalVisible(false);
    onDelete(exercise);
  };

  return (
    <View style={styles.exerciseItem}>
      {/* Exercise Name and Description */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
        </View>
        <TouchableOpacity onPress={toggleActionMenu} style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Action Menu */}
      {actionMenuVisible && (
        <View style={styles.actionMenu}>
          <TouchableOpacity
            onPress={() => onDetails(exercise)}
            style={styles.actionMenuItem}
          >
            <Ionicons name="newspaper" size={20} color={Colors.white} />
            <Text style={styles.actionText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onEdit(exercise)}
            style={styles.actionMenuItem}
          >
            <Ionicons name="pencil" size={20} color={Colors.white} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={styles.actionMenuItem}
          >
            <Ionicons name="trash" size={20} color={Colors.white} />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this exercise?
            </Text>
            <View style={styles.modalButtonContainer}>
              <IconButton
                iconName="ban"
                text="Cancel"
                onPress={() => setIsModalVisible(false)}
              />
              <IconButton
                iconName="trash"
                text="Delete"
                onPress={handleDelete}
                style={styles.deleteButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseItem: {
    padding: 5,
    marginVertical: 8,
    backgroundColor: Colors.secundary,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  exerciseDescription: {
    fontSize: 14,
    color: Colors.text,
    marginVertical: 5,
  },
  menuButton: {
    padding: 8,
    backgroundColor: Colors.secundary,
    borderRadius: 8,
  },
  actionMenu: {
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  actionMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: 320,
    padding: 25,
    backgroundColor: Colors.card,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: Colors.red,
  },
});
