import BaseEntity from "../models/base/BaseEntity";

export type ExerciseEquipmentRow = {
    id: number;
    exerciseid: number;
    equipmentid: number;
};

export class ExerciseEquipment extends BaseEntity {
    exerciseid: number;
    equipmentid: number;

    constructor(id: number, exerciseid: number, equipmentid: number) {
        super(id, new Date(), new Date());
        this.exerciseid = exerciseid;
        this.equipmentid = equipmentid;
    }
}
