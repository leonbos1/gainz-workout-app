import db from '@/database/database';
import BaseEntity from '@/models/base/BaseEntity';

export default abstract class BaseRepository<T extends BaseEntity> {
    protected table: string;

    constructor(table: string) {
        this.table = table;
        this.initTable();
    }

    abstract initTable(): Promise<void>;

    async getAll(): Promise<T[]> {
        const result = await db.getAllAsync(`SELECT * FROM ${this.table}`);
        return result as T[];
    }

    async getById(id: number): Promise<T | null> {
        const result = await db.getAllAsync(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
        return result.length > 0 ? (result[0] as T) : null;
    }

    async create(entity: Partial<T>): Promise<number> {
        const keys = Object.keys(entity).join(', ');
        const placeholders = Object.keys(entity).map(() => '?').join(', ');
        const values = Object.values(entity);

        const result = await db.runAsync(
            `INSERT INTO ${this.table} (${keys}) VALUES (${placeholders})`,
            values
        );

        return result.lastInsertRowId;
    }

    async update(id: number, updates: Partial<T>): Promise<void> {
        const setClause = Object.keys(updates)
            .map((key) => `${key} = ?`)
            .join(', ');
        const values = [...Object.values(updates), id];

        await db.runAsync(`UPDATE ${this.table} SET ${setClause} WHERE id = ?`, values);
    }

    async delete(id: number): Promise<void> {
        await db.runAsync(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    }
}
