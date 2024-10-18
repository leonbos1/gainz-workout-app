import { Database } from '@/database/database';
import * as SQLite from 'expo-sqlite';

export type AttachmentRow = {
    id: number;
    name: string;
};

export class Attachment {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static async findAll(): Promise<Attachment[]> {
        const db = await Database.getDbConnection();

        const rows = await db.getAllAsync('SELECT * FROM attachment') as AttachmentRow[];
        return rows.map(row => new Attachment(row.id, row.name));
    }
}