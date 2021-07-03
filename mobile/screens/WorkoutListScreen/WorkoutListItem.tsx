import React, {useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Dimensions,
} from 'react-native';
import {Card, Text} from 'react-native-elements';
import i18n from 'i18n-js';
import {Ionicons} from '@expo/vector-icons';
import {View} from '../../components/Themed';
import usePlatformInfo from '../../hooks/usePlatformInfo';
import {Workout} from '../../models/Workout';
import {sharedStyles} from '../../constants/sharedStyles';
import TooltipMenu, {
  ITooltipMenuItem,
} from '../../components/tooltip-menu/TooltipMenu';

const width = Dimensions.get('window').width;
const tooltipWidth = 150;
const tooltipHeight = 170;

type WorkoutListItemProps = {
  item: Workout;
  start: () => void;
  details: () => void;
  delete: () => void;
};

function WorkoutListItem(props: WorkoutListItemProps) {
  const {isAndroid21} = usePlatformInfo();

  useEffect(() => {
    return () => {};
  });

  const clickStart = () => {
    props.start();
  };
  const clickDelete = () => {
    props.start();
  };
  const clickDetail = () => {
    props.details();
  };
  const items: ITooltipMenuItem[] = [
    {
      text: i18n.t('more'),
      onClick: clickDetail,
      iconName: 'information-circle-outline',
    },
    {
      text: i18n.t('start'),
      onClick: clickStart,
      iconName: 'play-circle-outline',
    },
    {
      text: i18n.t('delete'),
      onClick: clickDelete,
      iconName: 'remove-circle-outline',
    },
  ];
  let TouchableCmp: any = TouchableOpacity;
  if (isAndroid21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const renderTooltipMenu = () => {
    return (
      <TooltipMenu height={tooltipHeight} width={tooltipWidth} items={items}>
        <Ionicons
          name="ellipsis-vertical-circle-outline"
          size={36}
          color="black"
        />
      </TooltipMenu>
    );
  };

  return (
    <TouchableCmp accessibilityLabel="workout item" onPress={clickStart}>
      <Card containerStyle={[styles.card, sharedStyles.basicShadow]}>
        <Card.Title style={styles.title} numberOfLines={1}>
          {props.item.title}
        </Card.Title>
        <Card.Divider />
        <Text numberOfLines={5} style={styles.description}>
          {props.item.description}
        </Text>
        <Card.Divider />
        <View style={styles.buttonRow}>{renderTooltipMenu()}</View>
      </Card>
    </TouchableCmp>
  );
}

export default WorkoutListItem;

const styles = StyleSheet.create({
  card: {
    width: width - 30,
    borderRadius: 15,
    margin: 15,
  },
  title: {
    display: 'flex',
    fontSize: 22,
    fontFamily: 'roboto-mono-bold',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'roboto-mono',
  },
  buttonRow: {
    flexDirection: 'row-reverse',
    backgroundColor: 'white',
  },
});
