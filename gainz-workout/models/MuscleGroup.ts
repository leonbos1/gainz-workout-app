import db from '@/database/database';

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
