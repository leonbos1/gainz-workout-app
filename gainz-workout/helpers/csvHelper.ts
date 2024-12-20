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

const exerciseCache: { [key: string]: number } = {};
const equipmentCache: { [key: string]: number } = {};
const attachmentCache: { [key: string]: number } = {};
const workoutCache: { [key: string]: number } = {};

export async function processCSVRowsInBatch(
    db: SQLite.SQLiteDatabase,
    records: CSVRow[],
    batchSize: number,
    setParsedRows: (parsed: number) => void
) {
    try {
        let batchStart = 0;
        while (batchStart < records.length) {
            const batchRecords = records.slice(batchStart, batchStart + batchSize);
            await db.execAsync('BEGIN TRANSACTION');

            for (const record of batchRecords) {
                await processCSVRow(db, record);
            }

            await db.execAsync('COMMIT');

            batchStart += batchSize;
            setParsedRows(batchStart);
        }
    } catch (error) {
        console.error('Error processing CSV in batch:', error);
        await db.execAsync('ROLLBACK');
    }
}

export function getExerciseNameFromExerciseString(exerciseString: string): string {
    if (exerciseString.toLowerCase().includes('grip') || exerciseString.toLowerCase().includes('underhand')) {
        const parenthesisIndex = exerciseString.indexOf('(');
        return parenthesisIndex !== -1
            ? exerciseString.substring(0, parenthesisIndex).trim()
            : exerciseString.trim();
    }

    const parenthesisIndex = exerciseString.indexOf('(');
    let namePart = parenthesisIndex !== -1 ? exerciseString.substring(0, parenthesisIndex).trim() : exerciseString.trim();

    const hyphenIndex = namePart.lastIndexOf(' - ');

    return hyphenIndex !== -1 ? namePart.substring(0, hyphenIndex).trim() : namePart;
}

export function getEquipmentFromExerciseString(exerciseString: string): string {
    const startIndex = exerciseString.indexOf('(');
    const endIndex = exerciseString.indexOf(')', startIndex);

    if (startIndex === -1 || endIndex === -1) {
        return '';
    }

    const equipment = exerciseString.substring(startIndex + 1, endIndex).trim();
    return equipment;
}

export function getAttachmentFromExerciseString(exerciseString: string): string {
    const hyphenIndex = exerciseString.lastIndexOf(' - ');

    const parenthesisIndex = exerciseString.indexOf('(');
    if (hyphenIndex === -1 || (parenthesisIndex !== -1 && hyphenIndex < parenthesisIndex)) {
        return '';
    }

    const attachment = exerciseString.substring(hyphenIndex + 3).trim().replace(')', '').replace('(', '');

    return attachment;
}

export async function processCSVRow(db: SQLite.SQLiteDatabase, row: CSVRow) {
    try {
        if (!row.Reps || !row.Weight) {
            return;
        }

        const [workoutId, exerciseId, equipmentId, attachmentId] = await Promise.all([
            getOrCreateWorkout(db, row.Date),
            getOrCreateExercise(db, row['Exercise Name']),
            getOrCreateEquipment(db, getEquipmentFromExerciseString(row['Exercise Name'])),
            getOrCreateAttachment(db, getAttachmentFromExerciseString(row['Exercise Name']))
        ]);

        const batchStatement = 'INSERT INTO batch (workoutid, note, equipmentid, attachmentid) VALUES (?, ?, ?, ?)';
        const batchStatementPrepared = await db.prepareAsync(batchStatement);
        const batchResult = await batchStatementPrepared.executeAsync([workoutId, row.Notes || '', equipmentId, attachmentId]);
        const batchId = batchResult.lastInsertRowId;

        const setStatement = 'INSERT INTO exerciseset (exerciseid, amount, weight, rpe, batchid) VALUES (?, ?, ?, ?, ?)';
        const setStatementPrepared = await db.prepareAsync(setStatement);
        await setStatementPrepared.executeAsync([
            exerciseId,
            parseInt(row.Reps),
            parseFloat(row.Weight),
            parseFloat(row.RPE || '0'),
            batchId
        ]);

    } catch (error) {
        console.error('Error processing row:', error);
    }
}

