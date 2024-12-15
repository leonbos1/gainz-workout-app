import BaseEntity from "../models/base/BaseEntity";

export type SeedStatusRow = {
    id: number;
    status: string;
};

export class SeedStatus extends BaseEntity {
    status: string;

    constructor(id: number, status: string) {
        super(id, new Date(), new Date());
        this.status = status;
    }
}