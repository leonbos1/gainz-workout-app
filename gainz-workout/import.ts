import { AttachmentRepository } from "./repositories/AttachmentRepository";
import { EquipmentRepository } from "./repositories/EquipmentRepository";
import { ExerciseRepository } from "./repositories/ExerciseRepository";
import { MuscleGroupRepository } from "./repositories/MuscleGroupRepository";

export const attachmentRepository = new AttachmentRepository('attachments');
export const equipmentRepository = new EquipmentRepository('equipment');
export const exerciseRepository = new ExerciseRepository('exercise');
export const muscleGroupRepository = new MuscleGroupRepository('musclegroup');