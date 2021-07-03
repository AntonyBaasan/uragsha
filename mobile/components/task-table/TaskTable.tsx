import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {ExerciseTask} from '../../models/ExerciseTask';
import TableRow from './TaskTableRow';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

type ExerciseTableProps = {
  tasks: ExerciseTask[];
  currentTaskIndex: number;
  close: () => void;
};

function ExerciseTaskTable(props: ExerciseTableProps) {
  const {tasks, close, currentTaskIndex} = props;
  const [visibleTasks, setVisibleTasks] = useState<ExerciseTask[]>([]);

  useEffect(() => {
    setVisibleTasks(tasks.filter(t => !t.isRest));
  }, [tasks]);

  const row = ({item, index}: {item: ExerciseTask; index: number}) => {
    return <TableRow task={item} rowIndex={index} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Tasks</Text>
      </View>
      <FlatList
        data={visibleTasks}
        renderItem={row}
        keyExtractor={item => item.id}
      />
      <Button onPress={close} title="Close" />
    </View>
  );
}

export default ExerciseTaskTable;

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 50,
    height: screenHeight - 150,
  },
  title: {
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  titleText: {
    fontSize: 44,
  },
});
