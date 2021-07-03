import 'react-native-get-random-values';
import { Exercise } from '../../../models/Exercise';
import * as actions from '../actions';
import {
  AddExerciseAction,
  ADD_EXERCISE,
  LOAD_EXERCISES,
  RemoveExerciseAction,
  REMOVE_EXERCISE,
  UpdateExerciseAction,
  UPDATE_EXERCISE,
} from '../actionTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// this allows the jest to use the mock implementation from __mocks__ directory
jest.mock('../../../helpers/db/exercise');
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('exercise actions', () => {
  beforeEach(() => {});
  it('should load exercise: select from db and dispatch load exercises action', () => {
    const exercises = [
      { id: '1', workoutId: '1' } as Exercise,
      { id: '2', workoutId: '1' } as Exercise,
    ];
    const store = mockStore({});

    // Return the promise
    return store.dispatch(actions.loadExercises('1')).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual(LOAD_EXERCISES);
      expect(actions[0].payload['exercises']).toEqual(exercises);
    });
  });
  it('should create add exercise action', () => {
    const exercise = {} as Exercise;
    const expectedAction: AddExerciseAction = {
      type: ADD_EXERCISE,
      payload: { order: 1, exercise },
    };

    expect(actions.addExercises(1, exercise)).toEqual(expectedAction);
  });
  it('should create remove exercise action', () => {
    const expectedAction: RemoveExerciseAction = {
      type: REMOVE_EXERCISE,
      payload: { workoutId: '1', exerciseId: '2' },
    };

    expect(actions.removeExercises('1', '2')).toEqual(expectedAction);
  });
  it('should create update exercise action', () => {
    const exercise = { id: '3' } as Exercise;
    const expectedAction: UpdateExerciseAction = {
      type: UPDATE_EXERCISE,
      payload: { exercise },
    };

    expect(actions.updateExercises(exercise)).toEqual(expectedAction);
  });
});
