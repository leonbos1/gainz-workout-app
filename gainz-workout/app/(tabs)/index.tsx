import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
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
  const [selectedGraphs, setSelectedGraphs] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();

  const toggleGraphVisibility = useCallback((id: number) => {
    setSelectedGraphs(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const seedData = async () => {
    await createTables();
    await seedDatabase();
    setIsDataSeeded(true);
  }

  useEffect(() => {
    seedData();
    try {
      const fetchGraphs = async () => {
        const allGraphsVms = await Graph.findAllAsViewModel();
        console.log('allGraphsVms:', allGraphsVms);
        const enGraphsVms = allGraphsVms.filter(graphVm => graphVm.graph.enabled);
        console.log('enGraphsVms:', enGraphsVms);
        setEnabledGraphVms(enGraphsVms);
      }
      fetchGraphs();
    }
    catch (error) {
      console.error('Error fetching graphs:', error);
    }
  }, []);

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
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: './GraphChoose',
            params: {
              enabledGraphVms: JSON.stringify(enabledGraphVms),
              selectedGraphs: JSON.stringify(selectedGraphs),
            },
          })
        }
      >
        <Ionicons name="add-outline" size={25} color={Colors.light.text} style={{ marginLeft: 15 }} />
      </TouchableOpacity>
      <ChartList enabledGraphVms={enabledGraphVms} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
    backgroundColor: Colors.light.background,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 5,
    paddingBottom: 40,
    backgroundColor: Colors.light.background,
    width: screenWidth,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: Colors.light.background,
  },
});
