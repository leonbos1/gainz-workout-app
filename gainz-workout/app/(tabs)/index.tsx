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

  const fetchGraphs = useCallback(async () => {
    const allGraphsVms = await Graph.findAllAsViewModel();
    setAllChartVms(allGraphsVms);
    const enGraphsVms = allGraphsVms.filter((graphVm) => graphVm.graph.enabled);
    setEnabledGraphVms(enGraphsVms);
    setChartSelectorHeight(enGraphsVms.length * 50 + 200);
  }, []);

  useEffect(() => {
    seedData();
    fetchGraphs();
  }, [fetchGraphs]);

  const toggleChartSelector = () => {
    if (isChartSelectorVisible) {
      // Collapse
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
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

  const rotationStyle = {
    transform: [
      {
        rotate: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

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

  const toggleFormVisibility = (formName: string | null) => {
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

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

      <View>
        <View style={styles.collapsedContainer}>
          <TouchableOpacity onPress={toggleChartSelector} style={styles.dropdownToggle}>
            <Text style={styles.dropdownLabel}>
              {isChartSelectorVisible ? 'Hide Chart Selector' : 'Show Chart Selector'}
            </Text>
            <Animated.View style={rotationStyle}>
              <Ionicons name="chevron-down-outline" size={20} color={Colors.text} />
            </Animated.View>
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.animatedContainer, chartSelectorStyle]}>
          <ChartSelector
            enabledGraphVms={enabledGraphVms}
            setEnabledGraphVms={setEnabledGraphVms}
            toggleGraphEnabled={() => { }}
            allChartVms={allChartVms}
            setAllChartVms={setAllChartVms}
            toggleFormVisibility={toggleFormVisibility}
          />
        </Animated.View>
        {activeForm == 'AddGraphForm' && (
          <AddGraphForm toggleFormVisibility={toggleFormVisibility} />
        )}
      </View>

      <View style={styles.chartListContainer}>
        <ChartList enabledGraphVms={enabledGraphVms} />
      </View>
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
  },
  chartListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
