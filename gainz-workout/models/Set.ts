import * as SQLite from 'expo-sqlite';
import { ChartDataset } from './ChartDataset';
import { Database } from '@/database/database';
import { GraphDuration } from './GraphDuration';
import { round } from 'lodash';

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

  static async getEstimated1RM(exerciseId: number, weeks: number): Promise<ChartDataset> {
    const db = await Database.getDbConnection();

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
    const db = await Database.getDbConnection();

    weeks = Math.round(weeks);

    // Generate the date range for the last `weeks` weeks
    const endDate = new Date(); // Current date
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - weeks * 7);

    const dateRange: { monday: string; volume: number }[] = [];
    let currentMonday = new Date(startDate);
    currentMonday.setDate(currentMonday.getDate() - currentMonday.getDay() + 1); // Ensure it's a Monday

    while (currentMonday <= endDate) {
      dateRange.push({ monday: currentMonday.toISOString().split('T')[0], volume: 0 });
      currentMonday.setDate(currentMonday.getDate() + 7); // Move to the next Monday
    }

    // Query the database for volume data
    const rows = await db.getAllAsync(
      `
      SELECT strftime('%Y-%m-%d', w.endtime, 'weekday 0', '-6 days') as monday, 
             SUM(es.amount * es.weight) as volume
      FROM exerciseset es
      JOIN batch b ON es.batchid = b.id
      JOIN workout w ON b.workoutid = w.id
      WHERE es.exerciseid = ?
      GROUP BY monday
      ORDER BY monday ASC
      `,
      [exerciseId]
    ) as { monday: string; volume: number }[];

    // Merge database results with the date range
    const data: number[] = [];
    const labels: string[] = [];
    let cumulativeVolume = 0;
    let previousYear: number | null = null;

    dateRange.forEach((week) => {
      const match = rows.find((row) => row.monday === week.monday);
      const weeklyVolume = match ? match.volume : 0;
      cumulativeVolume += weeklyVolume;

      data.push(cumulativeVolume);

      const date = new Date(week.monday);
      const year = date.getFullYear();
      const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;

      // Include the year whenever it changes
      if (previousYear !== year) {
        labels.push(`${monthDay}/${year}`);
        previousYear = year;
      } else {
        labels.push(monthDay); // Show only the month and day otherwise
      }
    });

    // Ensure there are a consistent number of labels (e.g., 6)
    const totalLabels = 6;
    const interval = Math.ceil(labels.length / totalLabels);

    for (let i = 0; i < labels.length; i++) {
      if (i % interval !== 0) {
        labels[i] = ''; // Clear labels not on the interval
      }
    }

    const exercise = await db.getFirstAsync('SELECT name FROM exercise WHERE id = ?', [exerciseId]) as { name: string };

    return new ChartDataset(data, labels, exercise.name);
  }

}
