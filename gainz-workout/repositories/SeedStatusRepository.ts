import { SeedStatus } from "@/datamodels/SeedStatus";
import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";

export class AttachmentRepository extends BaseRepository<SeedStatus> {
    async initTable(): Promise<void> {
        await db.runAsync(`
      CREATE TABLE IF NOT EXISTS seedstatus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    }
}