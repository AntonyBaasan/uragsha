import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { grey400 } from 'react-native-paper/lib/typescript/src/styles/colors';
import { createImmediatelyInvokedFunctionExpression } from 'typescript';

type ControlButtonProps = {
  iconName: string;
  size: number;
  disabled: boolean;
  onPress: () => void;
};

function ControlButton(props: ControlButtonProps) {
  const { iconName, size, disabled } = props;

  const click = () => {
    if (disabled) {
      return;
    }
    props.onPress();
  };
  return (
    <View style={styles.container}>
      <Ionicons
        name={iconName}
        style={[disabled ? styles.disabledIcon : styles.icon]}
        size={size}
        onPress={click}
      />
    </View>
  );
}

export default ControlButton;

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'black',
    margin: 10,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'black',
  },
  disabledIcon: {
    color: 'grey',
  },
});
