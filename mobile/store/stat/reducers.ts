import {DailyStat} from '../../models/Stat';
import {StatState} from '../models';
import {
  LOAD_STAT_BETWEEN,
  SET_STAT,
  StatActionTypes,
  LoadStatBetweenAction,
  SetStatAction,
} from './actionTypes';

const initState: StatState = {
  daily: {
    // '20210118': {
    //   '1': [{
    //     day: '20210118',
    //     workoutId: '1',
    //     done: 3,
    //     skipped: 1,
    //   }],
    //   '2': [{
    //     day: '20210118',
    //     workoutId: '1',
    //     done: 7,
    //     skipped: 0,
    //   }],
    // },
  },
};

const exerciseReducer = (
  state: StatState = initState,
  action: StatActionTypes,
): StatState => {
  switch (action.type) {
    case LOAD_STAT_BETWEEN:
      return _loadStatBetween(action, state);
    case SET_STAT:
      return _setStat(action, state);
    default:
      return state;
  }
};

export default exerciseReducer;

function _loadStatBetween(action: LoadStatBetweenAction, state: StatState) {
  const statsByDays: {[day: string]: DailyStat} = action.payload;
  return {
    ...state,
    daily: {
      ...state.daily,
      ...statsByDays,
    },
  };
}

function _setStat(action: SetStatAction, state: StatState) {
  const payload = action.payload;
  return {
    ...state,
    daily: {
      ...state.daily,
      [payload.day]: {
        ...state.daily[payload.day],
        [payload.workoutId]: payload.stat,
      },
    },
  };
}
