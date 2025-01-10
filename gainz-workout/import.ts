import { AttachmentRepository } from "./repositories/AttachmentRepository";
import { BatchRepository } from "./repositories/BatchRepository";
import { EquipmentRepository } from "./repositories/EquipmentRepository";
import { ExerciseRepository } from "./repositories/ExerciseRepository";
import { MuscleGroupRepository } from "./repositories/MuscleGroupRepository";
import { WorkoutRepository } from "./repositories/WorkoutRepository";
import { SetRepository } from "./repositories/SetRepository";
import { GraphTypeRepository } from "./repositories/GraphTypeRepository";
import { GraphDurationRepository } from "./repositories/GraphDurationRepository";
import { ExerciseEquipmentRepository } from "./repositories/ExerciseEquipmentRepository";
import { GraphRepository } from "./repositories/GraphRepository";
import { SeedStatusRepository } from "./repositories/SeedStatusRepository";

export const attachmentRepository = new AttachmentRepository('attachments');
export const equipmentRepository = new EquipmentRepository('equipment');
export const exerciseRepository = new ExerciseRepository('exercises');
export const muscleGroupRepository = new MuscleGroupRepository('musclegroups');
export const workoutRepository = new WorkoutRepository('workouts');
export const batchRepository = new BatchRepository('batches');
export const setRepository = new SetRepository('sets');
export const graphTypeRepository = new GraphTypeRepository('graphTypes');
export const graphDurationRepository = new GraphDurationRepository('graphDurations');
export const exerciseEquipmentRepository = new ExerciseEquipmentRepository('exerciseEquipments');
export const graphRepository = new GraphRepository('graphs');
export const seedStatusRepository = new SeedStatusRepository('seedStatus');

export const repositories = [
    seedStatusRepository,
    muscleGroupRepository,
    exerciseRepository,
    workoutRepository,
    batchRepository,
    setRepository,
    graphTypeRepository,
    graphDurationRepository,
    attachmentRepository,
    equipmentRepository,
    exerciseEquipmentRepository,
    graphRepository
]

