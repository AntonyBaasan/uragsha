import * as React from 'react';
import {HeaderButton} from 'react-navigation-header-buttons';
import {Ionicons} from '@expo/vector-icons';

export const CustomHeaderButton = (props: any) => (
  <HeaderButton
    IconComponent={Ionicons}
    iconSize={25}
    color="white"
    {...props}
  />
);
