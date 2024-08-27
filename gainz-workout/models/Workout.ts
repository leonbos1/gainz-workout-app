import * as SQLite from 'expo-sqlite';

type WorkoutRow = {
  id: number;
  starttime: string;
  endtime: string;
};

export class Workout {
  id: number;
  starttime: string;
  endtime: string;
  starttimeDate: Date;
  endtimeDate: Date;

  constructor(id: number, starttime: string, endtime: string) {
    this.id = id;
    this.starttime = starttime;
    this.endtime = endtime;
    this.starttimeDate = new Date(starttime);
    this.endtimeDate = new Date(endtime);
  }

  public static async create(starttime: string, endtime: string) {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const result = await db.runAsync(
      `INSERT INTO workout (starttime, endtime) VALUES (?, ?);`,
      [starttime, endtime]
    );
    return new Workout(result.lastInsertRowId, starttime, endtime);
  }

  public static async findAll(): Promise<Workout[]> {
    try {
      const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

      const rows = await db.getAllAsync('SELECT * FROM workout') as WorkoutRow[];
      return rows.map(row => new Workout(row.id, row.starttime, row.endtime));
    }
    catch (error) {
      console.error('Failed to find all workouts:', error);
      return [];
    }
  }

  static async removeAll() {
    const db = await SQLite.openDatabaseAsync('gainz.db', {useNewConnection: true});

    await db.runAsync('DELETE FROM workout');

    return true;
  }
}
