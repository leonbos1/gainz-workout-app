import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

interface DashboardProps {
  onAddPress: () => void;
}

export function Dashboard({ onAddPress }: DashboardProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
      <TouchableOpacity onPress={onAddPress}>
        <Ionicons name="add" size={25} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  text: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
});
