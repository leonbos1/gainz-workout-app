import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Animated, TouchableOpacity, Modal } from 'react-native';
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
import { Entypo } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WorkoutScreen() {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Array<Exercise>>([]);
  const [equipment, setEquipment] = useState<Array<Equipment>>([]);
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [batches, setBatches] = useState<Array<{ id: number, name: string, sets: Set[], reps: string, weight: string, rpe: string, completed: boolean }>>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Array<Equipment>>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showStopwatchScreen, setShowStopWatchScreen] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);

  const popOverAnimationValue = useRef(new Animated.Value(0)).current;
  // Initialize the stopwatch screen off-screen (above the view)
  const stopwatchSlideAnimation = useRef(new Animated.Value(-screenHeight)).current;
  const workoutSlideAnimation = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    fetchExercises();
    fetchEquipment();
    fetchAttachments();
  }, []);

  useEffect(() => {
    if (activeForm) {
      Animated.timing(popOverAnimationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(popOverAnimationValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [activeForm]);

  // Animate stopwatch screen sliding down/up based on showStopwatchScreen
  useEffect(() => {
    Animated.timing(stopwatchSlideAnimation, {
      toValue: showStopwatchScreen ? 0 : -screenHeight,
      duration: showStopwatchScreen ? 500 : 300,
      useNativeDriver: false,
    }).start();
  }, [showStopwatchScreen]);

  useEffect(() => {
    if (workoutStarted) {
      Animated.sequence([
        Animated.timing(workoutSlideAnimation, {
          toValue: 1000,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.timing(workoutSlideAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.timing(workoutSlideAnimation, {
        toValue: 10000,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [workoutStarted]);

  // Stopwatch timer now runs based on workoutStarted instead of showStopwatchScreen.
  // This makes sure that the stopwatch continues running even if the stopwatch screen is hidden.
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (workoutStarted) {
      // Reset stopwatch when the workout starts
      setStopwatchTime(0);
      interval = setInterval(() => {
        setStopwatchTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [workoutStarted]);

  // Format the stopwatch time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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

  const resetSelections = () => {
    setSelectedAttachment(null);
    setSelectedEquipment(null);
    setSelectedExercise(null);
  };

  const handleStartWorkout = async () => {
    try {
      const newWorkout = await Workout.create(new Date().toISOString(), '');
      setWorkoutId(newWorkout.id);
      setWorkoutStarted(true);
      resetSelections();
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const handleFinishWorkout = async () => {
    setShowFinishModal(false);
    await Workout.endWorkout(workoutId!, new Date().toISOString());
    resetWorkoutState();
    setWorkoutStarted(false);
    resetSelections();
  };

  const handleCancelWorkout = () => {
    setShowCancelModal(false);
    setWorkoutStarted(false);
    resetWorkoutState();
    resetSelections();
  };

  const resetWorkoutState = () => {
    setWorkoutId(null);
    setWorkoutStarted(false);
    setBatches([]);
  };

  const handleAddSet = async (batchId: number, completed: boolean) => {
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
          batchId,
          completed
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
        newBatch = await Batch.create(workoutId!, '', parseInt(selectedEquipment), parseInt(selectedAttachment), false);
      } else {
        newBatch = await Batch.create(workoutId!, '', parseInt(selectedEquipment), 0, false);
      }
      setBatches([
        ...batches,
        {
          id: newBatch.id,
          name:
            exercises.find(e => e.id === parseInt(selectedExercise))!.name +
            ' (' +
            equipment.find(e => e.id === parseInt(selectedEquipment))!.name +
            ')',
          sets: [],
          reps: '',
          weight: '',
          rpe: '',
          completed: false,
        },
      ]);
      toggleFormVisibility(null);
    } else {
      Logger.log_error('Error adding exercise:', 'Exercise and equipment must be selected');
    }
    resetSelections();
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

  const handleFinishExercise = async (batchId: number) => {
    await Batch.toggleCompletion(batchId);
  };

  const onToggleSetCompletion = async (setId: number) => {
    console.log("toggle set completion set id: ", setId);
    await Set.toggleCompletion(setId);
  };

  const [showForm, setShowForm] = useState(false);

  const toggleFormVisibility = (formName: string | null) => {
    if (formName) {
      setShowForm(true);
      setActiveForm(formName);
    } else {
      Animated.timing(popOverAnimationValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setShowForm(false);
        setActiveForm(null);
      });
    }
  };

  const handleExerciseWrapper = (exerciseId: string | null) => {
    if (exerciseId) {
      handleExerciseSelection(exerciseId);
    } else {
      setSelectedExercise(null);
      setFilteredEquipment([]);
    }
  };

  // When the stopwatch header is pressed, show the stopwatch screen by sliding it down.
  const handleStopwatchOnPress = () => {
    setShowStopWatchScreen(true);
  };

  const popOverHeight = popOverAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  const popOverOpacity = popOverAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Workout</Text>
      </View>

      {/* Cancel Workout Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to cancel the workout?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowCancelModal(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleCancelWorkout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Finish Workout Modal */}
      <Modal
        visible={showFinishModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFinishModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to finish the workout?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowFinishModal(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleFinishWorkout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StartWorkoutButton onStartWorkout={handleStartWorkout} />

      {workoutStarted && (
        <Animated.View style={[styles.workoutScreen, { transform: [{ translateY: workoutSlideAnimation }] }]}>
          <TouchableOpacity onPress={handleStopwatchOnPress}>
            <View style={styles.workoutHeader}>
              <Entypo name="stopwatch" size={24} color="white" />
              <Text>{formatTime(stopwatchTime)}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.workoutContainer}>
            {showForm && (
              <Animated.View style={[styles.popOverContainer, { height: popOverHeight, opacity: popOverOpacity }]}>
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
                  />
                )}
                {selectedEquipment &&
                  equipment.find(e => e.id === parseInt(selectedEquipment))?.name === 'Cable' && (
                    <AttachmentDropdown
                      selectedAttachment={selectedAttachment}
                      setSelectedAttachment={setSelectedAttachment}
                      attachments={attachments}
                    />
                  )}
                <View style={styles.buttonContainer}>
                  <IconButton iconName="close-circle-outline" text="Close" onPress={() => toggleFormVisibility(null)} />
                  <IconButton iconName="checkmark-circle-outline" text="Add" onPress={() => handleAddExercise()} />
                </View>
              </Animated.View>
            )}

            <BatchList
              batches={batches}
              onAddSet={handleAddSet}
              onInputChange={handleInputChange}
              onFinishExercise={handleFinishExercise}
              onToggleSetCompletion={onToggleSetCompletion}
              updateBatch={updateBatch}
            />

            <View style={styles.buttonContainer}>
              <IconButton iconName="close-circle-outline" text="Cancel" onPress={() => setShowCancelModal(true)} />
              <IconButton iconName="checkmark-circle-outline" text="Finish" onPress={() => setShowFinishModal(true)} />
            </View>
            {!activeForm && (
              <TouchableOpacity style={styles.floatingButton} onPress={() => toggleFormVisibility('AddExerciseForm')}>
                <Text style={styles.floatingButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
          <Animated.View style={[styles.stopwatchScreen, { transform: [{ translateY: stopwatchSlideAnimation }] }]}>
            <View>
              <Text style={styles.stopwatchText}>{formatTime(stopwatchTime)}</Text>
              <TouchableOpacity onPress={() => setShowStopWatchScreen(false)}>
                <Text style={{ color: Colors.white }}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 50,
    right: 15,
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: Colors.background,
    width: screenWidth,
    height: '100%',
    alignItems: 'center',
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
    color: Colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  popOverContainer: {
    padding: 20,
    backgroundColor: Colors.card,
    borderRadius: 5,
    margin: 20,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    color: Colors.text,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutScreen: {
    position: 'absolute',
    height: screenHeight,
    width: '100%',
    backgroundColor: Colors.background,
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 6,
    paddingBottom: 100,
  },
  workoutContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: Colors.secundary,
    color: Colors.text,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  stopwatchScreen: {
    position: 'absolute',
    height: screenHeight,
    width: '100%',
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    paddingBottom: 100,
    zIndex: 2000,
  },
  stopwatchText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
});
