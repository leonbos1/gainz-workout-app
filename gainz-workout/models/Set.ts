import * as SQLite from 'expo-sqlite';
import { ChartDataset } from './ChartDataset';

// Define a type for the Set row returned by the database
export type SetRow = {
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

  static async getEstimated1RM(exerciseId: number): Promise<ChartDataset> {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const rows = await db.getAllAsync(`
      SELECT strftime('%Y-%m-%d', w.endtime, 'weekday 0', '-6 days') as monday, SUM(weight * amount * 0.0333 + weight) as total
      FROM exerciseset es
      JOIN batch b ON es.batchid = b.id
      JOIN workout w ON b.workoutid = w.id
      WHERE es.exerciseid = ?
      GROUP BY monday
      ORDER BY monday DESC
      LIMIT 9
    `, [exerciseId]) as { monday: string, total: number }[];

    const data: number[] = new Array(9).fill(0);
    const labels: string[] = new Array(9).fill('');

    rows.forEach((row, index) => {
      data[index] = row.total;
      const date = new Date(row.monday);
      labels[index] = `${date.getMonth() + 1}/${date.getDate()}`;
    });

    data.reverse();
    labels.reverse();

    const exerciseName = await db.getFirstAsync('SELECT name FROM exercise WHERE id = ?', [exerciseId]) as { name: string };

    return new ChartDataset(data, labels, exerciseName.name);
  }
}
