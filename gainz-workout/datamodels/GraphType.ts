import db from '@/database/database';
import BaseEntity from './base/BaseEntity';

export type GraphTypeRow = {
    id: number;
    name: string;
};

export class GraphType extends BaseEntity {
    name: string;

    constructor(id: number, name: string) {
        super(id, new Date(), new Date());
        this.name = name;
    }

    static async findAll(): Promise<GraphType[]> {
        const rows = await db.getAllAsync('SELECT * FROM graph_type') as GraphTypeRow[];

        return rows.map(row => new GraphType(row.id, row.name as string));
    }

    static async findById(id: number): Promise<GraphType> {
        const row = await db.getFirstAsync('SELECT * FROM graph_type WHERE id = ?', [id]) as GraphTypeRow;

        return new GraphType(row.id, row.name);
    }
}