import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import i18n from 'i18n-js';

import { ScreenNames } from '../../constants/Screen';
import useColorScheme from '../../hooks/useColorScheme';
import { StatsScreen } from '../../screens';
import { StatsStackParamList } from '../../types';
import createDefaultScreenOptions from './ScreenOptions';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { CustomHeaderButton } from '../../components/navigation/HeaderButtons';

const StatsStack = createStackNavigator<StatsStackParamList>();

export function StatsNavigator({ navigation }: any) {
  const colorScheme = useColorScheme();
  const toggleDrawer = () => navigation.toggleDrawer();
  const defaultScreenOptions = createDefaultScreenOptions(
    i18n.t('tab.stats'),
    colorScheme
  );

  return (
    <StatsStack.Navigator screenOptions={defaultScreenOptions}>
      <StatsStack.Screen
        name={ScreenNames.StatsScreen}
        component={StatsScreen}
        options={{
          headerTitle: i18n.t('tab.stats'),
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item title="Menu" iconName="ios-menu" onPress={toggleDrawer} />
            </HeaderButtons>
          ),
        }}
      />
    </StatsStack.Navigator>
  );
}
