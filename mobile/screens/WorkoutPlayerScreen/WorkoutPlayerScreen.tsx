import React, {useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {ThemeProvider, Overlay} from 'react-native-elements';
import {Audio} from 'expo-av';

import {Text} from '../../components/Themed';
import {mainTheme} from '../../constants/theme/Main';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/models';
import ExerciseSlider from './components/ExerciseSlider';
import ExerciseControlPanel from './components/ExerciseControlPanel';
import {ExcerciseTaskStatus, ExerciseTask} from '../../models/ExerciseTask';
import {loadExercises} from '../../store/exercise/actions';
import {addStat} from '../../store/stat/actions';
import ExerciseTaskTable from '../../components/task-table/TaskTable';
import * as StatUtility from '../../helpers/StatUtility';
import useMapExerciseToTask from '../../helpers/ExerciseUtility';

const startSoundSource = require('../../assets/sounds/piano-notification-2.mp3');
const endSoundSource = require('../../assets/sounds/robotic-countdown-321-go.wav');
const secondsBeforeDone = 3;

type TimerProps = {
  navigation: any;
  route: {params: {workoutId: string}};
};
function WorkoutPlayerScreen({route, navigation}: TimerProps) {
  const {workoutId} = route.params;

  const [startSound, setStartSound] = useState<Audio.Sound>();
  const [endSound, setEndSound] = useState<Audio.Sound>();

  const dispatch = useDispatch();
  const workout = useSelector((state: RootState) =>
    state.workout.workouts.find(w => w.id === workoutId),
  );
  const exercises = useSelector((state: RootState) => state.exercise.exercises);

  useEffect(() => {
    dispatch(loadExercises(workoutId));

    const loadSound = async (source: any, setter: any) => {
      const {sound} = await Audio.Sound.createAsync(source);
      setter(sound);
    };

    loadSound(startSoundSource, setStartSound);
    loadSound(endSoundSource, setEndSound);

    return () => {
      console.log('unload WorkoutPlayerScreen!');
      // after closing this screen should clear current exercise list from state.
      dispatch(loadExercises(''));
      if (startSound) {
        startSound.unloadAsync();
      }
      if (endSound) {
        endSound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    // console.log(exercises);
    const taskList = useMapExerciseToTask(exercises ?? []);
    setTaskList(taskList);
    setTaskIndex(0);
  }, [exercises]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: workout?.title,
    });
  }, [navigation, workout]);

  const [taskList, setTaskList] = useState(
    useMapExerciseToTask(exercises ?? []),
  );
  const [taskIndex, setTaskIndex] = useState(0);
  const [currentTask, setCurrentTask] = useState<ExerciseTask>();
  const [isTaskTableVisible, setTaskTableVisible] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isPaused, setIsPause] = useState(false);

  useEffect(() => {
    if (taskList.length === 0) {
      return;
    }
    taskList[taskIndex].status = ExcerciseTaskStatus.InProgress;
    setCurrentTask(taskList[taskIndex]);
  }, [taskIndex, taskList]);

  useEffect(() => {
    playStartSound();
  }, [currentTask]);

  const showExerciseTable = () => {
    setTaskTableVisible(!isTaskTableVisible);
  };
  const doneExercise = () => {
    if (!currentTask) {
      return;
    }
    currentTask.status = ExcerciseTaskStatus.Done;
    goToNext();
  };
  const togglePauseExercise = () => {
    if (!currentTask) {
      return;
    }
    const newPausedState = !isPaused;
    setIsPause(newPausedState);
    currentTask.status = newPausedState
      ? ExcerciseTaskStatus.Paused
      : ExcerciseTaskStatus.InProgress;
  };
  const skipExercise = () => {
    if (!currentTask) {
      return;
    }
    currentTask.status = ExcerciseTaskStatus.Skipped;
    goToNext();
  };
  const close = () => {
    navigation.pop();
  };
  const restart = () => {
    console.log('restart');
    saveStat();
    taskList.forEach(t => (t.status = ExcerciseTaskStatus.NotStarted));
    setTaskIndex(0);
    setIsDone(false);
  };
  const getCurrentExercise = (): ExerciseTask | undefined => {
    return taskList[taskIndex];
  };
  const goToNext = () => {
    if (workout && taskIndex < taskList.length - 1) {
      setTaskIndex(prevTaskIndex => prevTaskIndex + 1);
      return;
    }
    setIsDone(true);
    saveStat();
  };

  const playStartSound = async () => {
    console.log('playStartSound!');
    await startSound?.replayAsync();
  };

  const notificationBeforeDone = async () => {
    console.log('notificationBeforeDone!');
    await endSound?.replayAsync();
  };

  const saveStat = () => {
    // update stat
    if (workout) {
      const stat = StatUtility.convertTaskListToStat(workoutId, taskList);
      dispatch(addStat(stat));
    }
  };

  //#region Render methods
  const renderTaskTable = () => {
    return (
      <View style={styles.overlayTaskTable}>
        <Overlay
          isVisible={isTaskTableVisible}
          onBackdropPress={showExerciseTable}>
          <ExerciseTaskTable
            tasks={taskList}
            close={showExerciseTable}
            currentTaskIndex={taskIndex}
          />
        </Overlay>
      </View>
    );
  };
  const renderContent = () => {
    if (taskList.length > 0 && currentTask) {
      return (
        <View style={styles.content}>
          {renderTaskTable()}
          <View style={styles.slider}>
            <Text style={styles.title}>
              (taskIndex: {taskIndex}) isDone: {isDone ? 'true' : 'false'}
            </Text>
            <Text style={styles.title}>CurrentTaskId:{currentTask?.title}</Text>
            <ExerciseSlider
              taskList={taskList}
              currentExerciseIndex={taskIndex}
              isDone={isDone}
              taskDone={doneExercise}
              secondsBeforeDone={secondsBeforeDone}
              notificationBeforeDone={notificationBeforeDone}
            />
          </View>
          <View style={styles.controlPanelRow}>
            <ExerciseControlPanel
              task={getCurrentExercise()}
              onExerciseTable={showExerciseTable}
              onDone={doneExercise}
              onPause={togglePauseExercise}
              onSkipForward={skipExercise}
              onClose={close}
              onRestart={restart}
              isDone={isDone}
              isPaused={isPaused}
            />
          </View>
        </View>
      );
    }
  };
  //#endregion

  return (
    <ThemeProvider theme={mainTheme}>
      <SafeAreaView style={styles.container}>
        {taskList.length === 0 && (
          <View style={styles.content}>
            <Text>Loading...</Text>
          </View>
        )}
        {renderContent()}
      </SafeAreaView>
    </ThemeProvider>
  );
}
export default WorkoutPlayerScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
  },
  slider: {
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  controlPanelRow: {
    height: 100,
  },
  overlayTaskTable: {
    // flex: 1,
    // width: screenWidth ,
    // backgroundColor: 'red',
  },
});
