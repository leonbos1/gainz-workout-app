import { Database } from '@/database/database';
import * as SQLite from 'expo-sqlite';

export type GraphRow = {
    id: number;
    graph_typeid: number;
    exerciseid: number;
    enabled: boolean;
};

export class Graph {
    id: number;
    graph_typeid: number;
    exerciseid: number;
    enabled: boolean;

    constructor(id: number, graph_typeid: number, exerciseid: number, enabled: boolean) {
        this.id = id;
        this.graph_typeid = graph_typeid;
        this.exerciseid = exerciseid;
        this.enabled = enabled;
    }

    static async findAll(): Promise<Graph[]> {
        const db = await Database.getDbConnection();

        const rows = await db.getAllAsync('SELECT * FROM graph') as GraphRow[];

        return rows.map(row => new Graph(row.id, row.graph_typeid, row.exerciseid, row.enabled));
    }

    static async create(graph_typeid: number, exerciseid: number, enabled: boolean) {
        const db = await Database.getDbConnection();

        const existingGraph = await db.getFirstAsync('SELECT * FROM graph WHERE graph_typeid = ? AND exerciseid = ?', [graph_typeid, exerciseid]);

        if (existingGraph) {
            throw new Error('Graph with the same type and exercise already exists');
        }

        const result = await db.runAsync(
            `INSERT INTO graph (graph_typeid, exerciseid, enabled) VALUES (?, ?, ?);`,
            [graph_typeid, exerciseid, enabled]
        );

        return new Graph(result.lastInsertRowId, graph_typeid, exerciseid, enabled);
    }
}