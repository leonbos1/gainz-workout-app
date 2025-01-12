import { GraphDuration } from "@/datamodels/GraphDuration";
import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";

export class GraphDurationRepository extends BaseRepository<GraphDuration> {
  async initTable(): Promise<void> {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
  }
}