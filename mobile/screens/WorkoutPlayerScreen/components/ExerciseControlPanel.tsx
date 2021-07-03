import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, Button, Icon, Text } from 'react-native-elements';
import { ExerciseType } from '../../../models/ExcerciseType';
import { ExerciseTask } from '../../../models/ExerciseTask';

import ControlButton from './ControlButton';

type ExerciseControlPanelProps = {
  task: ExerciseTask | undefined;
  isDone: boolean;
  isPaused: boolean;
  onExerciseTable: () => void;
  onDone: () => void;
  onSkipForward: () => void;
  onPause: () => void;
  onClose: () => void;
  onRestart: () => void;
};

const ControlButtonSize = 50;

function ExerciseControlPanel(props: ExerciseControlPanelProps) {
  const { task, isDone, isPaused } = props;

  const renderReps = () => (
    <View style={styles.buttonRow}>
      <ControlButton
        iconName="md-list"
        size={ControlButtonSize}
        onPress={props.onExerciseTable}
        disabled={isDone}
      />
      <ControlButton
        iconName="md-checkmark"
        size={ControlButtonSize}
        onPress={props.onDone}
        disabled={isDone}
      />
      <ControlButton
        iconName="md-skip-forward"
        size={ControlButtonSize}
        onPress={props.onSkipForward}
        disabled={isDone}
      />
    </View>
  );

  const renderCardio = () => (
    <View style={styles.buttonRow}>
      <ControlButton
        iconName="md-list"
        size={ControlButtonSize}
        onPress={props.onExerciseTable}
        disabled={isDone}
      />
      <ControlButton
        iconName={isPaused ? 'ios-play' : 'ios-pause'}
        size={ControlButtonSize}
        onPress={props.onPause}
        disabled={isDone}
      />
      <ControlButton
        iconName="md-skip-forward"
        size={ControlButtonSize}
        onPress={props.onSkipForward}
        disabled={isDone}
      />
    </View>
  );

  const renderRest = () => (
    <View style={styles.buttonRow}>
      <ControlButton
        iconName="md-skip-forward"
        size={ControlButtonSize}
        onPress={props.onSkipForward}
        disabled={isDone}
      />
    </View>
  );

  const renderDone = () => (
    <View style={styles.buttonRow}>
      <ControlButton
        iconName="md-repeat"
        size={ControlButtonSize}
        onPress={props.onRestart}
        disabled={false}
      />
      <ControlButton
        iconName="md-close"
        size={ControlButtonSize}
        onPress={props.onClose}
        disabled={false}
      />
    </View>
  );

  const RenderButtons = () => {
    if (isDone) {
      return renderDone();
    }
    if (task?.isRest === true) {
      return renderRest();
    }
    if (task?.exerciseType === ExerciseType.Reps) {
      return renderReps();
    }
    if (task?.exerciseType === ExerciseType.Cardio) {
      return renderCardio();
    }
  };

  return <View style={styles.container}>{RenderButtons()}</View>;
}

export default ExerciseControlPanel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
});
