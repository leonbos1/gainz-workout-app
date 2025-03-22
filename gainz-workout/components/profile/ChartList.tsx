import React from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import { Chart } from './Chart';

type ChartListProps = {
  enabledGraphVms: GraphViewModel[];
  refreshing: boolean;
  onRefresh: () => void;
};

const ChartList: React.FC<ChartListProps> = ({ enabledGraphVms, refreshing, onRefresh }) => {
  const renderItem = ({ item }: { item: GraphViewModel }) => (
    <View key={item.graph.id}>
      <Chart data={item.data} title={item.graphTitle} />
    </View>
  );

  return (
    <FlatList
      data={enabledGraphVms}
      renderItem={renderItem}
      keyExtractor={item => item.graph.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default ChartList;
