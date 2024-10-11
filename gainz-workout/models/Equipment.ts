import * as SQLite from 'expo-sqlite';

export type EquipmentRow = {
    id: number;
    name: string;
};

export class Equipment {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static async findAll(): Promise<Equipment[]> {
        const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

        const rows = await db.getAllAsync('SELECT * FROM equipment') as EquipmentRow[];
        return rows.map(row => new Equipment(row.id, row.name));
    }
}