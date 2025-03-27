import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Exercise {
  label: string;
  value: string;
  muscleGroup: string;
  frequency: number;
}

interface ExerciseSelectModalProps {
  visible: boolean;
  exercises: Exercise[];
  onSelectExercise: (value: string) => void;
  onRequestClose: () => void;
}

export const ExerciseSelectModal: React.FC<ExerciseSelectModalProps> = ({
  visible,
  exercises,
  onSelectExercise,
  onRequestClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterMenuVisible, setFilterMenuVisible] = useState(false);
  const [isSortMenuVisible, setSortMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [sortOption, setSortOption] = useState<string | null>(null);

  // Dummy filter options – replace with your own values from the database.
  const filterOptions = ['Chest', 'Shoulders', 'Legs'];

  // Filter by search text and selected muscle group
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter
      ? exercise.muscleGroup.toLowerCase() === selectedFilter.toLowerCase()
      : true;
    return matchesSearch && matchesFilter;
  });

  // Sort the filtered exercises based on the chosen option
  const sortedExercises = [...filteredExercises].sort((a, b) => {
    if (sortOption === 'name-asc') {
      return a.label.localeCompare(b.label);
    } else if (sortOption === 'name-desc') {
      return b.label.localeCompare(a.label);
    } else if (sortOption === 'frequency') {
      return b.frequency - a.frequency;
    }
    return 0;
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Icon Row */}
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFilterMenuVisible(!isFilterMenuVisible)}
            >
              <FontAwesome name="filter" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setSortMenuVisible(!isSortMenuVisible)}
            >
              <FontAwesome name="sort-amount-desc" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Filter Menu (small dropdown near filter button) */}
          {isFilterMenuVisible && (
            <View style={styles.filterMenu}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterOptionBox,
                    selectedFilter === option && styles.filterOptionBoxSelected,
                  ]}
                  onPress={() => {
                    // Toggle selection: deselect if tapped again
                    setSelectedFilter(selectedFilter === option ? '' : option);
                    setFilterMenuVisible(false);
                  }}
                >
                  <Text style={styles.filterOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Sort Menu (small dropdown anchored near sort button) */}
          {isSortMenuVisible && (
            <View style={styles.sortMenu}>
              <TouchableOpacity
                style={styles.sortOptionButton}
                onPress={() => {
                  setSortOption('name-asc');
                  setSortMenuVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Name (A–Z)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOptionButton}
                onPress={() => {
                  setSortOption('name-desc');
                  setSortMenuVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Name (Z–A)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOptionButton}
                onPress={() => {
                  setSortOption('frequency');
                  setSortMenuVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Frequency</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search exercise"
              placeholderTextColor={Colors.text}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Exercises List */}
          <FlatList
            data={sortedExercises}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => onSelectExercise(item.value)}
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
  filterMenu: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: Colors.card,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    elevation: 5,
  },
  filterOptionBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 5,
    marginRight: 8,
  },
  filterOptionBoxSelected: {
    backgroundColor: Colors.text,
  },
  filterOptionText: {
    color: Colors.text,
  },
  sortMenu: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: Colors.card,
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  sortOptionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: Colors.text,
    textAlign: 'center',
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

export default ExerciseSelectModal;
