import * as WorkoutDB from '../../helpers/db/workout';
import * as ExerciseDB from '../../helpers/db/exercise';
import {Exercise, ExerciseMetadataStatus} from '../../models/Exercise';
import {Workout} from '../../models/workout';
import {
  LOAD_WORKOUTS,
  CREATE_WORKOUT,
  DELETE_WORKOUT,
  UPDATE_WORKOUT,
} from './actionTypes';

export const loadWorkouts = () => {
  return async (dispatch: any) => {
    try {
      const workouts = await WorkoutDB.selectWorkouts();
      // console.log('WorkoutDB.selectWorkouts result:');
      // console.log(workouts);
      dispatch({type: LOAD_WORKOUTS, payload: {workouts}});
    } catch (error) {
      console.log('WorkoutDB.selectWorkouts error:');
      console.log(error);
    }
  };
};

export const createWorkout = (workout: Workout, exercises: Exercise[]) => {
  return async (dispatch: any) => {
    try {
      await WorkoutDB.insertWorkout(workout);
      // console.log('WorkoutDB.createWorkout result:');
      // console.log(insertWorkoutResult);
      for (let index = 0; index < exercises.length; index += 1) {
        const insertResult = await ExerciseDB.insertExercises(exercises[index]);
        console.log('ExerciseDB.insertExercises result:');
        console.log(insertResult);
      }

      dispatch({type: CREATE_WORKOUT, payload: {workout}});
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateWorkout = (workout: Workout, exercises: Exercise[]) => {
  return async (dispatch: any) => {
    try {
      await WorkoutDB.updateWorkout(workout);
      // console.log('WorkoutDB.updateWorkout result:');
      // console.log(updateWorkoutQuery);
      await _updateSqlExercises(exercises);
      dispatch({type: UPDATE_WORKOUT, payload: {workout}});
    } catch (error) {
      console.log('WorkoutDB.updateWorkout error:');
      console.log(error);
    }
  };
};

export const deleteWorkout = (workoutId: string) => {
  return async (dispatch: any) => {
    try {
      await WorkoutDB.deleteWorkout(workoutId);
      // console.log('WorkoutDB.deleteWorkout result:');
      // console.log(result);
      dispatch({type: DELETE_WORKOUT, payload: {workoutId}});
    } catch (error) {
      console.log('WorkoutDB.deleteWorkout error:');
      console.log(error);
    }
  };
};

async function _updateSqlExercises(exercises: Exercise[]) {
  const updateExercises = exercises.filter(
    e => e.metadata.status === ExerciseMetadataStatus.None,
  );
  console.log(`Found ${updateExercises.length} exercises to update.`);
  for (let index = 0; index < updateExercises.length; index += 1) {
    await ExerciseDB.updateExercises(updateExercises[index]);
    // console.log('ExerciseDB.updateExercises result:');
    // console.log(updatedResult);
  }
  const createdExercises = exercises.filter(
    e => e.metadata.status === ExerciseMetadataStatus.Created,
  );
  console.log(`Found ${createdExercises.length} exercises created.`);
  for (let index = 0; index < createdExercises.length; index += 1) {
    await ExerciseDB.insertExercises(createdExercises[index]);
    // console.log('ExerciseDB.insertExercises result:');
    // console.log(createdResult);
  }
  const deletedExercises = exercises.filter(
    e => e.metadata.status === ExerciseMetadataStatus.Deleted,
  );
  console.log(`Found ${deletedExercises.length} exercises deleted.`);
  for (let index = 0; index < deletedExercises.length; index += 1) {
    await ExerciseDB.deleteExercise(deletedExercises[index].id);
    // console.log('ExerciseDB.deletedExercises result:');
    // console.log(deletedResult);
  }
}
