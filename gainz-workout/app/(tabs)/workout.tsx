import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Modal } from 'react-native';
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
import { ExerciseDropdown } from '@/components/workout/ExerciseDropdown';
import { EquipmentDropdown } from '@/components/workout/EquipmentDropdown';
import { AttachmentDropdown } from '@/components/workout/AttachmentDropdown';

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
          <ExerciseDropdown
            selectedExercise={selectedExercise}
            setSelectedExercise={handleExerciseWrapper}
            exercises={exercises}
            addExercise={() => { }}
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
            <IconButton iconName="checkmark-circle-outline" text="Add" onPress={() => toggleFormVisibility(null)} />
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
          <View style={styles.buttonContainer}>
            <IconButton iconName="add-circle-outline" text="Exercise" onPress={() => toggleFormVisibility('AddExerciseForm')} />
          </View>
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
