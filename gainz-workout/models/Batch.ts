import * as SQLite from 'expo-sqlite';
import { Database } from '../database/database';

export type BatchRow = {
  id: number;
  workoutid: number;
  note: string;
  equipmentid: number;
  attachmentid: number;
  completed: boolean;
};

export class Batch {
  id: number;
  workoutid: number;
  note: string;
  equipmentid: number;
  attachmentid: number;
  completed: boolean;

  constructor(id: number, workoutid: number, note: string, equipmentid: number, attachmentid: number, completed: boolean) {
    this.id = id;
    this.workoutid = workoutid;
    this.note = note;
    this.equipmentid = equipmentid;
    this.attachmentid = attachmentid;
    this.completed = completed;
  }

  static async create(workoutid: number, note: string, equipmentid: number, attachmentid: number = 0, completed: boolean): Promise<Batch> {
    const db = await Database.getDbConnection();

    if (attachmentid === 0) {
      const result = await db.runAsync(
        `INSERT INTO batch (workoutid, note, equipmentid) VALUES (?, ?, ?);`,
        [workoutid, note, equipmentid]
      );

      return new Batch(result.lastInsertRowId, workoutid, note, equipmentid, attachmentid, completed);
    }

    else {
      const result = await db.runAsync(
        `INSERT INTO batch (workoutid, note, equipmentid, attachmentid) VALUES (?, ?, ?, ?);`,
        [workoutid, note, equipmentid, attachmentid]
      );

      return new Batch(result.lastInsertRowId, workoutid, note, equipmentid, attachmentid, completed);
    }
  }

  static async findAll(): Promise<Batch[]> {
    const db = await Database.getDbConnection();

    const rows = await db.getAllAsync('SELECT * FROM batch') as BatchRow[];
    return rows.map(row => new Batch(row.id, row.workoutid, row.note, row.equipmentid, row.attachmentid, row.completed));
  }

  static async findByWorkoutId(workoutId: number): Promise<Batch[]> {
    const db = await Database.getDbConnection();

    const rows = await db.getAllAsync('SELECT * FROM batch WHERE workoutid = ?', [workoutId]) as BatchRow[];
    return rows.map(row => new Batch(row.id, row.workoutid, row.note, row.equipmentid, row.attachmentid, row.completed));
  }

  static async removeAll() {
    const db = await Database.getDbConnection();

    await db.runAsync('DELETE FROM batch');

    return true;
  }

  static async toggleCompletion(batchId: number) {
    const db = await Database.getDbConnection();

    const result = await db.getFirstAsync(
      `SELECT * FROM exerciseset WHERE id = ?`,
      [batchId]
    ) as BatchRow;

    if (!result) {
      throw new Error(`Batch with ID ${batchId} not found`);
    }

    const newCompletedState = result.completed ? 0 : 1;

    await db.runAsync(
      `UPDATE batch SET completed = ? WHERE id = ?`,
      [newCompletedState, batchId]
    );

    return {
      ...result,
      completed: newCompletedState,
    };
  }
}