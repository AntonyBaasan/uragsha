import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import i18n from 'i18n-js';

import { ScreenNames } from '../../constants/Screen';
import { TabSettingsParamList } from '../../types';
import { SettingsScreen } from '../../screens';
import useColorScheme from '../../hooks/useColorScheme';
import createDefaultScreenOptions from './ScreenOptions';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { CustomHeaderButton } from '../../components/navigation/HeaderButtons';

const SettingsStack = createStackNavigator<TabSettingsParamList>();

export function SettingsNavigator({ navigation }: any) {
  const colorScheme = useColorScheme();
  const toggleDrawer = () => navigation.toggleDrawer();
  const screenOptions = createDefaultScreenOptions(
    i18n.t('tab.settings'),
    colorScheme
  );
  return (
    <SettingsStack.Navigator screenOptions={screenOptions}>
      <SettingsStack.Screen
        name={ScreenNames.SettingsScreen}
        component={SettingsScreen}
        options={{
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item title="Menu" iconName="ios-menu" onPress={toggleDrawer} />
            </HeaderButtons>
          ),
        }}
      />
    </SettingsStack.Navigator>
  );
}
