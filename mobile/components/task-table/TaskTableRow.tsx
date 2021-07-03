import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {ExcerciseTaskStatus, ExerciseTask} from '../../models/ExerciseTask';

type TableRowProps = {
  task: ExerciseTask;
  rowIndex: number;
};

function TableRow({task, rowIndex}: TableRowProps) {
  const renderRowStatus = () => {
    if (task.status === ExcerciseTaskStatus.Skipped) {
      return <Text>(skipped)</Text>;
    }
    if (task.status === ExcerciseTaskStatus.Done) {
      return <Text>(done)</Text>;
    }
    if (task.status === ExcerciseTaskStatus.InProgress) {
      return <Text>(*)</Text>;
    }
  };
  return (
    <View style={styles.row}>
      {renderRowStatus()}
      <Text style={styles.rowText}>{task.title}</Text>
    </View>
  );
}

export default TableRow;

const styles = StyleSheet.create({
  row: {
    marginTop: 10,
    flexDirection: 'row',
  },
  rowText: {
    fontSize: 22,
  },
});
