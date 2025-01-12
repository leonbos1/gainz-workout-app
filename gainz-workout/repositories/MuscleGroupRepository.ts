import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";
import { MuscleGroup } from "@/datamodels/MuscleGroup";

export class MuscleGroupRepository extends BaseRepository<MuscleGroup> {
  async initTable(): Promise<void> {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS musclegroups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);
  }
}