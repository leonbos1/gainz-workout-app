import { Database } from '@/database/database';
import * as SQLite from 'expo-sqlite';

export type EquipmentRow = {
    id: number;
    name: string;
};

export class Equipment {
    id: number;
    name: string;
    label: string;
    value: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.label = name;
        this.value = id.toString();
    }

    static async findAll(): Promise<Equipment[]> {
        const db = await Database.getDbConnection();

        const rows = await db.getAllAsync('SELECT * FROM equipment') as EquipmentRow[];
        return rows.map(row => new Equipment(row.id, row.name));
    }

    static async create(name: string): Promise<Equipment> {
        const db = await Database.getDbConnection();

        const result = await db.runAsync('INSERT INTO equipment (name) VALUES (?)', [name]);
        const id = result.lastInsertRowId;

        return new Equipment(id, name);
    }
}