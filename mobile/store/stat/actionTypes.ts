import {Action} from 'redux';
import {DailyStat, Stat} from '../../models/Stat';

export const LOAD_STAT_BETWEEN = 'LOAD_STAT_BETWEEN';
export const SET_STAT = 'SET_STAT';

export interface LoadStatBetweenAction extends Action {
  type: typeof LOAD_STAT_BETWEEN;
  payload: {[day: string]: DailyStat};
}

export interface SetStatAction extends Action {
  type: typeof SET_STAT;
  payload: {day: string; workoutId: string; stat: Stat[]};
}

export type StatActionTypes = LoadStatBetweenAction | SetStatAction;
