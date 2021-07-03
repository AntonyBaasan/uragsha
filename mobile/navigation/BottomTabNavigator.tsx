import * as React from 'react';
import {Ionicons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import i18n from 'i18n-js';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import {BottomTabParamList} from '../types';
import {FindWorkoutNavigator} from './stacks/FindWorkoutStackNavigator';
import {WorkoutNavigator} from './stacks/WorkoutStackNavigator';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Workouts"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tabTint,
      }}>
      <BottomTab.Screen
        name="Workouts"
        component={WorkoutNavigator}
        options={{
          tabBarLabel: i18n.t('tab.workouts'),
          tabBarIcon: ({color}) => <TabBarIcon name="ios-list" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Find"
        component={FindWorkoutNavigator}
        options={{
          tabBarLabel: i18n.t('tab.find'),
          tabBarIcon: ({color}) => (
            <TabBarIcon name="ios-cloudy" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {name: string; color: string}) {
  return <Ionicons size={24} style={{marginBottom: -3}} {...props} />;
}
