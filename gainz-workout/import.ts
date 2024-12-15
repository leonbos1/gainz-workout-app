import { AttachmentRepository } from "./repositories/AttachmentRepository";
import { BatchRepository } from "./repositories/BatchRepository";
import { EquipmentRepository } from "./repositories/EquipmentRepository";
import { ExerciseRepository } from "./repositories/ExerciseRepository";
import { MuscleGroupRepository } from "./repositories/MuscleGroupRepository";
import { WorkoutRepository } from "./repositories/WorkoutRepository";
import { SetRepository } from "./repositories/SetRepository";

export const attachmentRepository = new AttachmentRepository('attachments');
export const equipmentRepository = new EquipmentRepository('equipment');
export const exerciseRepository = new ExerciseRepository('exercises');
export const muscleGroupRepository = new MuscleGroupRepository('musclegroups');
export const workoutRepository = new WorkoutRepository('workouts');
export const batchRepository = new BatchRepository('batches');
export const setRepository = new SetRepository('sets');