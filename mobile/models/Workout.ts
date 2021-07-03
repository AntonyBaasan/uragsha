import {Exercise} from './Exercise';

export type Workout = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorId?: string;
  packageId?: string;
  // exercises: Exercise[];
  image?: string;
};

export type WorkoutDemoType = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorId?: string;
  packageId?: string;
  exercises: Exercise[];
  image?: string;
};
