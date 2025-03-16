import { Database } from '@/database/database';
import * as SQLite from 'expo-sqlite';

export type GraphDurationRow = {
    id: number;
    name: string;
    days: number;
};

export class GraphDuration {
    id: number;
    name: string;
    days: number;
    label: string;
    value: string;

    constructor(id: number, name: string, days: number) {
        this.id = id;
        this.name = name;
        this.days = days;

        this.label = name;
        this.value = id.toString();
    }

    static async findAll(): Promise<GraphDuration[]> {
        const db = await Database.getDbConnection();

        const rows = await db.getAllAsync('SELECT * FROM graph_duration') as GraphDurationRow[];

        return rows.map(row => new GraphDuration(row.id, row.name, row.days));
    }

    static async findById(id: number): Promise<GraphDuration> {
        const db = await Database.getDbConnection();

        const row = await db.getFirstAsync('SELECT * FROM graph_duration WHERE id = ?', [id]) as GraphDurationRow;

        return new GraphDuration(row.id, row.name, row.days);
    }
}