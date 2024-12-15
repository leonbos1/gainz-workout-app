import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";
import { Workout } from "@/datamodels/Workout";

export class WorkoutRepository extends BaseRepository<Workout> {
    async initTable(): Promise<void> {
        await db.runAsync(`
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    }
}