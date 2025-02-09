import { Database } from '@/database/database';
import * as SQLite from 'expo-sqlite';

type MuscleGroupRow = {
  id: number;
  name: string;
};

export class MuscleGroup {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name
  }

  static async create(name: string) {
    const db = await Database.getDbConnection();

    const result = await db.runAsync(
      `INSERT INTO musclegroup (name) VALUES (?);`,
      [name]
    );
    return new MuscleGroup(result.lastInsertRowId, name);
  }

  static async findAll(): Promise<MuscleGroup[]> {
    const db = await Database.getDbConnection();

    const rows = await db.getAllAsync('SELECT * FROM musclegroup') as MuscleGroupRow[];
    console.log('rows:', rows);
    return rows.map(row => new MuscleGroup(row.id, row.name));
  }

  static async removeAll() {
    const db = await Database.getDbConnection();

    await db.runAsync('DELETE FROM musclegroup');

    return true;
  }

  static async findById(id: number): Promise<MuscleGroup> {
    const db = await Database.getDbConnection();

    const row = await db.getFirstAsync('SELECT * FROM musclegroup WHERE id = ?', [id]) as MuscleGroupRow;

    return new MuscleGroup(row.id, row.name);
  }
}
