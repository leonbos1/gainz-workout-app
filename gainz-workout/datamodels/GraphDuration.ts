import { db } from '@/database/database';
import BaseEntity from './base/BaseEntity';

export type GraphDurationRow = {
    id: number;
    name: string;
    value: number;
};

export class GraphDuration extends BaseEntity {
    name: string;
    value: number;

    constructor(id: number, name: string, value: number) {
        super(id, new Date(), new Date());
        this.name = name;
        this.value = value;
    }

    static async findAll(): Promise<GraphDuration[]> {
        const rows = await db.instance.getAllAsync('SELECT * FROM graphDurations') as GraphDurationRow[];

        return rows.map(row => new GraphDuration(row.id, row.name, row.value));
    }

    static async findById(id: number): Promise<GraphDuration> {
        const row = await db.instance.getFirstAsync('SELECT * FROM graphDurations WHERE id = ?', [id]) as GraphDurationRow;

        return new GraphDuration(row.id, row.name, row.value);
    }
}