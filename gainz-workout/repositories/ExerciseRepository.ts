import { Exercise } from "@/models/Exercise";
import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";

export class ExerciseRepository extends BaseRepository<Exercise> {
  async initTable(): Promise<void> {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      musclegroupid INTEGER,
      FOREIGN KEY (musclegroupid) REFERENCES musclegroup(id)
      )
    `);
  }
}