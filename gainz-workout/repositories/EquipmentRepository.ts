import { Equipment } from "@/models/Equipment";
import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";

export class EquipmentRepository extends BaseRepository<Equipment> {
    async initTable(): Promise<void> {
        await db.runAsync(`
      CREATE TABLE IF NOT EXISTS equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    }
}