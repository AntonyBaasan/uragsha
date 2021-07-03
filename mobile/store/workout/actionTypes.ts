import {Action} from 'redux';
import {Workout} from '../../models/workout';

export const LOAD_WORKOUTS = 'LOAD_WORKOUTS';
export const CREATE_WORKOUT = 'CREATRE_WORKOUT';
export const UPDATE_WORKOUT = 'UPDATE_WORKOUT';
export const DELETE_WORKOUT = 'DELETE_WORKOUT';

export interface LoadWorkoutsAction extends Action {
  type: typeof LOAD_WORKOUTS;
  payload: {workouts: Workout[]};
}

export interface CreateWorkoutAction extends Action {
  type: typeof CREATE_WORKOUT;
  payload: {workout: Workout};
}

export interface UpdateWorkoutAction extends Action {
  type: typeof UPDATE_WORKOUT;
  payload: {workout: Workout};
}

export interface DeleteWorkoutAction extends Action {
  type: typeof DELETE_WORKOUT;
  payload: {workoutId: string};
}

export type WorkoutActionTypes =
  | LoadWorkoutsAction
  | CreateWorkoutAction
  | UpdateWorkoutAction
  | DeleteWorkoutAction;
