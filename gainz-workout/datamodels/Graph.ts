import { db } from '@/database/database';
import { GraphViewModel } from '@/viewmodels/GraphViewModel';
import BaseEntity from './base/BaseEntity';

export type GraphRow = {
    id: number;
    graph_typeid: number;
    exerciseid: number;
    enabled: boolean;
    graph_durationid: number;
};

export class Graph extends BaseEntity {
    graph_typeid: number;
    exerciseid: number;
    enabled: boolean;
    graph_durationid: number;

    constructor(id: number, graph_typeid: number, exerciseid: number, enabled: boolean, graph_durationid: number) {
        super(id, new Date(), new Date());
        this.graph_typeid = graph_typeid;
        this.exerciseid = exerciseid;
        this.enabled = enabled;
        this.graph_durationid = graph_durationid;
    }

    static async findAll(): Promise<Graph[]> {
        const rows = await db.instance.getAllAsync('SELECT * FROM graphs') as GraphRow[];

        return rows.map(row => new Graph(row.id, row.graph_typeid, row.exerciseid, row.enabled, row.graph_durationid));
    }

    static async create(graph_typeid: number, exerciseid: number, enabled: boolean, graph_durationid: number): Promise<Graph> {
        try {
            const existingGraph = await db.instance.getFirstAsync('SELECT * FROM graphs WHERE graph_typeid = ? AND exerciseid = ? AND graph_durationid = ?', [graph_typeid, exerciseid, graph_durationid]);

            if (existingGraph) {
                throw new Error('Graph with the same type and exercise already exists');
            }
        }

        catch (err) {
            console.log(err);
        }

        const result = await db.instance.runAsync(
            `INSERT INTO graph (graph_typeid, exerciseid, enabled, graph_durationid) VALUES (?, ?, ?, ?)`,
            [graph_typeid, exerciseid, enabled, graph_durationid]
        );

        return new Graph(result.lastInsertRowId, graph_typeid, exerciseid, enabled, graph_durationid);
    }

    static async findAllEnabled(): Promise<Graph[]> {
        const rows = await db.instance.getAllAsync('SELECT * FROM graphs WHERE enabled = 1') as GraphRow[];

        return rows.map(row => new Graph(row.id, row.graph_typeid, row.exerciseid, row.enabled, row.graph_durationid));
    }

    static async findAllAsViewModel(): Promise<GraphViewModel[]> {
        try {
            const rows = await db.instance.getAllAsync('SELECT * FROM graphs') as GraphRow[];

            const viewModels = await Promise.all(
                rows.map(row => GraphViewModel.create(row))
            );

            return viewModels;
        }
        catch (error) {
            console.error('Error fetching graphs:', error);
        }
        return [];
    }

    static async updateEnabled(id: number, enabled: boolean): Promise<void> {
        await db.instance.runAsync('UPDATE graphs SET enabled = ? WHERE id = ?', [enabled, id]);

        console.log('updated graph enabled with id:', id);
    }
}