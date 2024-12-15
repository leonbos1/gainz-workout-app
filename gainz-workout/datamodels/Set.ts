import { ChartDataset } from '../models/ChartDataset';
import db from '@/database/database';
import { round } from 'lodash';
import BaseEntity from './base/BaseEntity';

export type SetRow = {
  id: number;
  exerciseid: number;
  amount: number;
  weight: number;
  rpe: number;
  batchid: number;
};

export class Set extends BaseEntity {
  exerciseid: number;
  amount: number;
  weight: number;
  rpe: number;
  batchid: number;
  exerciseName: string | undefined;

  constructor(id: number, exerciseid: number, amount: number, weight: number, rpe: number, batchid: number) {
    super(id, new Date(), new Date());
    this.exerciseid = exerciseid;
    this.amount = amount;
    this.weight = weight;
    this.rpe = rpe;
    this.batchid = batchid;
  }

  static async create(exerciseid: number, amount: number, weight: number, rpe: number, batchid: number) {
    const result = await db.runAsync(
      `INSERT INTO exerciseset (exerciseid, amount, weight, rpe, batchid) VALUES (?, ?, ?, ?, ?);`,
      [exerciseid, amount, weight, rpe, batchid]
    );
    return new Set(result.lastInsertRowId, exerciseid, amount, weight, rpe, batchid);
  }

  static async findAll(): Promise<Set[]> {
    const rows = await db.getAllAsync('SELECT * FROM exerciseset') as SetRow[];
    return rows.map(row => new Set(row.id, row.exerciseid, row.amount, row.weight, row.rpe, row.batchid));
  }

  static async findByBatchId(batchId: number): Promise<Set[]> {
    try {
      const rows = await db.getAllAsync('SELECT * FROM exerciseset WHERE batchid = ?', [batchId]) as SetRow[];
      return rows.map(row => new Set(row.id, row.exerciseid, row.amount, row.weight, row.rpe, row.batchid));
    }
    catch (error) {
      console.error('Failed to find set by batchid:', error);
      return [];
    }
  }

  static async removeAll() {
    await db.runAsync('DELETE FROM exerciseset');

    return true;
  }

  async getExerciseName() {
    try {
      const result = await db.getFirstAsync('SELECT name FROM exercise WHERE id = ?', [this.exerciseid]) as { name: string };
      this.exerciseName = result.name;
      return result.name;
    }
    catch (error) {
      console.error('Failed to get exercise name:', error);
      return '';
    }
  }

  static async getEstimated1RM(exerciseId: number, weeks: number): Promise<ChartDataset> {
    weeks = round(weeks);

    const rows = await db.getAllAsync(`
      SELECT strftime('%Y-%m-%d', w.endtime, 'weekday 0', '-6 days') as monday, 
             MAX(es.weight * (1 + (es.amount * 0.0333))) as estimated1RM
      FROM exerciseset es
      JOIN batch b ON es.batchid = b.id
      JOIN workout w ON b.workoutid = w.id
      WHERE es.exerciseid = ?
      GROUP BY monday
      ORDER BY monday DESC
      LIMIT ?
    `, [exerciseId, weeks]) as { monday: string, estimated1RM: number }[];

    const data: number[] = new Array(9).fill(0);
    const labels: string[] = new Array(9).fill('');

    rows.forEach((row, index) => {
      data[index] = row.estimated1RM;
      const date = new Date(row.monday);
      labels[index] = `${date.getMonth() + 1}/${date.getDate()}`;
    });

    data.reverse();
    labels.reverse();

    for (let i = 0; i < labels.length; i++) {
      if (i % 5 !== 0) {
        labels[i] = '';
      }
      //TODO: iets toevoegen dat jaartallen er in komen
    }

    const exercise = await db.getFirstAsync('SELECT name FROM exercise WHERE id = ?', [exerciseId]) as { name: string };

    return new ChartDataset(data, labels, exercise.name);
  }

  static async getVolume(exerciseId: number, weeks: number): Promise<ChartDataset> {
    weeks = round(weeks);

    const rows = await db.getAllAsync(`
    SELECT strftime('%Y-%m-%d', w.endtime, 'weekday 0', '-6 days') as monday, 
           SUM(es.amount * es.weight) as volume
    FROM exerciseset es
    JOIN batch b ON es.batchid = b.id
    JOIN workout w ON b.workoutid = w.id
    WHERE es.exerciseid = ?
    GROUP BY monday
    ORDER BY monday DESC
    LIMIT ?
  `, [exerciseId, weeks]) as { monday: string, volume: number }[];

    const data: number[] = new Array(9).fill(0);
    const labels: string[] = new Array(9).fill('');

    let cumulativeVolume = 0;
    rows.forEach((row, index) => {
      cumulativeVolume += row.volume;
      data[index] = cumulativeVolume;
      const date = new Date(row.monday);
      labels[index] = `${date.getMonth() + 1}/${date.getDate()}`;
    });

    // data.reverse();
    labels.reverse();

    for (let i = 0; i < labels.length; i++) {
      if (i % 5 !== 0) {
        labels[i] = '';
      }
      //TODO: iets toevoegen dat jaartallen er in komen
    }

    const exercise = await db.getFirstAsync('SELECT name FROM exercise WHERE id = ?', [exerciseId]) as { name: string };

    return new ChartDataset(data, labels, exercise.name);
  }
}
