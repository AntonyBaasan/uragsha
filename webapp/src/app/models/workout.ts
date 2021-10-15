export interface WorkoutState {
  isLocal: boolean;
  state: WorkoutStateEnum;
  workout: Workout;
}

export interface Workout {
  title: string;
  description?: string;
  exercises: Exercise[];
  // shows what is current exercise and time
  current: { isPaused: boolean, index: number, second: number }
}

export interface Exercise {
  title: string;
  seconds: number; //
}

export enum WorkoutStateEnum {
  planning, exercising, done
}

