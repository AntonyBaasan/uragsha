import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../store/models';
import WorkoutEditorForm from './components/WorkoutEditorForm';
import {Workout} from '../../models/Workout';
import {loadExercises} from '../../store/exercise/actions';
import {createWorkout, updateWorkout} from '../../store/workout/actions';
import {Exercise, ExerciseMetadataStatus} from '../../models/Exercise';

type WorkoutEditorScreenProps = {
  navigation: any;
  route: {params: {workoutId: string}};
};

function WorkoutEditorScreen(props: WorkoutEditorScreenProps) {
  const {workoutId} = props.route?.params;
  // console.log(workoutId);

  const [isNew, setIsNew] = useState(workoutId === undefined);
  const [visibleExercises, setVisibleExercises] = useState<Exercise[]>([]);
  const dispatch = useDispatch();
  const workout = useSelector((state: RootState) =>
    state.workout.workouts.find(w => w.id === workoutId),
  );
  const exercises = useSelector((state: RootState) => state.exercise.exercises);

  useEffect(() => {
    dispatch(loadExercises(workout ? workout.id : ''));
  }, []);
  useEffect(() => {
    setIsNew(workoutId === undefined);
  }, [workoutId]);
  useEffect(() => {
    setVisibleExercises(
      exercises.filter(
        e => e.metadata.status !== ExerciseMetadataStatus.Deleted,
      ),
    );
    // console.log('useEffect exercises updated:');
    // console.log(exercises);
  }, [exercises]);

  const onWorkoutSaved = (workout: Workout) => {
    if (isNew) {
      console.log('onWorkoutSaved new');
      dispatch(createWorkout(workout, exercises));
      props.navigation.popToTop();
    } else {
      console.log('onWorkoutSaved update');
      dispatch(updateWorkout(workout, exercises));
      props.navigation.pop();
    }
  };

  return (
    <View style={styles.container}>
      <WorkoutEditorForm
        navigation={props.navigation}
        workout={workout}
        exercises={visibleExercises}
        save={onWorkoutSaved}
      />
    </View>
  );
}

export default WorkoutEditorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
