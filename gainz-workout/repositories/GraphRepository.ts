import { Graph } from "@/datamodels/Graph";
import BaseRepository from "./base/BaseRepository";
import db from "@/database/database";

export class GraphRepository extends BaseRepository<Graph> {
  async initTable(): Promise<void> {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        graph_typeid INTEGER NOT NULL,
        exerciseid INTEGER NOT NULL,
        graph_durationid INTEGER NOT NULL,
        enabled BOOLEAN NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (exerciseid) REFERENCES exercise(id),
        FOREIGN KEY (graph_typeid) REFERENCES graph_type(id),
        FOREIGN KEY (graph_durationid) REFERENCES graph_duration(id)
      )
    `);
  }
} 