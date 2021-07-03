import { Exercise, ExerciseMetadataStatus } from '../../models/Exercise';
import { ExerciseState } from '../models';
import {
  ADD_EXERCISE,
  LOAD_EXERCISES,
  REMOVE_EXERCISE,
  REORDER_EXERCISE,
  UPDATE_EXERCISE,
  ExerciseActionTypes,
  LoadExercisesAction,
  AddExerciseAction,
  RemoveExerciseAction,
  UpdateExerciseAction,
  ReorderExerciseAction,
} from './actionTypes';

const initState: ExerciseState = {
  exercises: [],
};

const exerciseReducer = (
  state: ExerciseState = initState,
  action: ExerciseActionTypes
): ExerciseState => {
  switch (action.type) {
    case LOAD_EXERCISES:
      return _loadExercises(action, state);
    case ADD_EXERCISE:
      return _addExercise(action, state);
    case REMOVE_EXERCISE:
      return _removeExercise(action, state);
    case UPDATE_EXERCISE:
      return _updateExercise(action, state);
    case REORDER_EXERCISE:
      return _reorderExercise(action, state);
    default:
      return state;
  }
};

export default exerciseReducer;

function _loadExercises(action: LoadExercisesAction, state: ExerciseState) {
  action.payload.exercises.forEach((exercise) =>
    _updateMetadataState(exercise, ExerciseMetadataStatus.None)
  );
  return {
    ...state,
    exercises: [...action.payload.exercises],
  };
}

function _addExercise(action: AddExerciseAction, state: ExerciseState) {
  _updateMetadataState(action.payload.exercise, ExerciseMetadataStatus.Created);
  const exercises = state.exercises;
  exercises.splice(action.payload.order, 0, action.payload.exercise);
  exercises.forEach((e, index) => (e.order = index));
  return {
    ...state,
    exercises: [...exercises],
  };
}

function _removeExercise(action: RemoveExerciseAction, state: ExerciseState) {
  const exercises = state.exercises;
  const index = exercises.findIndex(
    (e) =>
      e.workoutId === action.payload.workoutId &&
      e.id === action.payload.exerciseId
  );
  if (index !== -1) {
    if (exercises[index].metadata.status === ExerciseMetadataStatus.Created) {
      console.log('reducer: spliced');
      exercises.splice(index, 1);
    } else {
      console.log('reducer: ExerciseMetadataStatus.Deleted');
      _updateMetadataState(exercises[index], ExerciseMetadataStatus.Deleted);
    }
    exercises.forEach((e, index) => (e.order = index));
    return {
      ...state,
      exercises: [...exercises],
    };
  }
  return state;
}

function _updateExercise(action: UpdateExerciseAction, state: ExerciseState) {
  const exercises = state.exercises;
  const index = exercises.findIndex(
    (e) =>
      e.workoutId === action.payload.exercise.workoutId &&
      e.id === action.payload.exercise.id
  );
  console.log('index:', index);
  if (index !== -1) {
    exercises.splice(index, 1, action.payload.exercise);
    return {
      ...state,
      exercises: [...exercises],
    };
  }
  return state;
}

function _reorderExercise(action: ReorderExerciseAction, state: ExerciseState) {
  const exercises = action.payload.exercises;
  exercises.forEach((e, index) => (e.order = index));
  return {
    ...state,
    exercises: [...exercises],
  };
}

function _updateMetadataState(
  exercise: Exercise,
  metadataStatus: ExerciseMetadataStatus
) {
  if (exercise.metadata) {
    exercise.metadata.status = metadataStatus;
  } else {
    exercise.metadata = { status: metadataStatus };
  }
}
