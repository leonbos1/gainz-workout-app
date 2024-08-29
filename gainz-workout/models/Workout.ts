import * as SQLite from 'expo-sqlite';

export type WorkoutRow = {
  id: number;
  starttime: string;
  endtime: string;
};

export class Workout {
  id: number;
  title: string;
  starttime: string;
  endtime: string;
  starttimeDate: Date;
  endtimeDate: Date;

  constructor(id: number, title: string, starttime: string, endtime: string) {
    this.id = id;
    this.title = title;
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
    return new Workout(result.lastInsertRowId, "sample title", starttime, endtime);
  }

  public static async findAll(): Promise<Workout[]> {
    try {
      const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

      const rows = await db.getAllAsync('SELECT * FROM workout') as WorkoutRow[];
      return rows.map(row => new Workout(row.id, "sample title", row.starttime, row.endtime));
    }
    catch (error) {
      console.error('Failed to find all workouts:', error);
      return [];
    }
  }

  static async removeAll() {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    await db.runAsync('DELETE FROM workout');

    return true;
  }

  static async endWorkout(id: number, endtime: string) {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    await db.runAsync('UPDATE workout SET endtime = ? WHERE id = ?', [endtime, id]);

    return true;
  }

  static async findAllFinished(): Promise<Workout[]> {
    try {
      const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

      const rows = await db.getAllAsync('SELECT * FROM workout WHERE endtime IS NOT NULL') as WorkoutRow[];
      return rows.map(row => new Workout(row.id, "sample title", row.starttime, row.endtime));
    }
    catch (error) {
      console.error('Failed to find all finished workouts:', error);
      return [];
    }
  }

  static async delete(id: number) {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    await db.runAsync('DELETE FROM workout WHERE id = ?', [id]);

    return true;
  }
}
