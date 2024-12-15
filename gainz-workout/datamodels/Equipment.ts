import db from '@/database/database';
import BaseEntity from '../models/base/BaseEntity';

export type EquipmentRow = {
    id: number;
    name: string;
};

export class Equipment extends BaseEntity {
    name: string;
    label: string;
    value: string;

    constructor(id: number, name: string) {
        super(id, new Date(), new Date());
        this.name = name;
        this.label = name;
        this.value = id.toString();
    }

    // static async findAll(): Promise<Equipment[]> {
    //     const rows = await db.getAllAsync('SELECT * FROM equipment') as EquipmentRow[];
    //     return rows.map(row => new Equipment(row.id, row.name));
    // }

    // static async create(name: string): Promise<Equipment> {
    //     const result = await db.runAsync('INSERT INTO equipment (name) VALUES (?)', [name]);
    //     const id = result.lastInsertRowId;

    //     return new Equipment(id, name);
    // }


}