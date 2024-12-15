import { Batch } from "@/datamodels/Batch";
import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";

export class BatchRepository extends BaseRepository<Batch> {
    async initTable(): Promise<void> {
        await db.runAsync(`
      CREATE TABLE IF NOT EXISTS batches (
        id INTEGER PRIMARY KEY AUTOINCREMENT
        workout_id INTEGER NOT NULL,
        note TEXT NOT NULL,
        equipment_id INTEGER NOT NULL,
        attachment_id INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (workoutid) REFERENCES workouts(id),
        FOREIGN KEY (equipmentid) REFERENCES equipment(id),
        FOREIGN KEY (attachmentid) REFERENCES attachments(id)
      )
    `);
    }
}