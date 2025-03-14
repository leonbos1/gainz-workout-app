import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Exercise } from '@/models/Exercise';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { MuscleGroup } from '@/models/MuscleGroup';

interface ExerciseItemProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
}

export default function ExerciseItem({ exercise }: ExerciseItemProps) {
  const router = useRouter();
  const [musclegroup, setMusclegroup] = useState<MuscleGroup | null>(null);

  useEffect(() => {
    fetchMusclegroup();
  }, []);

  const fetchMusclegroup = async () => {
    try {
      if (exercise == null || exercise.musclegroupid == null) {
        return;
      }
      const mg = await MuscleGroup.findById(exercise.musclegroupid);
      setMusclegroup(mg);
    }
    catch (error) {
      console.error('Error fetching musclegroup:', error);
    }
  }

  const handleDetails = (exercise: Exercise) => {
    router.navigate(`../exercises/${exercise.id.toString()}`);
  };

  return (
    <View style={styles.exerciseItem}>
      {/* Exercise Name and Description */}
      <TouchableOpacity onPress={() => handleDetails(exercise)} style={styles.menuButton}>
        <View style={styles.headerContainer}>
          <View style={styles.exerciseView}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.muscleGroupName}>{musclegroup?.name}</Text>

          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseView: {
    marginLeft: 10,
  },
  exerciseItem: {
    padding: 5,
    marginVertical: 8,
    // backgroundColor: Colors.primary,
    borderRadius: 6,
    zIndex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  muscleGroupName: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.text,
  },
  exerciseDescription: {
    fontSize: 14,
    color: Colors.text,
    marginVertical: 5,
  },
  menuButton: {
    padding: 8,
  },
  actionMenu: {
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
