import * as SQLite from 'expo-sqlite';
import data from '../database_seed/data.json';
import { attachmentRepository, equipmentRepository, exerciseEquipmentRepository, exerciseRepository, graphDurationRepository, graphRepository, graphTypeRepository, muscleGroupRepository, repositories, seedStatusRepository } from '@/import';
import { SeedStatus } from '@/datamodels/SeedStatus';
import { MuscleGroup } from '@/datamodels/MuscleGroup';
import { Exercise } from '@/datamodels/Exercise';
import { GraphDuration } from '@/datamodels/GraphDuration';
import { GraphType } from '@/datamodels/GraphType';
import { Graph } from '@/datamodels/Graph';
import { Equipment } from '@/datamodels/Equipment';
import { Attachment } from '@/datamodels/Attachment';
import { ExerciseEquipment } from '@/datamodels/ExerciseEquipment';

export const dropTables = async () => {
  try {
    repositories.reverse().forEach(async repo => {
      await repo.dropTable();
    });
  }
  catch (error) {
    console.error(error);
  }
};

export const createTables = async () => {
  repositories.forEach(async repo => {
    await repo.initTable();
  });
};

type seedStatusRow = {
  id: number;
  status: string;
}

export const seedDatabase = async () => {
  const selectStatement = await db.instance.getFirstAsync('SELECT * FROM seedStatus where id = 1') as seedStatusRow;

  if (selectStatement && selectStatement.status === 'seeded') {
    return;
  }

  await seedStatusRepository.create(new SeedStatus(1, "seeded"));
  var musclegroups = data.musclegroups.map(async (mg) => await muscleGroupRepository.create(new MuscleGroup(mg.id, mg.name)))
  var exercises = data.exercises.map(async (ex) => await exerciseRepository.create(new Exercise(ex.id, ex.name, ex.description, ex.musclegroupid)))
  var graph_durations = data.graph_durations.map(async (gd) => await graphDurationRepository.create(new GraphDuration(gd.id, gd.name, gd.value)))
  var graph_types = data.graph_types.map(async (gd) => await graphTypeRepository.create(new GraphType(gd.id, gd.name)))
  var graphs = data.graphs.map(async (g) => await graphRepository.create(new Graph(g.id, g.graph_type_id, g.exercise_id, g.enabled, g.graph_duration_id)))
  var equipment = data.equipment.map(async (e) => await equipmentRepository.create(new Equipment(e.id, e.name)))
  var attachments = data.attachments.map(async (e) => await attachmentRepository.create(new Attachment(e.id, e.name)))
  var exercise_equipments = data.exerciseEquipment.map(async (eq) => await exerciseEquipmentRepository.create(new ExerciseEquipment(eq.id, eq.exerciseid, eq.equipmentid)))
}

let _db: SQLite.SQLiteDatabase | null = null;

(async () => {
  _db = await SQLite.openDatabaseAsync('gainz.db');
})();

export const db = {
  get instance(): SQLite.SQLiteDatabase {
    if (!_db) {
      throw new Error("Database has not been initialized yet");
    }
    return _db;
  }
};