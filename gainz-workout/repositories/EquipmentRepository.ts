import { Equipment } from "@/datamodels/Equipment";
import BaseRepository from "./base/BaseRepository";
import { db } from "@/database/database";

export class EquipmentRepository extends BaseRepository<Equipment> {
  async initTable(): Promise<void> {
    await db.instance.runAsync(`
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
  }
}