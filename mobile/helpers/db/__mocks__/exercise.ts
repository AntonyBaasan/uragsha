import {Exercise} from '../../../models/Exercise';

export const selectExercises = (workoutId: string) => {
  return new Promise<Exercise[]>((resolve, reject) => {
    const exercices = [
      {id: '1', workoutId: '1'} as Exercise,
      {id: '2', workoutId: '1'} as Exercise,
      {id: '3', workoutId: '2'} as Exercise,
    ];
    resolve(exercices.filter(e => e.workoutId === workoutId));
  });
};

export const insertExercises = (exercise: Exercise) => {
  return new Promise((resolve, reject) => {
    resolve('sucess');
    // reject(error);
  });
};

export const updateExercises = (exercise: Exercise) => {
  return new Promise((resolve, reject) => {
    resolve('sucess');
  });
};

export const deleteExercise = (exerciseId: string) => {
  return new Promise((resolve, reject) => {
    resolve('sucess');
  });
};
