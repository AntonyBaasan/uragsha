import * as SQLite from 'expo-sqlite';
import {DEMO_WORKOUT} from '../../data/example';
import {DB_NAME, TABLE_EXERCISE, TABLE_STAT, TABLE_WORKOUT} from './constants';
import * as WorkoutDB from './workout';
import * as ExerciseDB from './exercise';

const db = SQLite.openDatabase(DB_NAME);

export const dropAllTable = () => {
  db.transaction(tx => {
    const query1 = `
        DROP TABLE IF EXISTS ${TABLE_WORKOUT};
      `;
    tx.executeSql(
      query1,
      [],
      (_, result) => {
        console.log('successfully dropped:');
        console.log(result);
      },
      (_, err) => {
        console.log('error:');
        console.log(err);
        return false;
      },
    );
    const query2 = `
        DROP TABLE IF EXISTS ${TABLE_EXERCISE};
      `;
    tx.executeSql(
      query2,
      [],
      (_, result) => {
        console.log('successfully dropped:');
        console.log(result);
      },
      (_, err) => {
        console.log('error:');
        console.log(err);
        return false;
      },
    );
    const query3 = `
        DROP TABLE IF EXISTS ${TABLE_STAT};
      `;
    tx.executeSql(
      query3,
      [],
      (_, result) => {
        console.log('successfully dropped:');
        console.log(result);
      },
      (_, err) => {
        console.log('error:');
        console.log(err);
        return false;
      },
    );
  });
};

export const clearWorkoutAndExercise = () => {
  db.transaction(tx => {
    const query1 = `
        DELETE FROM ${TABLE_WORKOUT};
      `;
    tx.executeSql(
      query1,
      [],
      (_, result) => {
        console.log('successfully deleted:');
        console.log(result);
      },
      (_, err) => {
        console.log('error:');
        console.log(err);
        return false;
      },
    );
    const query2 = `
        DELETE FROM ${TABLE_EXERCISE};
      `;
    tx.executeSql(
      query2,
      [],
      (_, result) => {
        console.log('successfully deleted:');
        console.log(result);
      },
      (_, err) => {
        console.log('error:');
        console.log(err);
        return false;
      },
    );
    const query3 = `
        DELETE FROM ${TABLE_STAT};
      `;
    tx.executeSql(
      query3,
      [],
      (_, result) => {
        console.log('successfully deleted:');
        console.log(result);
      },
      (_, err) => {
        console.log('error:');
        console.log(err);
        return false;
      },
    );
  });
};

export const insertTestWorkouts = async () => {
  for (const workout of DEMO_WORKOUT) {
    console.log('Debug insertTestWorkouts id:', workout.id);
    try {
      const insertWorkoutResult = await WorkoutDB.insertWorkout(workout);
      console.log('WorkoutDB.createWorkout result:');
      console.log(insertWorkoutResult);

      for (let index = 0; index < workout.exercises.length; index += 1) {
        const insertExerciseResult = await ExerciseDB.insertExercises(
          workout.exercises[index],
        );
        console.log('ExerciseDB.insertExercises result:');
        console.log(insertExerciseResult);
      }
    } catch (err) {
      console.log('err:');
      console.log(err);
    }
  }
};
