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

export interface SetsPerDay {
  date: Date;
  sets: Set[];
}

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


  static async GetSetsPerDay(exerciseId: number): Promise<SetsPerDay[]> {
    try {
      const db = await Database.getDbConnection();

      const query = `
      SELECT s.*, w.starttime
      FROM exerciseset s
      INNER JOIN Batch b ON s.batchid = b.id
      INNER JOIN Workout w ON b.workoutid = w.id
      WHERE s.exerciseid = ?
      ORDER BY w.starttime ASC
    `;

      const rows = await db.getAllAsync(query, [exerciseId]);

      console.log(rows);

      const setsPerDayMap: { [date: string]: Set[] } = {};

      rows.forEach((row: any) => {
        const dateKey = new Date(row.starttimeDate).toISOString().split('T')[0];
        if (!setsPerDayMap[dateKey]) {
          setsPerDayMap[dateKey] = [];
        }
        setsPerDayMap[dateKey].push(row);
      });

      const result: SetsPerDay[] = Object.keys(setsPerDayMap).map((date) => ({
        date: new Date(date),
        sets: setsPerDayMap[date],
      }));

      return result;
    } catch (error) {
      console.error('Failed to get sets per day for exerciseId:', exerciseId, error);
      return [];
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
        const key = set.exerciseid;
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(set);
      });

      // Helper function to compute estimated 1RM.
      const computeEstimated1RM = (weight: number, amount: number) =>
        weight * (1 + amount * 0.0333);

      // Process each group.
      for (const [exerciseid, sets] of groups.entries()) {
        // Sort sets by id (assuming ascending order gives the chronological order).
        const sortedSets = sets.slice().sort((a, b) => a.id - b.id);

        // Begin transaction for the group.
        await db.execAsync("BEGIN TRANSACTION");

        try {
          for (let i = 0; i < sortedSets.length; i++) {
            const currentSet = sortedSets[i];
            const currentEst1RM = computeEstimated1RM(currentSet.weight, currentSet.amount);
            let isWarmup = false;

            // Only compute a rolling average if there are preceding sets.
            if (i > 0) {
              // Use up to the last 10 sets.
              const windowStart = Math.max(0, i - 10);
              const windowSets = sortedSets.slice(windowStart, i);
              const windowEst1RMs = windowSets.map(s => computeEstimated1RM(s.weight, s.amount));
              const windowAvg =
                windowEst1RMs.reduce((sum, value) => sum + value, 0) / windowEst1RMs.length;

              // If the current estimated 1RM deviates more than 20% (higher or lower) from the average, mark it as warmup.
              if (currentEst1RM > windowAvg * 1.4 || currentEst1RM < windowAvg * 0.6) {
                isWarmup = true;
              }
            }
            // Update the set in the database.
            await db.runAsync(
              "UPDATE exerciseset SET warmup = ? WHERE id = ?",
              [isWarmup ? 1 : 0, currentSet.id]
            );
            // Optionally update the instance property.
            currentSet.warmup = isWarmup;
          }
          // Commit the transaction if all updates succeed.
          await db.execAsync("COMMIT");
        } catch (error) {
          // Rollback if any update fails.
          await db.execAsync("ROLLBACK");
          throw error;
        }
      }
    } catch (error) {
      console.error("Failed to scrub data:", error);
    }
  }
}
