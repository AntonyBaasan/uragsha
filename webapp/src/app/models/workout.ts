export interface Workout {
  title: string;
  description?: string;
  exercise: Exercise[];
}

export interface Exercise {
  title: string;
  seconds: number; //
}
