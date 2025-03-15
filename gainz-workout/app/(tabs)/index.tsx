import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { seedDatabase, createTables } from '@/database/database';
import ChartList from '@/components/profile/ChartList';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import { Graph } from '@/models/Graph';
import { Dashboard } from '@/components/profile/Dashboard';
import { ExerciseSelectList } from '@/components/selectors/ExerciseSelectList';
import { Exercise } from '@/models/Exercise';
import { ExerciseSelectModal } from '@/components/selectors/ExerciseSelectModal';
import { GraphDurationSelectModal } from '@/components/selectors/GraphDurationSelectModal';
import { GraphDuration } from '@/models/GraphDuration';

export default function ProfileScreen() {
  const [isDataSeeded, setIsDataSeeded] = useState(false);
  const [enabledGraphVms, setEnabledGraphVms] = useState<GraphViewModel[]>([]);
  const [allChartVms, setAllChartVms] = useState<GraphViewModel[]>([]);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Array<Exercise>>([]);
  const [graphDurations, setGraphDurations] = useState<Array<GraphDuration>>([]);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [graphDurationModalVisible, setGraphDurationModalVisible] = useState(false);

  const screenHeight = Dimensions.get('window').height;
  const widgetHeight = screenHeight / 3;
  const addWidgetAnimation = useRef(new Animated.Value(widgetHeight)).current;

  const seedData = async () => {
    await createTables();
    await seedDatabase();
    setIsDataSeeded(true);
  };

  const fetchExercises = async () => {
    try {
      const fetchedExercises = await Exercise.findAll();
      setExercises(fetchedExercises);
    } catch (error) {
      Logger.log_error('Error fetching exercises:', error as string);
    }
  };

  const fetchGraphDurations = async () => {
    try {
      const fetchedDurations = await GraphDuration.findAll();
      setGraphDurations(fetchedDurations);
    } catch (error) {
      Logger.log_error('Error fetching :', error as string);
    }
  };

  const fetchGraphs = useCallback(async () => {
    const allGraphsVms = await Graph.findAllAsViewModel();
    setAllChartVms(allGraphsVms);
    const enGraphsVms = allGraphsVms.filter((graphVm) => graphVm.graph.enabled);
    setEnabledGraphVms(enGraphsVms);
  }, []);

  useEffect(() => {
    seedData();
    fetchGraphs();
    fetchExercises();
    fetchGraphDurations();
  }, [fetchGraphs]);

  const toggleAddWidget = () => {
    if (showAddWidget) {
      Animated.timing(addWidgetAnimation, {
        toValue: widgetHeight,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setShowAddWidget(false));
    } else {
      setShowAddWidget(true);
      Animated.timing(addWidgetAnimation, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  };

  const onOptionPress = (option: number) => {
    setExerciseModalVisible(true);
  };

  const handleSelectExercise = (value: string) => {
    setSelectedExercise(value);
    setExerciseModalVisible(false);
    setGraphDurationModalVisible(true);
  };

  const handleSelectGraphDuration = (value: string) => {
    setGraphDurationModalVisible(false);
    addGraph();
  }

  const addGraph = () => {
    console.log("Adding graph!");
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Profile</Text>
        <TouchableOpacity>
          <Link href="../settings">
            <Ionicons name="settings-outline" size={25} color={Colors.text} />
          </Link>
        </TouchableOpacity>
      </View>

      <View style={styles.dashboardContainer}>
        <Dashboard onAddPress={toggleAddWidget} />
      </View>

      <View style={styles.chartListContainer}>
        <ChartList enabledGraphVms={enabledGraphVms} />
      </View>

      {showAddWidget && (
        <>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.overlay}
            onPress={toggleAddWidget}
          />
          <Animated.View
            style={[
              styles.addWidgetContainer,
              { transform: [{ translateY: addWidgetAnimation }] },
            ]}
          >
            <Text style={styles.addWidgetHeader}>Add widget</Text>
            <TouchableOpacity
              onPress={() => onOptionPress(1)}
              style={styles.optionButton}
            >
              <Text style={styles.optionText}>Add 1 rep max prediction</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onOptionPress(2)}
              style={styles.optionButton}
            >
              <Text style={styles.optionText}>Add Volume</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onOptionPress(3)}
              style={styles.optionButton}
            >
              <Text style={styles.optionText}>Add Intensity</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
      <ExerciseSelectModal
        visible={exerciseModalVisible}
        exercises={exercises}
        onSelectExercise={handleSelectExercise}
        onRequestClose={() => setExerciseModalVisible(false)}
      />
      {/* <GraphDurationSelectModal
        visible={graphDurationModalVisible}
        graphDurations={graphDurations}
        onSelectGraphDuration={handleSelectGraphDuration}
        onRequestClose={() => setExerciseModalVisible(false)}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  collapsedContainer: {
    marginTop: 15,
    backgroundColor: Colors.card,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '90%',
    alignSelf: 'center',
  },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  animatedContainer: {
    width: '100%',
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 10,
    overflow: 'hidden',
    height: '100%',
  },
  chartListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dashboardContainer: {
    flexDirection: 'row',
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  addWidgetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height / 3,
    backgroundColor: Colors.card,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
  },
  addWidgetHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.text,
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
});
