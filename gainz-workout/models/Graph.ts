import { Database } from '@/database/database';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import * as SQLite from 'expo-sqlite';

export type GraphRow = {
    id: number;
    graph_typeid: number;
    exerciseid: number;
    enabled: boolean;
    graph_durationid: number;
};

export class Graph {
    id: number;
    graph_typeid: number;
    exerciseid: number;
    enabled: boolean;
    graph_durationid: number;

    constructor(id: number, graph_typeid: number, exerciseid: number, enabled: boolean, graph_durationid: number) {
        this.id = id;
        this.graph_typeid = graph_typeid;
        this.exerciseid = exerciseid;
        this.enabled = enabled;
        this.graph_durationid = graph_durationid;
    }

    static async findAll(): Promise<Graph[]> {
        const db = await Database.getDbConnection();

        const rows = await db.getAllAsync('SELECT * FROM graph') as GraphRow[];
        console.log(rows);

        return rows.map(row => new Graph(row.id, row.graph_typeid, row.exerciseid, row.enabled, row.graph_durationid));
    }

    static async create(graph_typeid: number, exerciseid: number, enabled: boolean, graph_durationid: number): Promise<Graph> {
        try {
            const db = await Database.getDbConnection();

            const existingGraph = await db.getFirstAsync('SELECT * FROM graph WHERE graph_typeid = ? AND exerciseid = ? AND graph_durationid = ?', [graph_typeid, exerciseid, graph_durationid]);

            if (existingGraph) {
                throw new Error('Graph with the same type and exercise already exists');
            }

            const result = await db.runAsync(
                `INSERT INTO graph (graph_typeid, exerciseid, enabled, graph_durationid) VALUES (?, ?, ?, ?)`,
                [graph_typeid, exerciseid, enabled, graph_durationid]
            );

            return new Graph(result.lastInsertRowId, graph_typeid, exerciseid, enabled, graph_durationid);
        }
        catch (error) {
            console.error("Error adding graph: ", error);
            return new Graph(1, 1, 1, false, 1);
        }
    }

    static async findAllEnabled(): Promise<Graph[]> {
        const db = await Database.getDbConnection();

        const rows = await db.getAllAsync('SELECT * FROM graph WHERE enabled = 1') as GraphRow[];
        console.log(rows);

        return rows.map(row => new Graph(row.id, row.graph_typeid, row.exerciseid, row.enabled, row.graph_durationid));
    }

    static async findAllAsViewModel(): Promise<GraphViewModel[]> {
        try {
            const db = await Database.getDbConnection();

            const rows = await db.getAllAsync('SELECT * FROM graph') as GraphRow[];

            const viewModels = await Promise.all(
                rows.map(row => GraphViewModel.create(row))
            );

            return viewModels;
        }
        catch (error) {
            console.error('Error fetching graphs as view model:', error);
        }
        return [];
    }

    static async updateEnabled(id: number, enabled: boolean): Promise<void> {
        const db = await Database.getDbConnection();

        await db.runAsync('UPDATE graph SET enabled = ? WHERE id = ?', [enabled, id]);

        console.log('updated graph enabled with id:', id);
    }
}