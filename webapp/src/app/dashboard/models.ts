export interface WorkoutSession {
  start: Date;
  end?: Date;
  title: string;
  color: { primary: string; secondary: string };
}
