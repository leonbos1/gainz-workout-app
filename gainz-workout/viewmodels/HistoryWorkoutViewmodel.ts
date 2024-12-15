// HistoryWorkoutViewmodel.ts
import { Set } from '@/datamodels/Set';

export interface ExerciseBatchViewmodel {
  batchId: number;
  sets: Set[];
  bestSet: Set | null;
  exercisename: string;
  numSets: number;
}

export class HistoryWorkoutViewmodel {
  constructor(
    public exerciseBatches: ExerciseBatchViewmodel[],
    public title: string,
    public duration: number,
    public startTime: Date,
    public workoutId: number
  ) {}
}
