import { getAttachmentFromExerciseString, getEquipmentFromExerciseString, getExerciseNameFromExerciseString } from "@/helpers/csvHelper";

describe('getAttachmentFromExerciseString', () => {
    it('should return an empty string if there is no hyphen in the exercise string', () => {
        const result = getAttachmentFromExerciseString('Squat');
        expect(result).toBe('');
    });

    it('should return the attachment part of the exercise string', () => {
        const result = getAttachmentFromExerciseString('Bench Press - Barbell');
        expect(result).toBe('Barbell');
    });

    it('should handle strings with parentheses correctly', () => {
        const result = getAttachmentFromExerciseString('Leg Press (Machine)');
        expect(result).toBe('');
    });

    it('should handle strings with no attachment part correctly', () => {
        const result = getAttachmentFromExerciseString('Deadlift');
        expect(result).toBe('');
    });

    it('should handle strings with multiple hyphens correctly', () => {
        const result = getAttachmentFromExerciseString('Triceps Pushdown (Cable) - V-Bar');
        expect(result).toBe('V-Bar');
    });

    it('should handle strings with a - in the exercise name correctly', () => {
        const result = getAttachmentFromExerciseString('Iso-Lateral Chest Press (Machine)');
        expect(result).toBe('');
    });

    it('should handle strings with parentheses and hyphens correctly', () => {
        const result = getAttachmentFromExerciseString('Bench Press - Close Grip (Barbell)');
        expect(result).toBe('');
    });

    it('should handle strings with parentheses and hyphens correctly', () => {
        const result = getAttachmentFromExerciseString('Lat Pulldown - Underhand (Cable)');
        expect(result).toBe('');
    });

    it('should handle strings with parentheses and hyphens correctly', () => {
        const result = getAttachmentFromExerciseString('Triceps Pushdown (Cable - Straight Bar)');
        expect(result).toBe('Straight Bar');
    });
});

describe('getEquipmentFromExerciseString', () => {
    it('should return an empty string if there is no parentheses in the exercise string', () => {
        const result = getEquipmentFromExerciseString('Squat');
        expect(result).toBe('');
    });

    it('should return the equipment part of the exercise string', () => {
        const result = getEquipmentFromExerciseString('Leg Press (Machine)');
        expect(result).toBe('Machine');
    });

    it('should handle strings with multiple parentheses correctly', () => {
        const result = getEquipmentFromExerciseString('Triceps Pushdown (Cable) - V-Bar');
        expect(result).toBe('Cable');
    });

    it('should handle strings with a - in the exercise name correctly', () => {
        const result = getEquipmentFromExerciseString('Iso-Lateral Chest Press (Machine)');
        expect(result).toBe('Machine');
    });

    it('should handle strings with parentheses and hyphens correctly', () => {
        const result = getEquipmentFromExerciseString('Bench Press - Close Grip (Barbell)');
        expect(result).toBe('Barbell');
    });

    it('should handle strings with parentheses and hyphens correctly', () => {
        const result = getEquipmentFromExerciseString('Lat Pulldown - Underhand (Cable)');
        expect(result).toBe('Cable');
    });

    it('should handle strings with parentheses and hyphens correctly', () => {
        const result = getEquipmentFromExerciseString('Triceps Pushdown (Cable - Straight Bar)');
        expect(result).toBe('Cable - Straight Bar');
    });
});

describe('getExerciseNameFromExerciseString', () => {
    it('should return the exercise name if there is no hyphen in the exercise string', () => {
        const result = getExerciseNameFromExerciseString('Squat');
        expect(result).toBe('Squat');
    });

    it('should return the exercise name part of the exercise string', () => {
        const result = getExerciseNameFromExerciseString('Bench Press - Barbell');
        expect(result).toBe('Bench Press');
    });

    it('should handle strings with multiple hyphens correctly', () => {
        const result = getExerciseNameFromExerciseString('Triceps Pushdown (Cable) - V-Bar');
        expect(result).toBe('Triceps Pushdown');
    });

    it('should handle strings with multiple hyphens correctly', () => {
        const result = getExerciseNameFromExerciseString('Triceps Pushdown (Cable)');
        expect(result).toBe('Triceps Pushdown');
    });

    it('should handle strings with parentheses correctly', () => {
        const result = getExerciseNameFromExerciseString('Iso-Lateral Chest Press (Machine)');
        expect(result).toBe('Iso-Lateral Chest Press');
    });

    it('should handle strings with parentheses and hyphens correctly', () => {
        const result = getExerciseNameFromExerciseString('Bench Press - Close Grip (Barbell)');
        expect(result).toBe('Bench Press - Close Grip');
    });

    it('should handle strings with parentheses and hyphens correctly', () => {
        const result = getExerciseNameFromExerciseString('Lat Pulldown - Underhand (Cable)');
        expect(result).toBe('Lat Pulldown - Underhand');
    });

    it('should handle strings with parentheses and hyphens correctly', () => {
        const result = getExerciseNameFromExerciseString('Triceps Pushdown (Cable - Straight Bar)');
        expect(result).toBe('Triceps Pushdown');
    });
});