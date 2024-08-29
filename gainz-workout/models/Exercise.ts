import * as SQLite from 'expo-sqlite';

type ExerciseRow = {
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
      const db = await SQLite.openDatabaseAsync('gainz.db', {useNewConnection: true});

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
      const db = await SQLite.openDatabaseAsync('gainz.db', {useNewConnection: true});

      const rows = await db.getAllAsync('SELECT * FROM exercise') as ExerciseRow[];
      return rows.map(row => new Exercise(row.id, row.name, row.description, row.musclegroupid));
    }

    static async removeAll() {
      const db = await SQLite.openDatabaseAsync('gainz.db', {useNewConnection: true});
  
      await db.runAsync('DELETE FROM exercise');
  
      return true;
    }
  }