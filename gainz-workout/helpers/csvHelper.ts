import * as SQLite from 'expo-sqlite';

export interface CSVRow {
    Date: string;
    'Workout Name': string;
    'Exercise Name': string;
    'Set Order': string;
    Weight: string;
    Reps: string;
    RPE: string;
    Notes: string;
}

export async function processCSVRow(db: SQLite.SQLiteDatabase, row: CSVRow) {
    try {
        if (row.Reps === undefined || row.Weight === undefined || row.Reps === '' || row.Weight === '') {
            return;
        }

        const workoutId = await getOrCreateWorkout(db, row.Date);
        const exerciseId = await getOrCreateExercise(db, row['Exercise Name']);

        const batchStatement = await db.prepareAsync(
            'INSERT INTO batch (workoutid, note) VALUES (?, ?)'
        );

        const batchResult: any = await batchStatement.executeAsync([workoutId, row.Notes || '']);
        const batchId = batchResult.lastInsertRowId;

        const setStatement = await db.prepareAsync(
            'INSERT INTO exerciseset (exerciseid, amount, weight, rpe, batchid) VALUES (?, ?, ?, ?, ?)'
        );

        await setStatement.executeAsync([
            exerciseId,
            parseInt(row.Reps),
            parseFloat(row.Weight),
            parseFloat(row.RPE),
            batchId
        ]);

    } catch (error) {
        console.error('Transaction error:', error);
        console.error('Row:', row);
    }
}

export async function getOrCreateWorkout(db: SQLite.SQLiteDatabase, date: string): Promise<number> {
    const workoutStatement = await db.prepareAsync(
        'SELECT id FROM workout WHERE starttime = ?'
    );
    const workoutResult = await workoutStatement.executeAsync([date]);

    const workoutRows = await workoutResult.getAllAsync() as { id: number, starttime: string }[];

    if (workoutRows.length > 0) {
        return workoutRows[0].id;
    }

    const insertWorkoutStatement = await db.prepareAsync(
        'INSERT INTO workout (starttime, endtime) VALUES (?, ?)'
    );

    const insertResult = await insertWorkoutStatement.executeAsync([date, date]);
    return insertResult.lastInsertRowId;
}

export async function getOrCreateExercise(db: SQLite.SQLiteDatabase, name: string): Promise<number> {
    const exerciseStatement = await db.prepareAsync(
        'SELECT id FROM exercise WHERE name = ?'
    );

    const equipment = getEquipmentFromExerciseString(name);
    const attachment = getAttachmentFromExerciseString(name);

    console.log('Equipment:', equipment);
    console.log('Attachment:', attachment);

    const exerciseResult = await exerciseStatement.executeAsync([name]);

    const exerciseRows = await exerciseResult.getAllAsync() as { id: number }[];

    if (exerciseRows.length > 0) {
        return exerciseRows[0].id;
    }

    const insertExerciseStatement = await db.prepareAsync(
        'INSERT INTO exercise (name) VALUES (?)'
    );

    const insertResult = await insertExerciseStatement.executeAsync([name]);

    return insertResult.lastInsertRowId;
}

export function getEquipmentFromExerciseString(exerciseString: string): string {
    if (!exerciseString.includes('(') || !exerciseString.includes(')')) {
        return '';
    }

    const startIndex = exerciseString.indexOf('(') + 1;
    const endIndex = exerciseString.indexOf(')', startIndex);

    if (startIndex === -1 || endIndex === -1) {
        return '';
    }

    const equipment = exerciseString.substring(startIndex, endIndex).trim();
    return equipment;
}

export function getAttachmentFromExerciseString(exerciseString: string): string {
    if (!exerciseString.includes('-')) {
        return '';
    }    

    const parts = exerciseString.split('-');

    if (parts.length < 2 || parts[1].trim() === '') {
        return '';
    }

    const attachment = parts.slice(1).join('-');
    return attachment.trim();
}