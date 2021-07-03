import React, {useEffect, useLayoutEffect} from 'react';
import {StyleSheet, SafeAreaView, FlatList} from 'react-native';
import i18n from 'i18n-js';
import {ThemeProvider} from 'react-native-elements';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useSelector, useDispatch} from 'react-redux';

import {ScreenNames} from '../../constants/Screen';
import {mainTheme} from '../../constants/theme/Main';
import WorkoutListItem from './WorkoutListItem';
import {CustomHeaderButton} from '../../components/navigation/HeaderButtons';
import {RootState} from '../../store/models';
import {deleteWorkout, loadWorkouts} from '../../store/workout/actions';
import {Workout} from '../../models/workout';

type WorkoutListProps = {navigation: any};

function WorkoutListScreen(props: WorkoutListProps) {
  const dispatch = useDispatch();
  const workouts = useSelector((state: RootState) => state.workout.workouts);

  useEffect(() => {
    dispatch(loadWorkouts());
  }, []);

  const onChooseCreateScreen = () => {
    props.navigation.navigate(ScreenNames.WorkoutEditorScreen, {
      workoutId: undefined,
    });
    // This line has to be uncomment after marketplace is enabled
    // props.navigation.navigate(ScreenNames.ChooseCreateScreen);
  };

  const onStartWorkout = (itemId: string) => {
    props.navigation.navigate(ScreenNames.WorkoutPlayerScreen, {
      workoutId: itemId,
    });
  };

  const onShowWorkoutDetail = (itemId: string) => {
    props.navigation.navigate(ScreenNames.WorkoutDetailScreen, {
      workoutId: itemId,
    });
  };

  const onDeleteWorkout = (itemId: string) => {
    dispatch(deleteWorkout(itemId));
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title={i18n.t('add_workout')}
            iconName="ios-add-circle-outline"
            onPress={onChooseCreateScreen}
          />
        </HeaderButtons>
      ),
    });
  }, []);

  const renderWorkoutItem = ({item}: {item: Workout}) => {
    return (
      <WorkoutListItem
        item={item}
        start={onStartWorkout.bind(null, item.id)}
        details={onShowWorkoutDetail.bind(null, item.id)}
        delete={onDeleteWorkout.bind(null, item.id)}
      />
    );
  };

  const keyExtractor = (item: Workout) => item.id;

  return (
    <ThemeProvider theme={mainTheme}>
      <SafeAreaView style={styles.container}>
        <FlatList
          contentContainerStyle={styles.flatlistContentContainerStyle}
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={keyExtractor}
        />
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default WorkoutListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlistContentContainerStyle: {
    paddingBottom: 20,
  },
});
