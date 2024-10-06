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

  static async findAllFinished(limit: number, page: number): Promise<Workout[]> {
    try {
      const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

      const offset = (page - 1) * limit;
      const rows = await db.getAllAsync(
        'SELECT * FROM workout WHERE endtime IS NOT NULL AND endtime != "" ORDER BY starttime DESC LIMIT ? OFFSET ?',
        [limit, offset]
      ) as WorkoutRow[];

      return rows.map(row => new Workout(row.id, "sample title", row.starttime, row.endtime));
    } catch (error) {
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

    // Fetch workout counts grouped by week
    const rows = await db.getAllAsync(`
      SELECT strftime('%W', starttime) as week, COUNT(*) as count
      FROM workout
      WHERE endtime IS NOT NULL and endtime != ''
      GROUP BY week
      ORDER BY week DESC
      LIMIT ?
    `, [weeks]) as { week: string, count: number }[];

    // Initialize an array for workout counts, filling with zeros
    const data: number[] = new Array(weeks).fill(0);

    // Get the current week of the year
    const currentWeek = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

    // Loop through the rows and fill the correct index in the data array
    for (const row of rows) {
      const week = parseInt(row.week, 10);
      const count = row.count;

      const index = weeks - (currentWeek - week) - 1;

      // Ensure index is within bounds before updating data array
      if (index >= 0 && index < weeks) {
        data[index] = count;
      }
    }

    // Generate labels for the last 'weeks' number of weeks
    const labels: string[] = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }

    // Ensure labels and data arrays have the same length
    if (labels.length !== data.length) {
      throw new Error("Labels and data arrays have different lengths.");
    }

    // Create the workout data object to return
    const workoutData = new WorkoutWeekData('Workouts Per Week', labels, [{ data }]);

    console.log(workoutData);

    return workoutData;
  }


  static async getById(id: number): Promise<Workout> {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const row = await db.getFirstAsync('SELECT * FROM workout WHERE id = ?', [id]) as WorkoutRow;

    return new Workout(row.id, "", row.starttime, row.endtime);
  }
}