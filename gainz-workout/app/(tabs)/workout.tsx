import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Modal, TouchableOpacity } from 'react-native';
import { Exercise } from '@/models/Exercise';
import { Workout } from '@/models/Workout';
import { Set } from '@/models/Set';
import { StartWorkoutButton } from '@/components/workout/StartWorkoutButton';
import { BatchList } from '@/components/workout/BatchList';
import { Colors } from '@/constants/Colors';
import IconButton from '@/components/IconButton';
import { Equipment } from '@/models/Equipment';
import { Attachment } from '@/models/Attachment';
import { getExerciseNameFromExerciseString } from '@/helpers/csvHelper';
import { ExerciseSelectList } from '@/components/selectors/ExerciseSelectList';
import { EquipmentDropdown } from '@/components/workout/EquipmentDropdown';
import { AttachmentDropdown } from '@/components/workout/AttachmentDropdown';
import { Batch } from '@/models/Batch';

const screenWidth = Dimensions.get('window').width;

export default function WorkoutScreen() {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [batches, setBatches] = useState<Array<{ id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string }>>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Array<Exercise>>([]);
  const [equipment, setEquipment] = useState<Array<Equipment>>([]);
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Array<Equipment>>([]);
  const [filteredAttachments, setFilteredAttachments] = useState<Array<Attachment>>([]);

  useEffect(() => {
    fetchExercises();
    fetchEquipment();
    fetchAttachments();
  }, []);

  const fetchExercises = async () => {
    try {
      const fetchedExercises = await Exercise.findAll();
      setExercises(fetchedExercises);
    } catch (error) {
      Logger.log_error('Error fetching exercises:', error as string);
    }
  };

  const fetchEquipment = async () => {
    try {
      const fetchedEquipment = await Equipment.findAll();
      setEquipment(fetchedEquipment);
    } catch (error) {
      Logger.log_error('Error fetching equipment:', error as string);
    }
  };

  const fetchAttachments = async () => {
    try {
      const fetchedAttachments = await Attachment.findAll();
      setAttachments(fetchedAttachments);
    } catch (error) {
      Logger.log_error('Error fetching attachments:', error as string);
    }
  };

  const handleStartWorkout = async () => {
    try {
      const newWorkout = await Workout.create(new Date().toISOString(), '');
      setWorkoutId(newWorkout.id);
      setWorkoutStarted(true);
    } catch (error) {
      Logger.log_error('Error starting workout:', error as string);
    }
  };

  const handleEndWorkout = async () => {
    try {
      await Workout.endWorkout(workoutId!, new Date().toISOString());
      resetWorkoutState();
    } catch (error) {
      Logger.log_error('Error ending workout:', error as string);
    }
  };

  const handleCancelWorkout = async () => {
    try {
      await Workout.delete(workoutId!);
      resetWorkoutState();
    } catch (error) {
      Logger.log_error('Error canceling workout:', error as string);
    }
  };

  const resetWorkoutState = () => {
    setWorkoutId(null);
    setWorkoutStarted(false);
    setBatches([]);
  };

  const handleAddSet = async (batchId: number) => {
    console
    const batch = batches.find(b => b.id === batchId);
    const exerciseName = getExerciseNameFromExerciseString(batch!.name);

    const exerciseId = await Exercise.findIdByName(exerciseName);

    if (batch && exerciseId !== null) {
      try {
        const newSet = await Set.create(
          exerciseId,
          parseInt(batch.reps),
          parseFloat(batch.weight),
          parseFloat(batch.rpe),
          batchId
        );

        updateBatch(batchId, { sets: [...batch.sets, newSet], reps: '', weight: '', rpe: '' });
      } catch (error) {
        Logger.log_error('Error adding set:', error as string);
      }
    }
  };

  const handleAddExercise = async () => {
    if (selectedExercise && selectedEquipment) {
      var newBatch: Batch;
      if (selectedAttachment) {
        newBatch = await Batch.create(workoutId!, '', parseInt(selectedEquipment), parseInt(selectedAttachment));
      }
      else {
        newBatch = await Batch.create(workoutId!, '', parseInt(selectedEquipment));
      }
      setBatches([...batches, {
        id: newBatch.id, name: exercises.find(e => e.id === parseInt(selectedExercise))!.name + ' (' + equipment.find(e => e.id === parseInt(selectedEquipment))!.name + ')',
        sets: [], reps: '', weight: '', rpe: ''
      }]);
      toggleFormVisibility(null);
    } else {
      Logger.log_error('Error adding exercise:', 'Exercise and equipment must be selected');
    }
  }

  const handleExerciseSelection = async (exerciseId: string) => {
    const exerciseName = getExerciseNameFromExerciseString(exerciseId);

    setSelectedExercise(exerciseName);
    try {
      if (exerciseId) {
        const relatedEquipment = await Exercise.getEquipmentsForExercise(parseInt(exerciseId));
        setFilteredEquipment(relatedEquipment);
      } else {
        setFilteredEquipment([]);
      }
    } catch (error) {
      Logger.log_error('Error fetching equipment for exercise:', error as string);
      setFilteredEquipment([]);
    }
  };

  const updateBatch = (batchId: number, updatedFields: Partial<typeof batches[0]>) => {
    setBatches(batches.map(b => (b.id === batchId ? { ...b, ...updatedFields } : b)));
  };

  const handleInputChange = (batchId: number, field: string, value: string) => {
    updateBatch(batchId, { [field]: value });
  };

  const handleFinishExercise = (batchId: number) => {
    updateBatch(batchId, { sets: [], reps: '', weight: '', rpe: '' });
  };

  const toggleFormVisibility = (formName: string | null) => {
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

  const handleExerciseWrapper = (exerciseId: string | null) => {
    if (exerciseId) {
      handleExerciseSelection(exerciseId);
    } else {
      setSelectedExercise(null);
      setFilteredEquipment([]);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Workout</Text>
      </View>
      <Modal
        visible={activeForm !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => toggleFormVisibility(null)}
      >
        <View style={styles.popOverContainer}>
          <ExerciseSelectList
            selectedExercise={selectedExercise}
            setSelectedExercise={handleExerciseWrapper}
            exercises={exercises}
          />
          {selectedExercise && (
            <EquipmentDropdown
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment}
              equipment={filteredEquipment}
              addEquipment={() => { }}
            />
          )}
          {selectedEquipment &&
            equipment.find(e => e.id === parseInt(selectedEquipment))?.name === 'Cable' && (
              <AttachmentDropdown
                selectedAttachment={selectedAttachment}
                setSelectedAttachment={setSelectedAttachment}
                attachments={attachments}
                addAttachment={() => { }}
              />
            )}
          <View style={styles.buttonContainer}>
            <IconButton iconName="close-circle-outline" text="Close" onPress={() => toggleFormVisibility(null)} />
            <IconButton iconName="checkmark-circle-outline" text="Add" onPress={() => handleAddExercise()} />
          </View>
        </View>
      </Modal>
      {!workoutStarted ? (
        <StartWorkoutButton onStartWorkout={handleStartWorkout} />
      ) : (
        <>
          <BatchList
            batches={batches}
            onAddSet={handleAddSet}
            onInputChange={handleInputChange}
            onFinishExercise={handleFinishExercise}
          />
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => toggleFormVisibility('AddExerciseForm')}
          >
            <Text style={styles.floatingButtonText}>+</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <IconButton iconName="close-circle-outline" text="Cancel" onPress={() => handleCancelWorkout()} />
            <IconButton iconName="checkmark-circle-outline" text="Finish" onPress={() => handleEndWorkout()} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 40,
    backgroundColor: Colors.light.background,
    width: screenWidth,
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  popOverContainer: {
    padding: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 5,
    margin: 20,
  },
});
