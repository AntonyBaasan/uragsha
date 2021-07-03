import {Action} from 'redux';
import {Exercise} from '../../models/Exercise';

export const LOAD_EXERCISES = 'LOAD_EXERCISES';
export const ADD_EXERCISE = 'ADD_EXERCISE';
export const REMOVE_EXERCISE = 'REMOVE_EXERCISE';
export const UPDATE_EXERCISE = 'UPDATE_EXERCISE';
export const REORDER_EXERCISE = 'REORDER_EXERCISE';

export interface LoadExercisesAction extends Action {
  type: typeof LOAD_EXERCISES;
  payload: {exercises: Exercise[]};
}
export interface AddExerciseAction extends Action {
  type: typeof ADD_EXERCISE;
  payload: {order: number; exercise: Exercise};
}
export interface RemoveExerciseAction extends Action {
  type: typeof REMOVE_EXERCISE;
  payload: {workoutId: string; exerciseId: string};
}
export interface UpdateExerciseAction extends Action {
  type: typeof UPDATE_EXERCISE;
  payload: {exercise: Exercise};
}
export interface ReorderExerciseAction extends Action {
  type: typeof REORDER_EXERCISE;
  payload: {
    workoutId: string;
    exercises: Exercise[];
  };
}

export type ExerciseActionTypes =
  | AddExerciseAction
  | RemoveExerciseAction
  | UpdateExerciseAction
  | ReorderExerciseAction
  | LoadExercisesAction;
