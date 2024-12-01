import { Database } from "@/database/database";
import { Exercise } from "./Exercise";
import { GraphDuration } from "./GraphDuration";
import { GraphType } from "./GraphType";
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
    var data = new ChartDataset([], [], "");
    
    if (graphType.id == 1) {
      data = await Set.getEstimated1RM(exercise.id, Math.round(graphDuration.value/7));
    }

    if (graphType.id == 2) {
      data = await Set.getVolume(exercise.id, Math.round(graphDuration.value/7));
    }

    return data;
  }
}

