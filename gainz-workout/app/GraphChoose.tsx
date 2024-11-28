import { ChartSelector } from "@/components/profile/ChartSelector";
import { GraphViewModel } from "@/viewmodels/GraphViewModel";

type ChartChooseProps = {
    graphVms: GraphViewModel[];
    selectedGraphs: { [key: number]: boolean };
    toggleGraphVisibility: (id: number) => void;
};

export default function ChartChoose({ graphVms, selectedGraphs, toggleGraphVisibility }: ChartChooseProps) {
    return (
        <ChartSelector
            visible={true}
            graphVms={graphVms}
            selectedGraphs={selectedGraphs}
            toggleGraphVisibility={toggleGraphVisibility}
        />
    );
}

