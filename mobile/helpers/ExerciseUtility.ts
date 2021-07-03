import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {ExerciseType} from '../models/ExcerciseType';
import {Exercise} from '../models/Exercise';
import {ExcerciseTaskStatus, ExerciseTask} from '../models/ExerciseTask';

export default function useMapExerciseToTask(
  exercises: Exercise[] | undefined,
) {
  if (exercises) {
    // converts Exercise object to ExerciseTask object list based on the Sets property
    return exercises.flatMap(e =>
      Array.from(Array(e.sets).keys()).flatMap(() =>
        mapExerciseToExerciseTask(e),
      ),
    );
  }
  return [];
}

function mapExerciseToExerciseTask(e: Exercise): ExerciseTask[] {
  const tasks: ExerciseTask[] = [
    {
      id: uuidv4(),
      exerciseId: e.id,
      exerciseType: e.exerciseType,
      order: e.order,
      title: e.title,
      description: e.description,
      duration: e.duration,
      sets: e.sets,
      reps: e.reps,
      status: ExcerciseTaskStatus.NotStarted,
      images: e.images ?? [],
      isRest: false,
    },
  ];
  if (e.hasRest && e.restTime && e.restTime > 0) {
    tasks.push({
      id: uuidv4(),
      exerciseId: e.id,
      exerciseType: ExerciseType.Cardio,
      order: e.order,
      title: 'Rest',
      description: '',
      duration: e.restTime,
      sets: 1,
      reps: 1,
      status: ExcerciseTaskStatus.NotStarted,
      images: [],
      isRest: true,
    });
  }

  return tasks;
}
