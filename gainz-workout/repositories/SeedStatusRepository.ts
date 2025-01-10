import { SeedStatus } from "@/datamodels/SeedStatus";
import BaseRepository from "./base/BaseRepository";
import { db } from "@/database/database";

export class SeedStatusRepository extends BaseRepository<SeedStatus> {
  async initTable(): Promise<void> {
    await db.instance.runAsync(`
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
  }
}