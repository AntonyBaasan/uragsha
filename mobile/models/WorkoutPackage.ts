import {Workout} from './Workout';

export interface WorkoutPackage {
  id: string;
  authorId: string;
  created: string;
  workout: Workout;
}
