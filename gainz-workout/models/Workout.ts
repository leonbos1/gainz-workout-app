import * as SQLite from 'expo-sqlite';

export type WorkoutRow = {
  id: number;
  starttime: string;
  endtime: string;
};

export class WorkoutWeekData {
  constructor(title: string, labels: string[], datasets: { data: number[] }[]) {
    this.title = title;
    this.labels = labels;
    this.datasets = datasets
  }

  title: string = '';
  labels: string[] = [];
  datasets: { data: number[]; }[] = [];
}

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

  static async findAllFinished(limit: number): Promise<Workout[]> {
    try {
      const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

      const rows = await db.getAllAsync('SELECT * FROM workout WHERE endtime IS NOT NULL AND endtime != "" ORDER BY starttime DESC LIMIT ?', [limit]) as WorkoutRow[];
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

  static async getWorkoutsPerWeek(weeks: number): Promise<WorkoutWeekData> {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const rows = await db.getAllAsync(`
      SELECT strftime('%W', starttime) as week, COUNT(*) as count
      FROM workout
      WHERE endtime IS NOT NULL and endtime != ''
      GROUP BY week
      ORDER BY week DESC
      LIMIT ?
    `, [weeks]) as { week: string, count: number }[];

    const data: number[] = new Array(weeks).fill(0);

    const currentWeek = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

    for (const row of rows) {
      const week = parseInt(row.week);
      const count = row.count;

      const index = weeks - (currentWeek - week) - 1;
      if (index >= 0 && index < weeks) {
        data[index] = count;
      }
    }

    const labels = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }

    const workoutData = new WorkoutWeekData('Workouts Per Week', labels, [{ data }]);

    return workoutData;
  }

  static async getById(id: number): Promise<Workout> {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const row = await db.getFirstAsync('SELECT * FROM workout WHERE id = ?', [id]) as WorkoutRow;

    return new Workout(row.id, "", row.starttime, row.endtime);
  }
}