import { StackNavigationOptions } from '@react-navigation/stack';
import React from 'react';
import Colors from '../../constants/Colors';

export default function createDefaultScreenOptions(
  title: string,
  colorScheme: 'light' | 'dark',
): StackNavigationOptions {
  return {
    headerTintColor: Colors[colorScheme].tint, // color of the text (title) in the header
    headerStyle: {
      backgroundColor: Colors[colorScheme].background,
    },
    headerTitleAlign: 'center',
    headerTitleStyle: {
        fontFamily: 'roboto-mono-bold'
    },
    headerTitle: title
  };
}
