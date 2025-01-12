import { Exercise } from '@/models/Exercise';
import { Equipment } from '@/models/Equipment';
import { Attachment } from '@/models/Attachment';

export class ExerciseSelectorBuilder {
    private equipmentId?: number;
    private attachmentId?: number;
    private muscleGroupId?: number;

    /**
     * Filter by Equipment ID
     */
    public withEquipment(equipmentId: number): ExerciseSelectorBuilder {
        this.equipmentId = equipmentId;
        return this;
    }

    /**
     * Filter by Attachment ID
     */
    public withAttachment(attachmentId: number): ExerciseSelectorBuilder {
        this.attachmentId = attachmentId;
        return this;
    }

    /**
     * Filter by Muscle Group ID
     */
    public withMuscleGroup(muscleGroupId: number): ExerciseSelectorBuilder {
        this.muscleGroupId = muscleGroupId;
        return this;
    }

    /**
     * Execute the query and return filtered exercises
     */
    public async build(): Promise<Exercise[]> {
        if (this.equipmentId && this.attachmentId) {
            return Exercise.findByEquipmentAndAttachment(this.equipmentId, this.attachmentId);
        }

        if (this.equipmentId) {
            return Exercise.findByEquipment(this.equipmentId);
        }

        if (this.attachmentId) {
            return Exercise.findByAttachment(this.attachmentId);
        }

        if (this.muscleGroupId) {
            return Exercise.findByMuscleGroup(this.muscleGroupId);
        }

        return Exercise.findAll();
    }
}
