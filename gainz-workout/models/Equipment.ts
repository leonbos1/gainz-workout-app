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
}