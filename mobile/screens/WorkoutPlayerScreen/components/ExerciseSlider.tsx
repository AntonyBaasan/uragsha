import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ExerciseTask } from '../../../models/ExerciseTask';
import SlideItem from './SlideItem';
import { Text } from 'react-native-elements';

type ExerciseSliderProps = {
  taskList: ExerciseTask[];
  currentExerciseIndex: number;
  isDone: boolean;
  taskDone: () => void;
  secondsBeforeDone: number;
  notificationBeforeDone: () => void;
};

function ExerciseSlider(props: ExerciseSliderProps) {
  const {
    taskList,
    currentExerciseIndex,
    isDone,
    taskDone,
    secondsBeforeDone,
    notificationBeforeDone,
  } = props;

  const renderSlideItem = () => {
    if (!isDone) {
      return (
        <SlideItem
          task={taskList[currentExerciseIndex]}
          taskDone={taskDone}
          secondsBeforeDone={secondsBeforeDone}
          notificationBeforeDone={notificationBeforeDone}
        />
      );
    }
  };

  const renderDone = () => {
    if (isDone) {
      return (
        <View style={styles.doneView}>
          <Text style={styles.doneText}>Done</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderSlideItem()}
      {renderDone()}
    </ScrollView>
  );
}

export default ExerciseSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneView: {
    margin: 10,
    // backgroundColor: 'red',
  },
  doneText: {
    fontSize: 35,
  },
  sliderList: {},
});
