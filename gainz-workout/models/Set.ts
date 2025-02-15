import { Database } from '@/database/database';

// Define a type for the Set row returned by the database
export type SetRow = {
  id: number;
  exerciseid: number;
  amount: number;
  weight: number;
  rpe: number;
  batchid: number;
  completed: boolean;
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

  constructor(id: number, exerciseid: number, amount: number, weight: number, rpe: number, batchid: number, completed: boolean) {
    this.id = id;
    this.exerciseid = exerciseid;
    this.amount = amount;
    this.weight = weight;
    this.rpe = rpe;
    this.batchid = batchid;
    this.completed = completed;
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
    return new Set(result.lastInsertRowId, exerciseid, amount, weight, rpe, batchid, completed);
  }

  static async findAll(): Promise<Set[]> {
    const db = await Database.getDbConnection();

    const rows = await db.getAllAsync('SELECT * FROM exerciseset') as SetRow[];

    return rows.map(row => new Set(row.id, row.exerciseid, row.amount, row.weight, row.rpe, row.batchid, row.completed));
  }

  static async findByBatchId(batchId: number): Promise<Set[]> {
    try {
      const db = await Database.getDbConnection();

      const rows = await db.getAllAsync('SELECT * FROM exerciseset WHERE batchid = ?', [batchId]) as SetRow[];
      return rows.map(row => new Set(row.id, row.exerciseid, row.amount, row.weight, row.rpe, row.batchid, row.completed));
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

}
