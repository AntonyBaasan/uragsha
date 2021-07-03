import * as SQLite from 'expo-sqlite';
import {Workout} from '../../models/Workout';
import {DB_NAME, STRING_JOIN_CHAR, TABLE_WORKOUT} from './constants';

// opens or creates db
// this code will fired first time when this file is imported
const db = SQLite.openDatabase(DB_NAME);

export const insertWorkout = (workout: Workout) => {
  return new Promise((resolve, reject) => {
    db.transaction((transaction: any) => {
      try {
        const insertWorkoutQuery = `
          INSERT into ${TABLE_WORKOUT}
          (id,title,description,tags,authorId,packageId,image) 
          values (?,?,?,?,?,?,?);`;
        const workoutParams = [
          workout.id,
          workout.title,
          workout.description,
          workout.tags ? workout.tags.join(STRING_JOIN_CHAR) : null,
          workout.authorId,
          workout.packageId,
          workout.image,
        ];

        console.log(insertWorkoutQuery);
        console.log(workoutParams);
        transaction.executeSql(
          insertWorkoutQuery,
          workoutParams,
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
            return false;
          },
        );
      } catch (error) {
        console.log('error2:');
        console.log(error);
      }
    });
  });
};
export const updateWorkout = (workout: Workout) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const updateWorkoutQuery = `
            UPDATE ${TABLE_WORKOUT}
            SET title=?,description=?,tags=?,authorId=?,packageId=?,image=?
            WHERE id=?;
          `;
      const workoutParams = [
        workout.title,
        workout.description,
        workout.tags ? workout.tags.join(STRING_JOIN_CHAR) : null,
        workout.authorId,
        workout.packageId,
        workout.image,
        workout.id,
      ];
      tx.executeSql(
        updateWorkoutQuery,
        workoutParams,
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
          return false;
        },
      );
    });
  });
};

export const deleteWorkout = (id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const query = `
            DELETE FROM ${TABLE_WORKOUT}
            WHERE id=?;
          `;
      tx.executeSql(
        query,
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
          return false;
        },
      );
    });
  });
};

export const selectWorkouts = () => {
  return new Promise<Workout[]>((resolve, reject) => {
    db.transaction(tx => {
      const query = `
            select id,title,description,tags,authorId,packageId,image 
            from ${TABLE_WORKOUT};
          `;
      tx.executeSql(
        query,
        [],
        (_, result) => {
          resolve(mapResultSetsToWorkouts(result));
        },
        (_, err) => {
          reject(err);
          return false;
        },
      );
    });
  });
};

const mapResultSetsToWorkouts = (resultSet: SQLite.SQLResultSet): Workout[] => {
  const workouts: Workout[] = [];
  for (let index = 0; index < resultSet.rows.length; index += 1) {
    const element = resultSet.rows.item(index);
    workouts.push({
      id: element.id,
      title: element.title,
      description: element.description,
      tags: element.tags ? element.tags.split(STRING_JOIN_CHAR) : [],
      authorId: element.authorId,
      packageId: element.packageId,
      image: element.image,
    } as Workout);
  }
  return workouts;
};
