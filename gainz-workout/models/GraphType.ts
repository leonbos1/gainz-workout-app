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
        this.id = id;
        this.name = name;
    }

    static async findAll(): Promise<GraphType[]> {
        const db = await Database.getDbConnection();

        const rows = await db.getAllAsync('SELECT * FROM graph_type') as GraphTypeRow[];
        console.log(rows);
        return rows.map(row => new GraphType(row.id, row.name));
    }
}