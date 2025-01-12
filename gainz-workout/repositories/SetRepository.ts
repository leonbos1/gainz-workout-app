import { Set } from "@/datamodels/Set";
import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";

export class SetRepository extends BaseRepository<Set> {
  async initTable(): Promise<void> {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT
        exerciseid INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        weight REAL,
        rpe REAL,
        batchid INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (exerciseid) REFERENCES exercise(id),
        FOREIGN KEY (batchid) REFERENCES batch(id)
        )
    `);
  }
}