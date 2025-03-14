import { Database } from '@/database/database';
import { Exercise } from './Exercise';

// Define a type for the Set row returned by the database
export type SetRow = {
  id: number;
  exerciseid: number;
  amount: number;
  weight: number;
  rpe: number;
  batchid: number;
  completed: boolean;
  warmup: boolean;
};

export class Set {
  id: number;
  exerciseid: number;
  amount: number;
  weight: number;
  rpe: number;
  batchid: number;
  exerciseName: string | undefined;
  completed: boolean;
  warmup: boolean;

  constructor(id: number, exerciseid: number, amount: number, weight: number, rpe: number, batchid: number, completed: boolean, warmup: boolean) {
    this.id = id;
    this.exerciseid = exerciseid;
    this.amount = amount;
    this.weight = weight;
    this.rpe = rpe;
    this.batchid = batchid;
    this.completed = completed;
    this.warmup = warmup;
  }

  static async toggleCompletion(setId: number) {
    const db = await Database.getDbConnection();

    const result = await db.getFirstAsync(
      `SELECT * FROM exerciseset WHERE id = ?`,
      [setId]
    ) as SetRow;

    if (!result) {
      throw new Error(`Set with ID ${setId} not found`);
    }

    const newCompletedState = result.completed ? 0 : 1;

    await db.runAsync(
      `UPDATE exerciseset SET completed = ? WHERE id = ?`,
      [newCompletedState, setId]
    );

    return {
      ...result,
      completed: newCompletedState,
    };
  }

  static async create(exerciseid: number, amount: number, weight: number, rpe: number, batchid: number, completed: boolean) {
    const db = await Database.getDbConnection();


    const result = await db.runAsync(
      `INSERT INTO exerciseset (exerciseid, amount, weight, rpe, batchid) VALUES (?, ?, ?, ?, ?);`,
      [exerciseid, amount, weight, rpe, batchid]
    );
    return new Set(result.lastInsertRowId, exerciseid, amount, weight, rpe, batchid, completed, false);
  }

  static async findAll(): Promise<Set[]> {
    const db = await Database.getDbConnection();

    const rows = await db.getAllAsync('SELECT * FROM exerciseset') as SetRow[];

    return rows.map(row => new Set(row.id, row.exerciseid, row.amount, row.weight, row.rpe, row.batchid, row.completed, false));
  }

  static async findByBatchId(batchId: number): Promise<Set[]> {
    try {
      const db = await Database.getDbConnection();

      const rows = await db.getAllAsync('SELECT * FROM exerciseset WHERE batchid = ?', [batchId]) as SetRow[];
      return rows.map(row => new Set(row.id, row.exerciseid, row.amount, row.weight, row.rpe, row.batchid, row.completed, false));
    }
    catch (error) {
      console.error('Failed to find set by batchid:', error);
      return [];
    }
  }

  static async removeAll() {
    const db = await Database.getDbConnection();


    await db.runAsync('DELETE FROM exerciseset');

    return true;
  }

  async getExerciseName() {
    try {
      const db = await Database.getDbConnection();

      const result = await db.getFirstAsync('SELECT name FROM exercise WHERE id = ?', [this.exerciseid]) as { name: string };
      this.exerciseName = result.name;
      return result.name;
    }
    catch (error) {
      console.error('Failed to get exercise name:', error);
      return '';
    }
  }

  static async scrubData() {
    try {
      const db = await Database.getDbConnection();

      // Get all sets from the database.
      const allSets = await Set.findAll();

      // Group sets by exerciseid.
      const groups = new Map<number, Set[]>();
      allSets.forEach(set => {
        if (!groups.has(set.exerciseid)) {
          groups.set(set.exerciseid, []);
        }
        groups.get(set.exerciseid)!.push(set);
      });

      // Helper function to compute estimated 1RM.
      const computeEstimated1RM = (weight: number, amount: number) =>
        weight * (1 + amount * 0.0333);

      // Process each group.
      for (const [exerciseid, sets] of groups.entries()) {
        // Calculate estimated 1RM for each set and then the average.
        const estimated1RMs = sets.map(s =>
          computeEstimated1RM(s.weight, s.amount)
        );
        const avg1RM =
          estimated1RMs.reduce((sum, value) => sum + value, 0) /
          estimated1RMs.length;

        // For each set, mark as warmup if its estimated 1RM is less than 60% of the average.
        for (const set of sets) {
          const est = computeEstimated1RM(set.weight, set.amount);
          const isWarmup = est < 0.6 * avg1RM;

          // Update the warmup flag in the database.
          await db.runAsync(
            `UPDATE exerciseset SET warmup = ? WHERE id = ?`,
            [isWarmup ? 1 : 0, set.id]
          );

          // Optionally update the instance property.
          set.warmup = isWarmup;
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to scrub data:', error);
      return false;
    }
  }
}
