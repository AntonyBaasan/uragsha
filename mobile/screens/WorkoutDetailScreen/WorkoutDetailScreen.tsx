import React, {useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import i18n from 'i18n-js';
import {ThemeProvider, Text} from 'react-native-elements';
import {mainTheme} from '../../constants/theme/Main';
import {Workout} from '../../models/Workout';
import {ScreenNames} from '../../constants/Screen';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/models';
import {ScrollView} from 'react-native-gesture-handler';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {CustomHeaderButton} from '../../components/navigation/HeaderButtons';
import {loadExercises} from '../../store/exercise/actions';
import {Exercise} from '../../models/Exercise';

type WorkoutDetailScreenProps = {
  navigation: any;
  route: {params: {workoutId: string}};
};

function WorkoutDetailScreen(props: WorkoutDetailScreenProps) {
  const {workoutId} = props.route?.params;

  const workouts = useSelector((state: RootState) => state.workout.workouts);
  const [workout, setWorkout] = useState<Workout>();
  const [exerciseList, setExerciseList] = useState<Exercise[]>();
  const dispatch = useDispatch();

  const exercises = useSelector((state: RootState) => state.exercise.exercises);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // console.log('props.navigation.addListener(focus)');
      dispatch(loadExercises(workoutId));
    });
    return unsubscribe;
  }, [props.navigation, workoutId, dispatch]);
  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('blur', (payload) => {
  //     dispatch(loadExercises(''));
  //   });
  //   return unsubscribe;
  // }, [props.navigation]);

  useEffect(() => {
    console.log('useEffect workouts called.');
    const found = workouts.find(d => d.id === workoutId);
    setWorkout(found);
  }, [workouts, workoutId]);
  useEffect(() => {
    setExerciseList(exercises);
  }, [exercises]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      // headerTitle: workout == null ? 'No title' : workout.title,
      headerTitle: '',
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title={i18n.t('edit')} onPress={onEdit} />
        </HeaderButtons>
      ),
    });
  }, [workout]);

  const onEdit = () => {
    console.log(workout?.id);
    props.navigation.navigate(ScreenNames.WorkoutEditorScreen, {
      workoutId,
    });
  };

  const renderTag = () => {
    return workout?.tags.map(t => {
      return (
        <Text key={t} style={styles.tag}>
          {t}
        </Text>
      );
    });
  };

  const renderExercises = () => {
    return exerciseList?.map(e => (
      <View key={e.id}>
        <Text>{e.title}</Text>
      </View>
    ));
  };
  return (
    <ThemeProvider theme={mainTheme}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>{workout?.title}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.description}>{workout?.description}</Text>
        </View>
        <View style={styles.section}>{renderTag()}</View>
        <View>{renderExercises()}</View>
        {/* <Text>{JSON.stringify(workout, null, 2)}</Text> */}
      </ScrollView>
    </ThemeProvider>
  );
}

export default WorkoutDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    margin: 10,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
  },
  tag: {},
  description: {},
  text: {
    textAlign: 'center',
    fontSize: 25,
  },
});
