import { getAttachmentFromExerciseString, getEquipmentFromExerciseString } from "@/helpers/csvHelper";

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
});