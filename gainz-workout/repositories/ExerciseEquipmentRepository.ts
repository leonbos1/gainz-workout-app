import { ExerciseEquipment } from "@/datamodels/ExerciseEquipment";
import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";

export class ExerciseEquipmentRepository extends BaseRepository<ExerciseEquipment> {
    async initTable(): Promise<void> {
        await db.runAsync(`
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT
        exerciseid INTEGER,
        equipmentid INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (exerciseid) REFERENCES exercise(id),
        FOREIGN KEY (equipmentid) REFERENCES equipment(id)
        )
    `);
    }
}