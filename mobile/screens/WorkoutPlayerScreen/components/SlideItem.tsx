import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { imageRotateInterval } from '../../../constants/DefaultValues';
import { getBase64TypePrefix } from '../../../helpers/ImageUtility';
import useInterval from '../../../hooks/useInterval';
import { ExerciseType } from '../../../models/ExcerciseType';
import { ExerciseTask } from '../../../models/ExerciseTask';
import SlideItemReps from './SlideItemReps';
import SlideItemTimed from './SlideItemTimed';

type SlideItemProps = {
  task: ExerciseTask;
  taskDone: () => void;
  secondsBeforeDone: number;
  notificationBeforeDone: () => void;
};

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

function SlideItem(props: SlideItemProps) {
  const { task, taskDone, secondsBeforeDone, notificationBeforeDone } = props;

  const [image, setImage] = useState(
    task.images.length > 0 ? task.images[0] : null
  );

  useEffect(() => {
    setImage(task.images.length > 0 ? task.images[0] : null);
  }, [task]);

  useInterval(() => {
    if (task.images && task.images.length > 0) {
      const index = task.images.findIndex((i) => i === image);
      const newIndex = index + 1 < task.images.length ? index + 1 : 0;
      setImage(task.images[newIndex]);
      console.log('rotate image:');
      console.log(task.images[newIndex].id);
    } else {
      setImage(null);
    }
  }, imageRotateInterval);

  const renderMeansure = () => {
    if (task.exerciseType === ExerciseType.Cardio) {
      return (
        <SlideItemTimed
          task={task}
          taskDone={taskDone}
          secondsBeforeDone={secondsBeforeDone}
          notificationBeforeDone={notificationBeforeDone}
        />
      );
    }
    if (task.exerciseType === ExerciseType.Reps) {
      return <SlideItemReps task={task} />;
    }
  };

  const renderImage = () => {
    if (image) {
      return (
        <Image
          style={styles.image}
          source={{
            uri: getBase64TypePrefix(image.extension) + image.base64,
          }}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.exerciseInfo}>
        {renderImage()}
        {renderMeansure()}
      </View>
      <View style={styles.metadata}>
        <Text>{task.title}</Text>
        <Text>{task.description}</Text>
      </View>
    </View>
  );
}

export default SlideItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screenHeight - 250, // TODO: FlatList has an issue about flexGrow
    width: screenWidth,
    backgroundColor: 'grey',
    padding: 10,
    alignItems: 'stretch',
  },
  image: {
    width: 200,
    height: 200,
  },
  exerciseInfo: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  measure: {
    backgroundColor: 'pink',
    height: 100,
    width: 100,
  },
  metadata: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    flexGrow: 1,
    fontSize: 45,
    height: 150,
    width: 200,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
});
