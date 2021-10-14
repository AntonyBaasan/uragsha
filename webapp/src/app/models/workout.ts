export interface Workout {
  title: string;
  description?: string;
  exercises: Exercise[];
}

export interface Exercise {
  title: string;
  seconds: number; //
}
