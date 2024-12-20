import * as SQLite from 'expo-sqlite';
import data from '../database_seed/data.json';
import { repositories } from '@/import';

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
  repositories.forEach(repo => {
    repo.initTable();
  });
};

type seedStatusRow = {
  id: number;
  status: string;
}

export const seedDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('gainz.db', { useNewConnection: true });

  const selectStatement = await db.getFirstAsync('SELECT * FROM seed_status where id = 1') as seedStatusRow;

  if (selectStatement && selectStatement.status === 'seeded') {
    return;
  }

  await db.runAsync('INSERT INTO seed_status (id, status) VALUES (1, "seeded")');

  await db.execAsync(`
    INSERT INTO musclegroup (name) VALUES ${data.musclegroups.map((name) => `("${name}")`).join(', ')};

    INSERT INTO exercise (name, musclegroupid) VALUES ${data.exercises.map((exercise) => {
    const musclegroupid = data.musclegroups.indexOf(exercise.musclegroup) + 1;
    return `("${exercise.name}", ${musclegroupid})`;
  }).join(', ')};

    INSERT INTO graph_duration (name, value) VALUES ${data.graph_durations.map((duration) => `("${duration.name}", ${duration.value})`).join(', ')};

    INSERT INTO graph_type (name) VALUES ${data.graph_types.map((graphType) => `("${graphType.name}")`).join(', ')};

    INSERT INTO graph (graph_typeid, exerciseid, graph_durationid, enabled) VALUES ${data.graphs.map((graph) => `(${graph.graph_type_id}, ${graph.exercise_id}, ${graph.graph_duration_id}, ${graph.enabled})`).join(', ')};

    INSERT INTO equipment (name) VALUES ${data.equipment.map((name) => `("${name}")`).join(', ')};

    INSERT INTO attachment (name) VALUES ${data.attachments.map((name) => `("${name}")`).join(', ')};

    INSERT INTO exercise_equipment(exerciseid, equipmentid) VALUES ${data.exerciseEquipment.map((equipment) => {
    //TODO: this assumes when data is seeded, database is empty and it assumes that everything is inserted correctly
    const exerciseid = data.exercises.findIndex((exercise) => exercise.name === equipment.exercise) + 1;
    const equipmentid = data.equipment.indexOf(equipment.equipment) + 1;

    return `(${exerciseid}, ${equipmentid})`;
  }).join(', ')
    };
  `);
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