import * as SQLite from 'expo-sqlite';

export const dropTables = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

    await db.execAsync(`
    DROP TABLE IF EXISTS exerciseset;
    DROP TABLE IF EXISTS batch;
    DROP TABLE IF EXISTS workout;
    DROP TABLE IF EXISTS exercise;
    DROP TABLE IF EXISTS musclegroup
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
  `);
};