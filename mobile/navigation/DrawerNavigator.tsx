import * as React from 'react';
import i18n from 'i18n-js';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {SettingsNavigator} from './stacks/SettingsStackNavigator';
import {DebugNavigator} from './stacks/DebugStackNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import {StatsNavigator} from './stacks/StatsStackNavigator';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Workouts"
        component={BottomTabNavigator}
        options={{drawerLabel: i18n.t('tab.workouts')}}
      />
      <Drawer.Screen
        name="Stats"
        component={StatsNavigator}
        options={{drawerLabel: i18n.t('tab.stats')}}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{drawerLabel: i18n.t('tab.settings')}}
      />
      <Drawer.Screen name="Debug" component={DebugNavigator} />
    </Drawer.Navigator>
  );
}
