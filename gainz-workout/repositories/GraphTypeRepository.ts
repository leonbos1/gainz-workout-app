import { GraphType } from "@/datamodels/GraphType";
import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";

export class GraphTypeRepository extends BaseRepository<GraphType> {
    async initTable(): Promise<void> {
        await db.runAsync(`
      CREATE TABLE IF NOT EXISTS graph_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    }
}