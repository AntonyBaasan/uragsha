import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { ScreenNames } from '../../../constants/Screen';
import { getBase64TypePrefix } from '../../../helpers/ImageUtility';
import { Exercise } from '../../../models/Exercise';
import { removeExercises } from '../../../store/exercise/actions';

type ExerciseListItemProps = {
  navigation: any;
  workoutId: string;
  exercise: Exercise;
  order: number;
  drag: () => void;
  remove: (exerciseId: string) => void;
};

function ExerciseListItem(props: ExerciseListItemProps) {
  const { workoutId, exercise, navigation, drag, remove } = props;
  const dispatch = useDispatch();

  const clickDeleteExercise = () => {
    dispatch(removeExercises(workoutId, exercise.id));
  };

  const clickEditExercise = () => {
    navigation.navigate(ScreenNames.ExerciseEditorScreen, {
      workoutId,
      order: exercise.order,
      exercise,
    });
  };

  return (
    <View style={styles.listItem}>
      {exercise.images && exercise.images.length > 0 && (
        <Image
          style={styles.image}
          source={{
            uri:
              getBase64TypePrefix(exercise.images[0].extension) +
              exercise.images[0].base64,
          }}
        />
      )}
      <Text style={styles.listItemText}>
        {exercise.title}(order:{exercise.order})
      </Text>
      <Button style={styles.deleteButton} onPress={clickEditExercise}>
        Edit
      </Button>
      <Button style={styles.deleteButton} onPress={clickDeleteExercise}>
        X
      </Button>
      <TouchableOpacity style={styles.listItemDragPin} onPressIn={drag}>
        <Text>###</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ExerciseListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  listItemDragPin: {
    height: 50,
    width: 50,
    backgroundColor: 'red',
  },
  listItemText: {
    flex: 1,
    backgroundColor: 'grey',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: 'red',
    margin: 5,
  },
  image: {
    width: 40,
    height: 40,
    margin: 5,
  },
});
