import BaseEntity from '@/models/base/BaseEntity';
import db from '../database/database';

export type BatchRow = {
  id: number;
  workoutid: number;
  note: string;
  equipmentid: number;
  attachmentid: number;
};

export class Batch extends BaseEntity {
  workoutid: number;
  note: string;
  equipmentid: number;
  attachmentid: number;

  constructor(id: number, workoutid: number, note: string, equipmentid: number, attachmentid: number) {
    super(id, new Date(), new Date());  
    this.workoutid = workoutid;
    this.note = note;
    this.equipmentid = equipmentid;
    this.attachmentid = attachmentid;
  }

  static async create(workoutid: number, note: string, equipmentid: number, attachmentid: number = 0): Promise<Batch> {
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
    const rows = await db.getAllAsync('SELECT * FROM batch') as BatchRow[];
    return rows.map(row => new Batch(row.id, row.workoutid, row.note, row.equipmentid, row.attachmentid));
  }

  static async findByWorkoutId(workoutId: number): Promise<Batch[]> {
    const rows = await db.getAllAsync('SELECT * FROM batch WHERE workoutid = ?', [workoutId]) as BatchRow[];
    return rows.map(row => new Batch(row.id, row.workoutid, row.note, row.equipmentid, row.attachmentid));
  }

  static async removeAll() {
    await db.runAsync('DELETE FROM batch');

    return true;
  }
}
