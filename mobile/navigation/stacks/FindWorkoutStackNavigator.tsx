import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import i18n from 'i18n-js';

import { ScreenNames } from '../../constants/Screen';
import useColorScheme from '../../hooks/useColorScheme';
import { MarketplaceScreen } from '../../screens';
import { TabFindParamList } from '../../types';
import createDefaultScreenOptions from './ScreenOptions';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { CustomHeaderButton } from '../../components/navigation/HeaderButtons';

const FindStack = createStackNavigator<TabFindParamList>();

export function FindWorkoutNavigator({ navigation }: any) {
  const colorScheme = useColorScheme();
  const toggleDrawer = () => navigation.toggleDrawer();
  const defaultScreenOptions = createDefaultScreenOptions(
    i18n.t('tab.find'),
    colorScheme
  );

  return (
    <FindStack.Navigator screenOptions={defaultScreenOptions}>
      <FindStack.Screen
        name={ScreenNames.MarketplaceScreen}
        component={MarketplaceScreen}
        options={{
          headerTitle: 'Find',
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item title="Menu" iconName="ios-menu" onPress={toggleDrawer} />
            </HeaderButtons>
          ),
        }}
      />
    </FindStack.Navigator>
  );
}
