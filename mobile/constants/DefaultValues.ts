import {v4 as uuidv4} from 'uuid';
import {ExerciseType} from '../models/ExcerciseType';
import {
  Exercise,
  ExerciseMetadata,
  ExerciseMetadataStatus,
} from '../models/Exercise';
import {StatView} from '../models/Stat';
import {Workout} from '../models/Workout';

export const createDefaultWorkout = () => {
  return {
    id: uuidv4(),
    title: '',
    description: '',
    tags: [],
    //   authorId?: string;
    //   workoutPackageId: string;
    exercises: [],
    //   image?: string;
  } as Workout;
};

export const createDefaultExercise = (
  workoutId: string,
  order: number,
): Exercise => ({
  id: uuidv4(),
  workoutId,
  order,
  exerciseType: ExerciseType.Reps,
  title: '',
  description: '',
  sets: 3,
  reps: 8,
  hasRest: true,
  restTime: 30,
  // weight?: number;
  // distance?: number;
  // image?: string[];
  metadata: {
    status: ExerciseMetadataStatus.None,
  } as ExerciseMetadata,
});

// workout player rotates images
export const imageRotateInterval = 3000;

export const defaultStatView: StatView = {
  xp: 0,
  workout: 0,
  exercise: 0,
};
