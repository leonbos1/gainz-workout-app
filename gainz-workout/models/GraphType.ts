import { Database } from '@/database/database';
import * as SQLite from 'expo-sqlite';

export type GraphTypeRow = {
    id: number;
    name: string;
};

export class GraphType {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        console.log('GraphType constructor id:', id, 'name:', name);
        this.id = id;
        this.name = name;
    }

    static async findAll(): Promise<GraphType[]> {
        const db = await Database.getDbConnection();

        const rows = await db.getAllAsync('SELECT * FROM graph_type') as GraphTypeRow[];
        console.log('Database rows:', rows); // Log the rows to inspect the structure

        return rows.map(row => new GraphType(row.id, row.name as string));
    }

    static async findById(id: number): Promise<GraphType> {
        const db = await Database.getDbConnection();

        const row = await db.getFirstAsync('SELECT * FROM graph_type WHERE id = ?', [id]) as GraphTypeRow;

        return new GraphType(row.id, row.name);
    }
}