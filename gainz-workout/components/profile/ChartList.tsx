import React from 'react';
import { View, Text } from 'react-native';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import { Chart } from './Chart';

type ChartListProps = {
  enabledGraphVms: GraphViewModel[];
};

export default function ChartList({ enabledGraphVms }: ChartListProps) {
  return (
    <View>
      {enabledGraphVms.map(graphVm => (
        <View key={graphVm.graph.id}>
            <Chart data={graphVm.data} title={graphVm.graphTitle} />
          <Text>{graphVm.graphTitle}</Text>
        </View>
      ))}
    </View>
  );
}
