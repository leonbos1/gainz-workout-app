import * as SQLite from 'expo-sqlite';
import { Database } from '../database/database';

export type BatchRow = {
  id: number;
  workoutid: number;
  note: string;
  equipmentid: number;
  attachmentid: number;
};

export class Batch {
  id: number;
  workoutid: number;
  note: string;
  equipmentid: number;
  attachmentid: number;

  constructor(id: number, workoutid: number, note: string, equipmentid: number, attachmentid: number) {
    this.id = id;
    this.workoutid = workoutid;
    this.note = note;
    this.equipmentid = equipmentid;
    this.attachmentid = attachmentid;
  }

  static async create(workoutid: number, note: string, equipmentid: number, attachmentid: number = 0): Promise<Batch> {
    const db = await Database.getDbConnection();

    if (attachmentid === 0) {
      const result = await db.runAsync(
        `INSERT INTO batch (workoutid, note, equipmentid) VALUES (?, ?, ?);`,
        [workoutid, note, equipmentid]
      );

      return new Batch(result.lastInsertRowId, workoutid, note, equipmentid, attachmentid);
    }

    else {
      const result = await db.runAsync(
        `INSERT INTO batch (workoutid, note, equipmentid, attachmentid) VALUES (?, ?, ?, ?);`,
        [workoutid, note, equipmentid, attachmentid]
      );

      return new Batch(result.lastInsertRowId, workoutid, note, equipmentid, attachmentid);
    }
  }

  static async findAll(): Promise<Batch[]> {
    const db = await Database.getDbConnection();

    const rows = await db.getAllAsync('SELECT * FROM batch') as BatchRow[];
    return rows.map(row => new Batch(row.id, row.workoutid, row.note, row.equipmentid, row.attachmentid));
  }

  static async findByWorkoutId(workoutId: number): Promise<Batch[]> {
    const db = await Database.getDbConnection();

    const rows = await db.getAllAsync('SELECT * FROM batch WHERE workoutid = ?', [workoutId]) as BatchRow[];
    return rows.map(row => new Batch(row.id, row.workoutid, row.note, row.equipmentid, row.attachmentid));
  }

  static async removeAll() {
    const db = await Database.getDbConnection();

    await db.runAsync('DELETE FROM batch');

    return true;
  }
}
