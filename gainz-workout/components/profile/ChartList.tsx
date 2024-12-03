import React, { memo } from 'react';
import { FlatList, View, Text } from 'react-native';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import { Chart } from './Chart';

type ChartListProps = {
  enabledGraphVms: GraphViewModel[];
};

const ChartList: React.FC<ChartListProps> = ({ enabledGraphVms }) => {
  const renderItem = ({ item }: { item: GraphViewModel }) => (
    <View key={item.graph.id}>
      <Chart data={item.data} title={item.graphTitle} />
      <Text>{item.graphTitle}</Text>
    </View>
  );

  return (
    <FlatList
      data={enabledGraphVms}
      renderItem={renderItem}
      keyExtractor={item => item.graph.id.toString()}
    />
  );
};

export default memo(ChartList);
