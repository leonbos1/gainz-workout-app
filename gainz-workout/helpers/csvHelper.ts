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
            'INSERT INTO batch (workoutid, note, equipmentid, attachmentid) VALUES (?, ?, ?, ?)'
        );

        const equipmentId = await getOrCreateEquipment(db, getEquipmentFromExerciseString(row['Exercise Name']));
        const attachmentId = await getOrCreateAttachment(db, getAttachmentFromExerciseString(row['Exercise Name']));

        const batchResult: any = await batchStatement.executeAsync([workoutId, row.Notes || '', equipmentId, attachmentId]);
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

async function getOrCreateEquipment(db: SQLite.SQLiteDatabase, name: string): Promise<number> {
    const equipmentStatement = await db.prepareAsync(
        'SELECT id FROM equipment WHERE name = ?'
    );

    const equipmentResult = await equipmentStatement.executeAsync([name]);

    const equipmentRows = await equipmentResult.getAllAsync() as { id: number }[];

    if (equipmentRows.length > 0) {
        return equipmentRows[0].id;
    }

    const insertEquipmentStatement = await db.prepareAsync(
        'INSERT INTO equipment (name) VALUES (?)'
    );

    const insertResult = await insertEquipmentStatement.executeAsync([name]);

    return insertResult.lastInsertRowId;
}

async function getOrCreateAttachment(db: SQLite.SQLiteDatabase, name: string): Promise<number> {
    const attachmentStatement = await db.prepareAsync(
        'SELECT id FROM attachment WHERE name = ?'
    );

    const attachmentResult = await attachmentStatement.executeAsync([name]);

    const attachmentRows = await attachmentResult.getAllAsync() as { id: number }[];

    if (attachmentRows.length > 0) {
        return attachmentRows[0].id;
    }

    const insertAttachmentStatement = await db.prepareAsync(
        'INSERT INTO attachment (name) VALUES (?)'
    );

    const insertResult = await insertAttachmentStatement.executeAsync([name]);

    return insertResult.lastInsertRowId;
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

    const exerciseName = getExerciseNameFromExerciseString(name);

    const exerciseResult = await exerciseStatement.executeAsync([exerciseName]);

    const exerciseRows = await exerciseResult.getAllAsync() as { id: number }[];

    if (exerciseRows.length > 0) {
        return exerciseRows[0].id;
    }

    const insertExerciseStatement = await db.prepareAsync(
        'INSERT INTO exercise (name) VALUES (?)'
    );

    const insertResult = await insertExerciseStatement.executeAsync([exerciseName]);

    return insertResult.lastInsertRowId;
}

export function getExerciseNameFromExerciseString(exerciseString: string): string {
    if (!exerciseString.includes('-')) {
        if (exerciseString.includes('(')) {
            const startIndex = exerciseString.indexOf('(');
            return exerciseString.substring(0, startIndex).trim();
        }
        return exerciseString.trim();
    }

    const parts = exerciseString.split('-');

    if (parts.length < 2 || parts[0].trim() === '') {
        return exerciseString.trim();
    }
    
    if (parts[0].includes('(')) {
        const startIndex = parts[0].indexOf('(');
        parts[0] = parts[0].substring(0, startIndex);
    }

    const exerciseName = parts[0];
    return exerciseName.trim();
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