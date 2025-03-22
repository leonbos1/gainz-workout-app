export const unstable_settings = {
  title: 'Exercise Details',
};

import React, { JSXElementConstructor, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, ListRenderItemInfo } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { Exercise } from '@/models/Exercise';
import { MuscleGroup } from '@/models/MuscleGroup';
import { Chart } from '@/components/profile/Chart';
import { ChartDataset } from '@/components/profile/Chart';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import { GraphDuration } from '@/models/GraphDuration';
import { GraphType } from '@/models/GraphType';
import { Colors } from '@/constants/Colors';
import { ExerciseBatchViewmodel, HistoryWorkoutViewmodel } from '@/viewmodels/HistoryWorkoutViewmodel';
import { Batch } from '@/models/Batch';
import { Workout } from '@/models/Workout';
import { Set, SetsPerDay } from '@/models/Set';
import { debounce } from 'lodash';
import { HistoryWorkout } from '@/components/HistoryWorkout';

const screenWidth = Dimensions.get('window').width;

export default function ExerciseDetailsScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [musclegroup, setMusclegroup] = useState<MuscleGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewModels, setViewModels] = useState<SetsPerDay[]>([]);

  useFocusEffect(
    useCallback(() => {
      debouncedFetchData(page);
    }, [page])
  );

  type TabName = 'about' | 'history' | 'charts' | 'records';
  const tabOrder: TabName[] = ['about', 'history', 'charts', 'records'];
  const [activeTab, setActiveTab] = useState<TabName>('about');

  const [chartDataFirst, setChartDataFirst] = useState<ChartDataset | null>(null);
  const [chartDataSecond, setChartDataSecond] = useState<ChartDataset | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  const navigation = useNavigation();

  const fetchAndPrepareData = async (page: number) => {
    if (loading) return;

    setLoading(true);
    setError(null);
    try {
      if (exercise?.id == null) return;

      var sets = await Set.GetSetsPerDay(exercise.id);

      setViewModels(sets);
    } catch (error) {
      setError('Failed to fetch workout data. Please try again later.');
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useCallback(debounce(fetchAndPrepareData, 300), []);

  useEffect(() => {
    fetchExercise();
  }, []);

  const fetchExercise = async () => {
    try {
      const ex = await Exercise.findById(Number.parseInt(exerciseId));
      setExercise(ex);

      navigation.setOptions({ title: ex.name });

      const graphDuration = await GraphDuration.findById(7);
      const graphType1 = await GraphType.findById(1);
      const graphType2 = await GraphType.findById(2);

      const firstChartData = await ChartDataset.create(ex, graphDuration, graphType1);
      setChartDataFirst(firstChartData);

      const secondChartData = await ChartDataset.create(ex, graphDuration, graphType2);
      setChartDataSecond(secondChartData);
    } catch (error) {
      console.error('Error fetching exercise:', error);
    }
  };

  const handleTabPress = (tab: TabName, index: number) => {
    setActiveTab(tab);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true });
    }
  };

  const onMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setActiveTab(tabOrder[index]);
  };

  const loadMoreData = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const keyExtractor = (item: SetsPerDay, index: number): string => {
    return `${item.date.toISOString()}-${index}`;
  };

  useEffect(() => {
    debouncedFetchData(page);
  }, []);

  const renderItem = useCallback(({ item }: { item: SetsPerDay }) => (
    <View>
      <Text>HERE</Text>
      <Text>{item.date.toISOString()}</Text>
      {item.sets.map((set) => {
        return <Text>
          {set.amount}
        </Text>
      })}
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        {tabOrder.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.navItem, activeTab === tab && styles.activeNavItem]}
            onPress={() => handleTabPress(tab, index)}
          >
            <Text style={[styles.navText, activeTab === tab && styles.activeNavText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.scrollView}
      >
        {/* About Tab */}
        <View style={[styles.page, { width: screenWidth }]}>
          <Text style={styles.pageTitle}>About</Text>
          <Text style={styles.detailText}>Exercise Name: {exercise?.name}</Text>
          <Text style={styles.detailText}>Muscle Group: {musclegroup?.name}</Text>
        </View>

        {/* History Tab */}
        <View style={[styles.page, { width: screenWidth }]}>
          <Text style={styles.pageTitle}>History</Text>
          <Text style={styles.detailText}>History content goes here.</Text>
          <FlatList
            data={viewModels}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
            ListFooterComponent={loading ? <ActivityIndicator size="large" color={Colors.text} /> : null}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            windowSize={21}
          />
        </View>

        {/* Charts Tab */}
        <View style={[styles.page, { width: screenWidth }]}>
          {chartDataFirst && <Chart data={chartDataFirst} title="Estimated 1 Rep Max" />}
          {chartDataSecond && <Chart data={chartDataSecond} title="Volume" />}
        </View>

        {/* Records Tab */}
        <View style={[styles.page, { width: screenWidth }]}>
          <Text style={styles.pageTitle}>Records</Text>
          <Text style={styles.detailText}>Records content goes here.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: Colors.text
  },
  navItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  navText: {
    fontSize: 16,
    color: Colors.text,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  activeNavText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  page: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.text,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 40,
    backgroundColor: Colors.background,
    width: screenWidth,
  },
});
