import { Attachment } from "@/models/Attachment";
import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";

export class AttachmentRepository extends BaseRepository<Attachment> {
    async initTable(): Promise<void> {
        await db.runAsync(`
      CREATE TABLE IF NOT EXISTS attachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    }
}