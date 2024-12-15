import BaseEntity from '../models/base/BaseEntity';

export type AttachmentRow = {
    id: number;
    name: string;
};

export class Attachment extends BaseEntity {
    id: number;
    name: string;
    label: string;
    value: string;

    constructor(id: number, name: string) {
        super(id, new Date(), new Date());
        this.id = id;
        this.name = name;
        this.label = name;
        this.value = id.toString();
    }
}