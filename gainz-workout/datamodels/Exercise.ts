import * as SQLite from 'expo-sqlite';
import { Equipment } from './Equipment';
import { db } from '@/database/database';
import BaseEntity from './base/BaseEntity';

export type ExerciseRow = {
  id: number;
  name: string;
  description: string;
  musclegroupid: number;
};

export class Exercise extends BaseEntity {
  name: string;
  description: string;
  musclegroupid: number;
  label: string;
  value: string;

  constructor(id: number, name: string, description: string, musclegroupid: number) {
    super(id, new Date(), new Date());
    this.name = name;
    this.description = description;
    this.musclegroupid = musclegroupid;

    this.label = name;
    this.value = id.toString();
  }

  static async create(name: string, description: string, musclegroupid: number) {
    const existingExercise = await db.instance.getFirstAsync('SELECT * FROM exercises WHERE name = ?', [name]);

    if (existingExercise) {
      throw new Error('Exercise with the same name already exists');
    }

    const result = await db.instance.runAsync(
      `INSERT INTO exercises (name, description, musclegroupid) VALUES (?, ?, ?);`,
      [name, description, musclegroupid]
    );

    return new Exercise(result.lastInsertRowId, name, description, musclegroupid);
  }

  static async findAll(): Promise<Exercise[]> {
    const rows = await db.instance.getAllAsync('SELECT * FROM exercises') as ExerciseRow[];
    return rows.map(row => new Exercise(row.id, row.name, row.description, row.musclegroupid));
  }

  static async removeAll() {
    await db.instance.runAsync('DELETE FROM exercises');

    return true;
  }

  static async findIdByName(name: string): Promise<number | null> {
    const result = await db.instance.getFirstAsync('SELECT id FROM exercises WHERE name = ?', [name]) as { id: number };
    return result.id;
  }

  static async findRecent(limit: number): Promise<ExerciseRow[]> {
    const lastWorkouts = await db.instance.getAllAsync(
      `SELECT id FROM workouts ORDER BY id DESC LIMIT ?`,
      [limit]
    ) as Array<{ id: number }>;

    if (lastWorkouts.length === 0) {
      return [];
    }

    const workoutIds = lastWorkouts.map(workout => workout.id).join(',');

    const rows = await db.instance.getAllAsync(
      `SELECT exercise.* FROM exercises
       JOIN sets ON exercise.id = exercisesets.exerciseid
       JOIN batches ON exercisesets.batchid = batches.id
       JOIN workouts ON batches.workoutid = workouts.id
       WHERE workouts.id IN (${workoutIds})
       GROUP BY exercise.id
       ORDER BY MAX(workouts.starttime) DESC`
    ) as ExerciseRow[];

    return rows.slice(0, limit);
  }

  static async getEquipmentsForExercise(exerciseId: number): Promise<Equipment[]> {
    const rows = await db.instance.getAllAsync(
      `SELECT equipment.* FROM equipment
       JOIN exercise_equipment ON equipment.id = exercise_equipment.equipmentid
       WHERE exercise_equipment.exerciseid = ?`,
      [exerciseId]
    ) as Array<{ id: number, name: string }>;

    return rows.map(row => new Equipment(row.id, row.name));
  }

  static async delete(id: number) {
    await db.instance.runAsync('DELETE FROM exercises WHERE id = ?', [id]);

    return true;
  }

  static async findById(id: number): Promise<Exercise> {
    const row = await db.instance.getFirstAsync('SELECT * FROM exercises WHERE id = ?', [id]) as ExerciseRow;

    return new Exercise(row.id, row.name, row.description, row.musclegroupid);
  }

  static async findByEquipment(equipmentId: number): Promise<Exercise[]> {
    const rows = await db.instance.getAllAsync(
      `SELECT exercises.* FROM exercises
       JOIN exercise_equipment ON exercise.id = exercise_equipment.exerciseid
       WHERE exercise_equipment.equipmentid = ?`,
      [equipmentId]
    ) as ExerciseRow[];

    return rows.map(row => new Exercise(row.id, row.name, row.description, row.musclegroupid));
  }

  static async findByMuscleGroup(muscleGroupId: number): Promise<Exercise[]> {
    const rows = await db.instance.getAllAsync('SELECT * FROM exercises WHERE musclegroupid = ?', [muscleGroupId]) as ExerciseRow[];

    return rows.map(row => new Exercise(row.id, row.name, row.description, row.musclegroupid));
  }

  static async findByAttachment(attachmentId: number): Promise<Exercise[]> {
    const rows = await db.instance.getAllAsync(
      `SELECT exercise.* FROM exercises
       JOIN exercise_attachment ON exercise.id = exercise_attachment.exerciseid
       WHERE exercise_attachment.attachmentid = ?`,
      [attachmentId]
    ) as ExerciseRow[];

    return rows.map(row => new Exercise(row.id, row.name, row.description, row.musclegroupid));
  }

  static async findByEquipmentAndAttachment(equipmentId: number, attachmentId: number): Promise<Exercise[]> {
    const rows = await db.instance.getAllAsync(
      `SELECT exercise.* FROM exercises
       JOIN exercise_equipment ON exercise.id = exercise_equipment.exerciseid
       JOIN exercise_attachment ON exercise.id = exercise_attachment.exerciseid
       WHERE exercise_equipment.equipmentid = ? AND exercise_attachment.attachmentid = ?`,
      [equipmentId, attachmentId]
    ) as ExerciseRow[];

    return rows.map(row => new Exercise(row.id, row.name, row.description, row.musclegroupid));
  }
}