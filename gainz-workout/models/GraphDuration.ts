import { Database } from '@/database/database';
import * as SQLite from 'expo-sqlite';

export type GraphDurationRow = {
    id: number;
    name: string;
    value: number;
};

export class GraphDuration {
    id: number;
    name: string;
    value: number;

    constructor(id: number, name: string, value: number) {
        this.id = id;
        this.name = name;
        this.value = value;
    }

    static async findAll(): Promise<GraphDuration[]> {
        const db = await Database.getDbConnection();

        const rows = await db.getAllAsync('SELECT * FROM graph_duration') as GraphDurationRow[];

        return rows.map(row => new GraphDuration(row.id, row.name, row.value));
    }
}