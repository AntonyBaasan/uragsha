import {Ionicons} from '@expo/vector-icons';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Tooltip, Text} from 'react-native-elements';

export interface ITooltipMenuItem {
  text: string;
  onClick: () => void;
  iconName?: string;
}

type TooltipMenuProps = {
  items: ITooltipMenuItem[];
  height: number;
  width: number;
  children: any;
};

function TooltipMenu(props: TooltipMenuProps) {
  let refTooltip = useRef(null);
  const {items, height, width} = props;
  const [isTooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {}, []);
  useEffect(() => {}, [items]);

  const closeTooltip = () => {
    if (refTooltip.current && isTooltipOpen) {
      (refTooltip as any).current.toggleTooltip();
    }
  };

  const onItemClick = (item: ITooltipMenuItem) => {
    closeTooltip();
    item.onClick();
  };

  const renderItems = () => {
    return items.map((item: ITooltipMenuItem, index: number) => (
      <TouchableOpacity
        key={index}
        style={styles.buttonContainerStyle}
        // tslint:disable-next-line: jsx-no-lambda
        onPress={() => onItemClick(item)}>
        {!item.iconName && <View style={styles.buttonIcon} />}
        {item.iconName && (
          <Ionicons
            style={styles.buttonIcon}
            name={item.iconName as any}
            size={26}
            color="black"
          />
        )}
        <Text style={styles.buttonTitle}>{item.text}</Text>
      </TouchableOpacity>
    ));
  };

  const onOpen = () => {
    setTooltipOpen(true);
  };
  const onClose = () => {
    setTooltipOpen(false);
  };

  const renderMenu = () => {
    return <View style={[styles.tooltipContent]}>{renderItems()}</View>;
  };

  return (
    <Tooltip
      ref={refTooltip}
      height={height}
      width={width}
      popover={renderMenu()}
      containerStyle={styles.tooltipContainer}
      onOpen={onOpen}
      onClose={onClose}>
      {props.children}
    </Tooltip>
  );
}

export default TooltipMenu;

const styles = StyleSheet.create({
  tooltipContainer: {
    display: 'flex',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#617080',
    alignItems: 'stretch',
  },
  tooltipContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  buttonContainerStyle: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonIcon: {
    flex: 1,
  },
  buttonTitle: {
    flex: 3,
    fontSize: 20,
    textAlign: 'center',
  },
});
