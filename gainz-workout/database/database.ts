import * as SQLite from 'expo-sqlite';
import data from '../database_seed/data.json';

export const dropTables = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    await db.execAsync(`
    DROP TABLE IF EXISTS exerciseset;
    DROP TABLE IF EXISTS batch;
    DROP TABLE IF EXISTS workout;
    DROP TABLE IF EXISTS exercise;
    DROP TABLE IF EXISTS musclegroup;
    DROP TABLE IF EXISTS attachment;
    DROP TABLE IF EXISTS equipment;
    DROP TABLE IF EXISTS seed_status;
    DROP TABLE IF EXISTS exercise_equipment;
    DROP TABLE IF EXISTS graph;
    DROP TABLE IF EXISTS graph_type;
    DROP TABLE IF EXISTS graph_duration;
  `);
  }
  catch (error) {
    console.error(error);
  }
};

export const createTables = async () => {
  const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS musclegroup (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exercise (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      musclegroupid INTEGER,
      FOREIGN KEY (musclegroupid) REFERENCES musclegroup(id)
    );

    CREATE TABLE IF NOT EXISTS workout (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      starttime DATETIME NOT NULL,
      endtime DATETIME
    );

    CREATE TABLE IF NOT EXISTS batch (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutid INTEGER NOT NULL,
      note TEXT,
      equipmentid INTEGER,
      attachmentid INTEGER,
      FOREIGN KEY (equipmentid) REFERENCES equipment(id),
      FOREIGN KEY (attachmentid) REFERENCES attachment(id),
      FOREIGN KEY (workoutid) REFERENCES workout(id)
    );

    CREATE TABLE IF NOT EXISTS exerciseset (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exerciseid INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      weight REAL,
      rpe REAL,
      batchid INTEGER NOT NULL,
      FOREIGN KEY (exerciseid) REFERENCES exercise(id),
      FOREIGN KEY (batchid) REFERENCES batch(id)
    );

    CREATE TABLE IF NOT EXISTS attachment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seed_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exercise_equipment (
      exerciseid INTEGER,
      equipmentid INTEGER,
      FOREIGN KEY (exerciseid) REFERENCES exercise(id),
      FOREIGN KEY (equipmentid) REFERENCES equipment(id),
      PRIMARY KEY (exerciseid, equipmentid)
    );

    CREATE TABLE IF NOT EXISTS graph_type (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS graph_duration (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS graph (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      graph_typeid INTEGER NOT NULL,
      exerciseid INTEGER NOT NULL,
      graph_durationid INTEGER NOT NULL,
      FOREIGN KEY (exerciseid) REFERENCES exercise(id)
      FOREIGN KEY (graph_typeid) REFERENCES graph_type(id)
      FOREIGN KEY (graph_durationid) REFERENCES graph_duration(id)
    );
  `);
};

type seedStatusRow = {
  id: number;
  status: string;
}

export const seedDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

  const selectStatement = await db.getFirstAsync('SELECT * FROM seed_status where id = 1') as seedStatusRow;

  if (selectStatement && selectStatement.status === 'seeded') {
    return;
  }

  await db.runAsync('INSERT INTO seed_status (id, status) VALUES (1, "seeded")');

  await db.execAsync(`
    INSERT INTO musclegroup (name) VALUES ${data.musclegroups.map((name) => `("${name}")`).join(', ')};

    INSERT INTO exercise (name, musclegroupid) VALUES ${data.exercises.map((exercise) => {
    const musclegroupid = data.musclegroups.indexOf(exercise.musclegroup) + 1;
    return `("${exercise.name}", ${musclegroupid})`;
  }).join(', ')};

    INSERT INTO graph_duration (name, value) VALUES ${data.graph_durations.map((duration) => `("${duration.name}", ${duration.value})`).join(', ')};

    INSERT INTO graph_type (name) VALUES ${data.graph_types.map((name) => `("${name}")`).join(', ')};

    INSERT INTO equipment (name) VALUES ${data.equipment.map((name) => `("${name}")`).join(', ')};

    INSERT INTO attachment (name) VALUES ${data.attachments.map((name) => `("${name}")`).join(', ')};

    INSERT INTO exercise_equipment(exerciseid, equipmentid) VALUES ${data.exerciseEquipment.map((equipment) => {
    //TODO: this assumes when data is seeded, database is empty and it assumes that everything is inserted correctly
    const exerciseid = data.exercises.findIndex((exercise) => exercise.name === equipment.exercise) + 1;
    const equipmentid = data.equipment.indexOf(equipment.equipment) + 1;

    return `(${exerciseid}, ${equipmentid})`;
  }).join(', ')
    };
  `);
}

export class Database {
  static _dbInstance: SQLite.SQLiteDatabase | null = null;

  static async getDbConnection(): Promise<SQLite.SQLiteDatabase> {
    if (Database._dbInstance) {
      return Database._dbInstance;
    }
    Database._dbInstance = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: false });
    return Database._dbInstance;
  }
}