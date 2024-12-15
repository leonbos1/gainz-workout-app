import db from '@/database/database';
import BaseEntity from '../models/base/BaseEntity';

type MuscleGroupRow = {
  id: number;
  name: string;
};

export class MuscleGroup extends BaseEntity {
  name: string;

  constructor(id: number, name: string) {
    super(id, new Date(), new Date());
    this.name = name
  }

  static async create(name: string) {
    const result = await db.runAsync(
      `INSERT INTO musclegroup (name) VALUES (?);`,
      [name]
    );
    return new MuscleGroup(result.lastInsertRowId, name);
  }

  static async findAll(): Promise<MuscleGroup[]> {
    const rows = await db.getAllAsync('SELECT * FROM musclegroup') as MuscleGroupRow[];
    console.log('rows:', rows);
    return rows.map(row => new MuscleGroup(row.id, row.name));
  }

  static async removeAll() {
    await db.runAsync('DELETE FROM musclegroup');

    return true;
  }
}
