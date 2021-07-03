import React, { useEffect } from 'react';
import { StyleSheet, View} from 'react-native';
import { Text } from 'react-native-elements';
import { ExerciseTask } from '../../../models/ExerciseTask';

type SlideItemRepsProps = {
  task: ExerciseTask;
};

function SlideItemDone(props: SlideItemRepsProps) {
  const { task } = props;
  return (
    <View style={styles.measure}>
      <Text>DONE</Text>
    </View>
  );
}

export default SlideItemDone;

const styles = StyleSheet.create({
  measure: {
    backgroundColor: 'pink',
    height: 100,
    width: 100,
  }
});
