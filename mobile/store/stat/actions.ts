import {Stat} from '../../models/Stat';
import {LOAD_STAT_BETWEEN, SET_STAT} from './actionTypes';
import * as StatDB from '../../helpers/db/stat';
import {RootState} from '../models';

export const loadStatBetween = (startDay?: string, endDay?: string) => {
  return async (dispatch: any) => {
    try {
      const selected = await StatDB.selectStat(startDay, endDay);

      dispatch({type: LOAD_STAT_BETWEEN, payload: selected});
    } catch (error) {
      console.log(error);
    }
  };
};
export const addStat = (addedStat: Stat) => {
  return async (dispatch: any, getState: any) => {
    try {
      const state: RootState = getState(); // RootState
      const stat = state.stat;
      const oldDayStat = stat.daily[addedStat.day];

      let prevWorkoutStatOfDay: Stat[] = [addedStat];
      if (oldDayStat && oldDayStat[addedStat.workoutId]) {
        prevWorkoutStatOfDay = [...oldDayStat[addedStat.workoutId], addedStat];
      }

      await StatDB.insertStat(addedStat.day, {
        ...(oldDayStat ? oldDayStat : {}),
        [addedStat.workoutId]: prevWorkoutStatOfDay,
      });

      dispatch({
        type: SET_STAT,
        payload: {
          day: addedStat.day,
          workoutId: addedStat.workoutId,
          stat: prevWorkoutStatOfDay,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
};
