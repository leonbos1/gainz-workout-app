import { Database } from "@/database/database";
import { Exercise } from "./Exercise";
import { GraphDuration } from "./GraphDuration";
import { GraphType } from "./GraphType";
import { combineTransition } from "react-native-reanimated";
import { Set } from "./Set";

export class ChartDataset {
  data: number[];
  labels: string[];
  label: string;
  strokeWidth!: number;

  constructor(
    data: number[],
    labels: string[],
    label: string
  ) {
    this.data = data;
    this.labels = labels;
    this.label = label;
  }

  static async create(exercise: Exercise, graphDuration: GraphDuration, graphType: GraphType): Promise<ChartDataset> {
    const db = await Database.getDbConnection();

    if (graphType.id == 1) {
      const data = await Set.getEstimated1RM(exercise.id, graphDuration.value/7);
    }

    
  }
}
