import * as SQLite from 'expo-sqlite';

export type ExerciseRow = {
  id: number;
  name: string;
  description: string;
  musclegroupid: number;
};

export class Exercise {
  id: number;
  name: string;
  description: string;
  musclegroupid: number;

  constructor(id: number, name: string, description: string, musclegroupid: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.musclegroupid = musclegroupid;
  }

  static async create(name: string, description: string, musclegroupid: number) {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const existingExercise = await db.getFirstAsync('SELECT * FROM exercise WHERE name = ?', [name]);

    if (existingExercise) {
      throw new Error('Exercise with the same name already exists');
    }

    const result = await db.runAsync(
      `INSERT INTO exercise (name, description, musclegroupid) VALUES (?, ?, ?);`,
      [name, description, musclegroupid]
    );
    return new Exercise(result.lastInsertRowId, name, description, musclegroupid);
  }

  static async findAll(): Promise<Exercise[]> {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const rows = await db.getAllAsync('SELECT * FROM exercise') as ExerciseRow[];
    return rows.map(row => new Exercise(row.id, row.name, row.description, row.musclegroupid));
  }

  static async removeAll() {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    await db.runAsync('DELETE FROM exercise');

    return true;
  }

  static async findIdByName(name: string): Promise<number> {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const result = await db.getFirstAsync('SELECT id FROM exercise WHERE name = ?', [name]) as { id: number };
    return result.id;
  }

  static async findRecent(limit: number): Promise<ExerciseRow[]> {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    const lastWorkouts = await db.getAllAsync(
      `SELECT id FROM workout ORDER BY id DESC LIMIT ?`,
      [limit]
    ) as Array<{ id: number }>;

    if (lastWorkouts.length === 0) {
      return [];
    }

    const workoutIds = lastWorkouts.map(workout => workout.id).join(',');

    const rows = await db.getAllAsync(
      `SELECT exercise.* FROM exercise
       JOIN exerciseset ON exercise.id = exerciseset.exerciseid
       JOIN batch ON exerciseset.batchid = batch.id
       JOIN workout ON batch.workoutid = workout.id
       WHERE workout.id IN (${workoutIds})
       GROUP BY exercise.id
       ORDER BY MAX(workout.starttime) DESC`
    ) as ExerciseRow[];

    return rows.slice(0, limit);
  }
}