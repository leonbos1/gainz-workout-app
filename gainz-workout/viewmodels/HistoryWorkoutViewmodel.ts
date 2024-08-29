import { Set } from '../models/Set';

export class HistoryWorkoutViewmodel {
    exerciseBatches: BatchViewmodel[];
    title: string;
    durationSeconds: number;
    date: Date;

    constructor(exerciseBatches: BatchViewmodel[], title: string, durationSeconds: number, date: Date) {
        this.exerciseBatches = exerciseBatches;
        this.title = title;
        this.durationSeconds = durationSeconds;
        this.date = date;
    }
}

export class BatchViewmodel {
    batchId: number;
    sets: Set[];
    exercisename: string;

    constructor(batchId: number, sets: Set[], exercisename: string) {
        this.batchId = batchId;
        this.sets = sets;
        this.exercisename = exercisename;
    }
}