import * as SQLite from 'expo-sqlite';

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

  static async create(workoutid: number, note: string, equipmentid: number, attachmentid: number) {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const result = await db.runAsync(
      `INSERT INTO batch (workoutid, note) VALUES (?, ?);`,
      [workoutid, note]
    );
    return new Batch(result.lastInsertRowId, workoutid, note, equipmentid, attachmentid);
  }

  static async findAll(): Promise<Batch[]> {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const rows = await db.getAllAsync('SELECT * FROM batch') as BatchRow[];
    return rows.map(row => new Batch(row.id, row.workoutid, row.note, row.equipmentid, row.attachmentid));
  }

  static async findByWorkoutId(workoutId: number): Promise<Batch[]> {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });
    const rows = await db.getAllAsync('SELECT * FROM batch WHERE workoutid = ?', [workoutId]) as BatchRow[];
    return rows.map(row => new Batch(row.id, row.workoutid, row.note, row.equipmentid, row.attachmentid));
  }

  static async removeAll() {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    await db.runAsync('DELETE FROM batch');

    return true;
  }
}
