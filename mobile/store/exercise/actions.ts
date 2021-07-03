import * as ExerciseDB from '../../helpers/db/exercise';
import {Exercise} from '../../models/Exercise';
import {
  ADD_EXERCISE,
  ExerciseActionTypes,
  LOAD_EXERCISES,
  REMOVE_EXERCISE,
  UPDATE_EXERCISE,
  REORDER_EXERCISE,
} from './actionTypes';

export const loadExercises = (workoutId: string) => {
  return async (dispatch: any) => {
    try {
      console.log('loadExercises workoutId:', workoutId);
      const exercises = await ExerciseDB.selectExercises(workoutId);
      // console.log('ExerciseDB.selectExercises result:');
      // console.log(exercises);
      dispatch({type: LOAD_EXERCISES, payload: {exercises}});
    } catch (error) {
      console.log('ExerciseDB.selectExercises error:');
      console.log(error);
    }
  };
};
export const addExercises = (
  order: number,
  exercise: Exercise,
): ExerciseActionTypes => {
  return {
    type: ADD_EXERCISE,
    payload: {order, exercise},
  };
};
export const removeExercises = (
  workoutId: string,
  exerciseId: string,
): ExerciseActionTypes => {
  return {
    type: REMOVE_EXERCISE,
    payload: {workoutId, exerciseId},
  };
};
export const updateExercises = (exercise: Exercise): ExerciseActionTypes => {
  return {
    type: UPDATE_EXERCISE,
    payload: {exercise},
  };
};
export const reoderExercises = (
  workoutId: string,
  exercises: Exercise[],
): ExerciseActionTypes => {
  return {
    type: REORDER_EXERCISE,
    payload: {workoutId, exercises},
  };
};