async function getOrCreateWorkout(db: SQLite.SQLiteDatabase, date: string): Promise<number> {
    if (workoutCache[date]) {
        return workoutCache[date];
    }

    const workoutStatement = await db.prepareAsync('SELECT id FROM workout WHERE starttime = ?');
    const workoutResult = await workoutStatement.executeAsync([date]);
    const workoutRows = await workoutResult.getAllAsync() as { id: number }[];

    if (workoutRows.length > 0) {
        workoutCache[date] = workoutRows[0].id;
        return workoutRows[0].id;
    }

    const insertWorkoutStatement = await db.prepareAsync('INSERT INTO workout (starttime, endtime, createdAt, updatedAt) VALUES (?, ?, ?, ?)');
    const insertResult = await insertWorkoutStatement.executeAsync([date, date, new Date().toISOString(), new Date().toISOString()]);
    workoutCache[date] = insertResult.lastInsertRowId;
    return insertResult.lastInsertRowId;
}

async function getOrCreateExercise(db: SQLite.SQLiteDatabase, name: string): Promise<number> {
    const exerciseName = getExerciseNameFromExerciseString(name);

    if (exerciseCache[exerciseName]) {
        return exerciseCache[exerciseName];
    }

    const exerciseStatement = await db.prepareAsync('SELECT id FROM exercise WHERE name = ?');
    const exerciseResult = await exerciseStatement.executeAsync([exerciseName]);
    const exerciseRows = await exerciseResult.getAllAsync() as { id: number }[];

    if (exerciseRows.length > 0) {
        exerciseCache[exerciseName] = exerciseRows[0].id;
        return exerciseRows[0].id;
    }

    const insertExerciseStatement = await db.prepareAsync('INSERT INTO exercise (name, createdAt, updatedAt) VALUES (?, ?, ?)');
    const insertResult = await insertExerciseStatement.executeAsync([exerciseName, new Date().toISOString(), new Date().toISOString()]);
    exerciseCache[exerciseName] = insertResult.lastInsertRowId;
    return insertResult.lastInsertRowId;
}

async function getOrCreateEquipment(db: SQLite.SQLiteDatabase, name: string): Promise<number> {
    if (equipmentCache[name]) {
        return equipmentCache[name];
    }

    const equipmentStatement = await db.prepareAsync('SELECT id FROM equipment WHERE name = ?');
    const equipmentResult = await equipmentStatement.executeAsync([name]);
    const equipmentRows = await equipmentResult.getAllAsync() as { id: number }[];

    if (equipmentRows.length > 0) {
        equipmentCache[name] = equipmentRows[0].id;
        return equipmentRows[0].id;
    }

    const insertEquipmentStatement = await db.prepareAsync('INSERT INTO equipment (name, createdAt, updatedAt) VALUES (?, ?, ?)');
    const insertResult = await insertEquipmentStatement.executeAsync([name, new Date().toISOString(), new Date().toISOString()]);
    equipmentCache[name] = insertResult.lastInsertRowId;
    console.log('Inserted equipment:', name, insertResult.lastInsertRowId);
    return insertResult.lastInsertRowId;
}

async function getOrCreateAttachment(db: SQLite.SQLiteDatabase, name: string): Promise<number> {
    if (name.length === 0) {
        return 0;
    }

    if (attachmentCache[name]) {
        return attachmentCache[name];
    }

    const attachmentStatement = await db.prepareAsync('SELECT id FROM attachment WHERE name = ?');
    const attachmentResult = await attachmentStatement.executeAsync([name]);
    const attachmentRows = await attachmentResult.getAllAsync() as { id: number }[];

    if (attachmentRows.length > 0) {
        attachmentCache[name] = attachmentRows[0].id;
        return attachmentRows[0].id;
    }

    const insertAttachmentStatement = await db.prepareAsync('INSERT INTO attachment (name, createdAt, updatedAt) VALUES (?, ?, ?)');
    const insertResult = await insertAttachmentStatement.executeAsync([name, new Date().toISOString(), new Date().toISOString()]);
    attachmentCache[name] = insertResult.lastInsertRowId;
    return insertResult.lastInsertRowId;
}
