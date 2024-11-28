import { ChartDataset } from "@/models/ChartDataset";
import { Exercise } from "@/models/Exercise";
import { Graph, GraphRow } from "@/models/Graph";
import { GraphDuration } from "@/models/GraphDuration";
import { GraphType } from "@/models/GraphType";


export class GraphViewModel {
    public exercise!: Exercise;
    public graphDuration!: GraphDuration;
    public graphType!: GraphType;
    public graphTitle!: string;
    public data!: ChartDataset

    private constructor(public graph: GraphRow) { }

    static async create(graph: GraphRow): Promise<GraphViewModel> {
        const instance = new GraphViewModel(graph);
        await instance.init();
        instance.graphTitle = `${instance.exercise.name} | ${instance.graphDuration.name} | ${instance.graphType.name}`;
        return instance;
    }

    private async init() {
        const [exercise, graphDuration, graphType] = await Promise.all([
            Exercise.findById(this.graph.exerciseid),
            GraphDuration.findById(this.graph.graph_durationid),
            GraphType.findById(this.graph.graph_typeid)
        ]);

        this.data = await ChartDataset.create(exercise, graphDuration, graphType);

        this.exercise = exercise;
        this.graphDuration = graphDuration;
        this.graphType = graphType;
    }
}
