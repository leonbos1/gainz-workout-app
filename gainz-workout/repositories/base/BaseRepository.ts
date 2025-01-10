import BaseEntity from '@/datamodels/base/BaseEntity';
import { db } from '@/database/database';

export default abstract class BaseRepository<T extends BaseEntity> {
    public table: string;

    constructor(table: string) {
        this.table = table;
    }

    abstract initTable(): Promise<void>;

    async dropTable(): Promise<void> {
        console.log(`Dropping table ${this.table}`);
        try {
            await db.instance.execAsync(`DROP TABLE ${this.table}`);
        }
        catch (error) {
            console.error(`Error dropping table ${this.table}: ${error}`);
        }
        finally {
            await db.instance.closeAsync();
        }
    }

    async getAll(): Promise<T[]> {
        const result = await db.instance.getAllAsync(`SELECT * FROM ${this.table}`);
        return result as T[];
    }

    async getById(id: number): Promise<T | null> {
        const result = await db.instance.getAllAsync(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
        return result.length > 0 ? (result[0] as T) : null;
    }

    async create(entity: Partial<T>): Promise<number> {
        const keys = Object.keys(entity).join(', ');
        const placeholders = Object.keys(entity).map(() => '?').join(', ');
        const values = Object.values(entity);

        const result = await db.instance.runAsync(
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

        await db.instance.runAsync(`UPDATE ${this.table} SET ${setClause} WHERE id = ?`, values);
    }

    async delete(id: number): Promise<void> {
        await db.instance.runAsync(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    }
}
