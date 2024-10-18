import * as SQLite from 'expo-sqlite';
import { ChartDataset } from './ChartDataset';
import { Database } from '@/database/database';

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
    const db = await Database.getDbConnection();


    const result = await db.runAsync(
      `INSERT INTO exerciseset (exerciseid, amount, weight, rpe, batchid) VALUES (?, ?, ?, ?, ?);`,
      [exerciseid, amount, weight, rpe, batchid]
    );
    return new Set(result.lastInsertRowId, exerciseid, amount, weight, rpe, batchid);
  }

  static async findAll(): Promise<Set[]> {
    const db = await Database.getDbConnection();


    const rows = await db.getAllAsync('SELECT * FROM exerciseset') as SetRow[];
    return rows.map(row => new Set(row.id, row.exerciseid, row.amount, row.weight, row.rpe, row.batchid));
  }

  static async findByBatchId(batchId: number): Promise<Set[]> {
    try {
      const db = await Database.getDbConnection();

      const rows = await db.getAllAsync('SELECT * FROM exerciseset WHERE batchid = ?', [batchId]) as SetRow[];
      return rows.map(row => new Set(row.id, row.exerciseid, row.amount, row.weight, row.rpe, row.batchid));
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

  static async getEstimated1RM(exerciseName: string, weeks: number): Promise<ChartDataset> {
    const db = await Database.getDbConnection();


    const rows = await db.getAllAsync(`
      SELECT strftime('%Y-%m-%d', w.endtime, 'weekday 0', '-6 days') as monday, 
             MAX(es.weight * (1 + (es.amount * 0.0333))) as estimated1RM
      FROM exerciseset es
      JOIN batch b ON es.batchid = b.id
      JOIN workout w ON b.workoutid = w.id
      WHERE es.exerciseid = (SELECT id FROM exercise WHERE name = ?)
      GROUP BY monday
      ORDER BY monday DESC
      LIMIT ?
    `, [exerciseName, weeks]) as { monday: string, estimated1RM: number }[];

    const data: number[] = new Array(9).fill(0);
    const labels: string[] = new Array(9).fill('');

    rows.forEach((row, index) => {
      data[index] = row.estimated1RM;
      const date = new Date(row.monday);
      labels[index] = `${date.getMonth() + 1}/${date.getDate()}`;
    });

    data.reverse();
    labels.reverse();

    // make sure 3/4 of the labels are empty strings
    for (let i = 0; i < labels.length; i++) {
      if (i % 10 !== 0) {
        labels[i] = '';
      }
    }

    return new ChartDataset(data, labels, exerciseName);
  }
}
