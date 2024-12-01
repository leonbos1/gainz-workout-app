import { ChartSelector } from "@/components/profile/ChartSelector";
import { GraphViewModel } from "@/viewmodels/GraphViewModel";
import { useSearchParams } from "expo-router/build/hooks";

export default function ChartChoose() {
    const searchParams = useSearchParams();
    const enabledGraphVms = searchParams.get('enabledGraphVms');
    const selectedGraphs = searchParams.get('selectedGraphs');

    const parsedEnabledGraphVms = JSON.parse(enabledGraphVms || '[]');
    const parsedSelectedGraphs = JSON.parse(selectedGraphs || '{}');

    return (
        <ChartSelector
            visible={true}
            graphVms={parsedEnabledGraphVms}
            selectedGraphs={parsedSelectedGraphs}
            toggleGraphVisibility={(id) => console.log(`Toggling graph visibility for ID: ${id}`)}
        />
    );
}

