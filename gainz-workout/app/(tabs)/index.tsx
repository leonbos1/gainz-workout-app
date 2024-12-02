import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import { seedDatabase, createTables } from '@/database/database';
import ChartList from '@/components/profile/ChartList';
import { ChartSelector } from '@/components/profile/ChartSelector';
import IconButton from '@/components/IconButton';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import { Graph } from '@/models/Graph';

const screenWidth = Dimensions.get('window').width;
export default function ProfileScreen() {
  const [isDataSeeded, setIsDataSeeded] = useState(false);
  const [enabledGraphVms, setEnabledGraphVms] = useState<GraphViewModel[]>([]);
  const [allChartVms, setAllChartVms] = useState<GraphViewModel[]>([]);
  const [isChartSelectorVisible, setIsChartSelectorVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
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
  }, []);

  const toggleChartSelector = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (isChartSelectorVisible) {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        setIsChartSelectorVisible(false);
        setIsAnimating(false);
      });
    } else {
      if (enabledGraphVms.length === 0) {
        fetchGraphs();
        //await fetchGraphs();
      }
      setIsChartSelectorVisible(true);
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setIsAnimating(false));
    }
  };

  const slideAnimation = {
    transform: [
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0], // Slide from below
        }),
      },
    ],
  };

  const fadeAnimation = {
    opacity: animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

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

  useEffect(() => {
    fetchGraphs();
    seedData();
  }, [fetchGraphs]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Profile</Text>
        <TouchableOpacity>
          <Link href="./Settings">
            <Ionicons name="settings-outline" size={25} color={Colors.light.text} style={{ marginLeft: 15 }} />
          </Link>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toggleChartSelector}>
        <Ionicons
          name={isChartSelectorVisible ? "chevron-up-outline" : "chevron-down-outline"}
          size={25}
          color={Colors.light.text}
          style={{ marginLeft: 15 }}
        />
      </TouchableOpacity>
      {isChartSelectorVisible && (
        <Animated.View
          style={[
            styles.animatedContainer,
            slideAnimation,
            fadeAnimation,
          ]}
        >
          <ChartSelector
            enabledGraphVms={enabledGraphVms}
            setEnabledGraphVms={setEnabledGraphVms}
            toggleGraphEnabled={toggleGraphEnabled}
            allChartVms={allChartVms}
            setAllChartVms={setAllChartVms}
            style={styles.chartSelector}
          />
        </Animated.View>
      )}
      <ChartList enabledGraphVms={enabledGraphVms} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chartSelector: {
    height: 300,
  },
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
    minHeight: 200,
    backgroundColor: Colors.light.background,
    padding: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
});
