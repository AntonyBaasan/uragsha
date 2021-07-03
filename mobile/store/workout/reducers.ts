import {WorkoutState} from '../models';
import {
  LOAD_WORKOUTS,
  CREATE_WORKOUT,
  DELETE_WORKOUT,
  UPDATE_WORKOUT,
  WorkoutActionTypes,
  DeleteWorkoutAction,
  UpdateWorkoutAction,
  CreateWorkoutAction,
  LoadWorkoutsAction,
} from './actionTypes';

const initState: WorkoutState = {
  workouts: [],
};

const workoutReducer = (
  state: WorkoutState = initState,
  action: WorkoutActionTypes,
): WorkoutState => {
  switch (action.type) {
    case LOAD_WORKOUTS:
      return _loadWorkouts(state, action);
    case CREATE_WORKOUT:
      return _createWorkout(state, action);
    case UPDATE_WORKOUT:
      return _updateWorkout(state, action);
    case DELETE_WORKOUT:
      return _deleteWorkout(state, action);
    default:
      return state;
  }
};

export default workoutReducer;

function _loadWorkouts(
  state: WorkoutState,
  action: LoadWorkoutsAction,
): WorkoutState {
  return {
    ...state,
    workouts: [...action.payload.workouts],
  };
}

function _createWorkout(
  state: WorkoutState,
  action: CreateWorkoutAction,
): WorkoutState {
  return {
    ...state,
    workouts: [...state.workouts, action.payload.workout],
  };
}

function _updateWorkout(state: WorkoutState, action: UpdateWorkoutAction) {
  const index = state.workouts.findIndex(
    e => e.id === action.payload.workout.id,
  );
  state.workouts.splice(index, 1, action.payload.workout);
  return {...state, workouts: [...state.workouts]};
}

function _deleteWorkout(state: WorkoutState, action: DeleteWorkoutAction) {
  const listWithRemovedItem = state.workouts.filter(
    e => e.id !== action.payload.workoutId,
  );
  return {...state, workouts: listWithRemovedItem};
}
