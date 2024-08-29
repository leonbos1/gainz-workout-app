import * as SQLite from 'expo-sqlite';

// Define a type for the Set row returned by the database
type SetRow = {
  id: number;
  exerciseid: number;
  amount: number;
  weight: number;
  rpe: number;
  batchid: number;
};

export class Set {
  id: number;
  exerciseid: number;
  amount: number;
  weight: number;
  rpe: number;
  batchid: number;
  exerciseName: string | undefined;

  constructor(id: number, exerciseid: number, amount: number, weight: number, rpe: number, batchid: number) {
    this.id = id;
    this.exerciseid = exerciseid;
    this.amount = amount;
    this.weight = weight;
    this.rpe = rpe;
    this.batchid = batchid;
  }

  static async create(exerciseid: number, amount: number, weight: number, rpe: number, batchid: number) {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const result = await db.runAsync(
      `INSERT INTO exerciseset (exerciseid, amount, weight, rpe, batchid) VALUES (?, ?, ?, ?, ?);`,
      [exerciseid, amount, weight, rpe, batchid]
    );
    return new Set(result.lastInsertRowId, exerciseid, amount, weight, rpe, batchid);
  }

  static async findAll(): Promise<Set[]> {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const rows = await db.getAllAsync('SELECT * FROM exerciseset') as SetRow[];
    return rows.map(row => new Set(row.id, row.exerciseid, row.amount, row.weight, row.rpe, row.batchid));
  }

  static async findByBatchId(batchId: number): Promise<Set[]> {
    try {
      const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });
      const rows = await db.getAllAsync('SELECT * FROM exerciseset WHERE batchid = ?', [batchId]) as SetRow[];
      return rows.map(row => new Set(row.id, row.exerciseid, row.amount, row.weight, row.rpe, row.batchid));
    }
    catch (error) {
      console.error('Failed to find set by batchid:', error);
      return [];
    }
  }

  static async removeAll() {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    await db.runAsync('DELETE FROM exerciseset');

    return true;
  }

  async getExerciseName() {
    try {
      const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });
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
