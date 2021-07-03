import * as SQLite from 'expo-sqlite';
import {DB_NAME, TABLE_EXERCISE, TABLE_WORKOUT, TABLE_STAT} from './constants';

// opens or creates db
// this code will fired first time when this file is imported
const db = SQLite.openDatabase(DB_NAME);

export const initialize = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      for (let index = 0; index < queries.length; index += 1) {
        const element = queries[index];
        tx.executeSql(
          element.query,
          [],
          (_, result) => {
            console.log(element.consoleText);
            if (index === queries.length - 1) {
              resolve(result);
            }
          },
          (_, err) => {
            if (index === queries.length - 1) {
              reject(err);
            }
            return true;
          },
        );
      }
    });
  });
};
const createWorkoutTableQuery = `
CREATE TABLE IF NOT EXISTS ${TABLE_WORKOUT} (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT,
    authorId TEXT,
    packageId TEXT,
    image TEXT
);
`;

const createExerciseTableQuery = `
        CREATE TABLE IF NOT EXISTS ${TABLE_EXERCISE} (
            id TEXT,
            workoutId TEXT NO NULL,
            exerciseType INTEGER NOT NULL,
            orderId INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            sets INTEGER,
            duration INTEGER,
            hasRest INTEGER,
            restTime INTEGER,
            reps INTEGER,
            distance INTEGER,
            image TEXT,
            images TEXT,
            weight INTEGER,
            FOREIGN KEY(workoutId) REFERENCES ${TABLE_WORKOUT}(id) ON DELETE CASCADE
            UNIQUE(id, workoutId)
        );
      `;

const createStatTableQuery = `
CREATE TABLE IF NOT EXISTS ${TABLE_STAT} (
    day TEXT PRIMARY KEY,
    info TEXT
);
`;

const queries = [
  {query: createWorkoutTableQuery, consoleText: 'workout table created.'},
  {query: createExerciseTableQuery, consoleText: 'exercise table created.'},
  {query: createStatTableQuery, consoleText: 'stat table created.'},
];
