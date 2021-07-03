import {ExerciseType} from './ExcerciseType';
import {ImageModel} from './ImageModel';
export enum ExcerciseTaskStatus {
  NotStarted = 'not started',
  Skipped = 'skipped',
  InProgress = 'wip',
  Paused = 'paused',
  Done = 'done',
}

export interface ExerciseTask {
  id: string;
  exerciseId: string;
  exerciseType: ExerciseType;
  order: number;
  title: string;
  description?: string;
  duration?: number;
  sets: number;
  reps?: number;
  images: ImageModel[];
  status: ExcerciseTaskStatus;
  isRest: boolean;
}
