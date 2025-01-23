import { Database } from '@/database/database';
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
    const db = await Database.getDbConnection();

    const result = await db.runAsync(
      `INSERT INTO workout (starttime, endtime) VALUES (?, ?);`,
      [starttime, endtime]
    );
    return new Workout(result.lastInsertRowId, "sample title", starttime, endtime);
  }

  public static async findAll(): Promise<Workout[]> {
    try {
      const db = await Database.getDbConnection();

      const rows = await db.getAllAsync('SELECT * FROM workout') as WorkoutRow[];
      return rows.map(row => new Workout(row.id, "sample title", row.starttime, row.endtime));
    }
    catch (error) {
      console.error('Failed to find all workouts:', error);
      return [];
    }
  }

  static async removeAll() {
    const db = await Database.getDbConnection();

    await db.runAsync('DELETE FROM workout');

    return true;
  }

  static async endWorkout(id: number, endtime: string) {
    const db = await Database.getDbConnection();

    await db.runAsync('UPDATE workout SET endtime = ? WHERE id = ?', [endtime, id]);

    return true;
  }

  static async findAllFinished(limit: number, page: number): Promise<Workout[]> {
    try {
      const db = await Database.getDbConnection();

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
    const db = await Database.getDbConnection();

    await db.runAsync('DELETE FROM workout WHERE id = ?', [id]);

    return true;
  }

  static async getWorkoutsPerWeek(weeks: number): Promise<WorkoutWeekData> {
    const db = await Database.getDbConnection();

    // Fetch workout counts grouped by week
    const rows = await db.getAllAsync(`
      SELECT strftime('%Y-%W', starttime) as year_week, COUNT(*) as count
      FROM workout
      WHERE endtime IS NOT NULL and endtime != ''
      GROUP BY year_week
      ORDER BY year_week DESC
      LIMIT ?
    `, [weeks]) as { year_week: string, count: number }[];

    // Initialize an array for workout counts, filling with zeros
    const data: number[] = new Array(weeks).fill(0);

    // Get the current year and current week of the year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentWeek = Math.ceil((currentDate.getTime() - new Date(currentYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

    // Map rows to data array based on year and week
    for (const row of rows) {
      const [year, week] = row.year_week.split('-').map(Number);
      const count = row.count;

      // Calculate the difference in weeks from the current week and year
      let weekDifference = (currentYear - year) * 52 + (currentWeek - week);

      // Ensure index is within bounds before updating data array
      if (weekDifference >= 0 && weekDifference < weeks) {
        data[weeks - 1 - weekDifference] = count;
      }
    }

    // Generate labels for the last 'weeks' number of weeks
    const labels: string[] = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }

    if (labels.length !== data.length) {
      throw new Error("Labels and data arrays have different lengths.");
    }

    const workoutData = new WorkoutWeekData('Workouts Per Week', labels, [{ data }]);

    return workoutData;
  }

  static async getById(id: number): Promise<Workout> {
    const db = await Database.getDbConnection();

    const row = await db.getFirstAsync('SELECT * FROM workout WHERE id = ?', [id]) as WorkoutRow;

    return new Workout(row.id, "", row.starttime, row.endtime);
  }

  static async deleteFullWorkout(workoutId: number) {
    const db = await Database.getDbConnection();

    // first delete all batches and sets, then delete the workout
    const batchIds = await db.getAllAsync('SELECT id FROM batch WHERE workoutid = ?', [workoutId]) as { id: number }[];

    const setIds = await Promise.all(batchIds.map(async (batch) => {
      return await db.getAllAsync('SELECT id FROM exerciseset WHERE batchid = ?', [batch.id]) as { id: number }[];
    }));

    const setIdList = setIds.flat().map(set => set.id).join(',');
    await db.runAsync(`DELETE FROM exerciseset WHERE batchid IN (${setIdList})`);
    await db.runAsync('DELETE FROM batch WHERE workoutid = ?', [workoutId]);
    await db.runAsync('DELETE FROM workout WHERE id = ?', [workoutId]);

    return true;
  }
}