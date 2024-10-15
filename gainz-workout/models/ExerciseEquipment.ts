import * as SQLite from 'expo-sqlite';

export type ExerciseEquipmentRow = {
    id: number;
    exerciseid: number;
    equipmentid: number;
};

export class ExerciseEquipment {
    id: number;
    exerciseid: number;
    equipmentid: number;

    constructor(id: number, exerciseid: number, equipmentid: number) {
        this.id = id;
        this.exerciseid = exerciseid;
        this.equipmentid = equipmentid;
    }
}
