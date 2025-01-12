import db from '@/database/database';

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
        const rows = await db.getAllAsync('SELECT * FROM graph_duration') as GraphDurationRow[];

        return rows.map(row => new GraphDuration(row.id, row.name, row.value));
    }

    static async findById(id: number): Promise<GraphDuration> {
        const row = await db.getFirstAsync('SELECT * FROM graph_duration WHERE id = ?', [id]) as GraphDurationRow;

        return new GraphDuration(row.id, row.name, row.value);
    }
}