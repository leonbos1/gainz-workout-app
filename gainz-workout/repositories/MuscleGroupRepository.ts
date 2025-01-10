import BaseRepository from "./base/BaseRepository";
import { db } from "@/database/database";
import { MuscleGroup } from "@/datamodels/MuscleGroup";

export class MuscleGroupRepository extends BaseRepository<MuscleGroup> {
  async initTable(): Promise<void> {
    await db.instance.runAsync(`
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);
  }
}