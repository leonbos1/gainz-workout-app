import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Animated, Easing, Modal } from 'react-native';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import { seedDatabase, createTables } from '@/database/database';
import ChartList from '@/components/profile/ChartList';
import { ChartSelector } from '@/components/profile/ChartSelector';
import IconButton from '@/components/IconButton';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import { Graph } from '@/models/Graph';
import AddGraphForm from '@/components/profile/AddGraphForm';

const screenWidth = Dimensions.get('window').width;

export default function ProfileScreen() {
  const [isDataSeeded, setIsDataSeeded] = useState(false);
  const [enabledGraphVms, setEnabledGraphVms] = useState<GraphViewModel[]>([]);
  const [allChartVms, setAllChartVms] = useState<GraphViewModel[]>([]);
  const [isChartSelectorVisible, setIsChartSelectorVisible] = useState(false);
  const [chartSelectorHeight, setChartSelectorHeight] = useState(0);
  const [addGraphFormVisible, setAddGraphFormVisible] = useState(false);
    const [activeForm, setActiveForm] = useState<string | null>(null);

  const animationValue = useRef(new Animated.Value(0)).current;

  const seedData = async () => {
    await createTables();
    await seedDatabase();
    setIsDataSeeded(true);
  };

  const toggleFormVisibility = (formName: string | null) => {
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

  const fetchGraphs = useCallback(async () => {
    const allGraphsVms = await Graph.findAllAsViewModel();
    setAllChartVms(allGraphsVms);
    const enGraphsVms = allGraphsVms.filter((graphVm) => graphVm.graph.enabled);
    setEnabledGraphVms(enGraphsVms);
    setChartSelectorHeight(enGraphsVms.length * 50 + 200);
  }, []);

  const toggleGraphEnabled = async (id: number) => {
    const updatedGraphs = enabledGraphVms.map((g) => {
      if (g.graph.id === id) {
        g.graph.enabled = !g.graph.enabled;
      }
      return g;
    });
    setEnabledGraphVms(updatedGraphs);
    await Graph.updateEnabled(
      id,
      !enabledGraphVms.find((g) => g.graph.id === id)!.graph.enabled
    );
  };

  const toggleChartSelector = () => {
    if (isChartSelectorVisible) {
      // Collapse
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false, // Use false because we're animating height
      }).start(() => setIsChartSelectorVisible(false));
    } else {
      setIsChartSelectorVisible(true);
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    fetchGraphs();
    seedData();
  }, [fetchGraphs]);

  const chartSelectorStyle = {
    height: animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, chartSelectorHeight],
    }),
    opacity: animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  useEffect(() => {
    fetchGraphs();
    seedData();
  }, [fetchGraphs]);
  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Profile</Text>
        <TouchableOpacity>
          <Link href="../settings">
            <Ionicons
              name="settings-outline"
              size={25}
              color={Colors.light.text}
              style={{ marginLeft: 15 }}
            />
          </Link>
        </TouchableOpacity>
      </View>
      <Modal
        visible={activeForm !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => toggleFormVisibility(null)}
      >
        <View style={styles.popOverContainer}>
          {activeForm === 'AddGraphForm' && (
            <AddGraphForm
              toggleFormVisibility={() => toggleFormVisibility('AddGraphForm')}
            />
          )}
        </View>
      </Modal>
      <View>
        <TouchableOpacity onPress={toggleChartSelector}>
          <Ionicons
            name={isChartSelectorVisible ? "chevron-up-outline" : "chevron-down-outline"}
            size={25}
            color={Colors.light.text}
            style={{ marginLeft: 15 }}
          />
        </TouchableOpacity>
        <Animated.View style={[styles.animatedContainer, chartSelectorStyle]}>
          <ChartSelector
            enabledGraphVms={enabledGraphVms}
            setEnabledGraphVms={setEnabledGraphVms}
            toggleGraphEnabled={toggleGraphEnabled}
            allChartVms={allChartVms}
            setAllChartVms={setAllChartVms}
            toggleFormVisibility={toggleFormVisibility}
          />
        </Animated.View>
        <ChartList enabledGraphVms={enabledGraphVms} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 40,
    backgroundColor: Colors.light.background,
    width: screenWidth,
  },
  animatedContainer: {
    width: "100%",
    backgroundColor: Colors.light.background,
    padding: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  popOverContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  }
});
