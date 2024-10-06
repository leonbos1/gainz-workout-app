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
}