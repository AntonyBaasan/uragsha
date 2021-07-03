import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import i18n from 'i18n-js';

import { ScreenNames } from '../../constants/Screen';
import useColorScheme from '../../hooks/useColorScheme';
import { TabExcerciseParamList } from '../../types';
import {
  WorkoutListScreen,
  WorkoutPlayerScreen,
  WorkoutEditorScreen,
  ExerciseEditorScreen,
  ChooseCreateScreen,
  MarketplaceScreen,
  WorkoutDetailScreen,
} from '../../screens';
import createDefaultScreenOptions from './ScreenOptions';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { CustomHeaderButton } from '../../components/navigation/HeaderButtons';

const WorkoutStack = createStackNavigator<TabExcerciseParamList>();

export function WorkoutNavigator({ navigation }: any) {
  const colorScheme = useColorScheme();
  const toggleDrawer = () => navigation.toggleDrawer();
  const screenOptions = createDefaultScreenOptions('', colorScheme);

  return (
    <WorkoutStack.Navigator screenOptions={screenOptions}>
      <WorkoutStack.Screen
        name={ScreenNames.WorkoutListScreen}
        component={WorkoutListScreen}
        options={{
          headerTitle: 'Workouts',
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item title="Menu" iconName="ios-menu" onPress={toggleDrawer} />
            </HeaderButtons>
          ),
        }}
      />
      <WorkoutStack.Screen
        name={ScreenNames.ChooseCreateScreen}
        component={ChooseCreateScreen}
        options={{ headerTitle: 'Create' }}
      />
      <WorkoutStack.Screen
        name={ScreenNames.WorkoutPlayerScreen}
        component={WorkoutPlayerScreen}
        options={{ headerTitle: 'Workout' }}
      />
      <WorkoutStack.Screen
        name={ScreenNames.WorkoutEditorScreen}
        component={WorkoutEditorScreen}
        options={{ headerTitle: 'Workout Editor' }}
      />
      <WorkoutStack.Screen
        name={ScreenNames.ExerciseEditorScreen}
        component={ExerciseEditorScreen}
        options={{ headerTitle: 'Exercise Editor' }}
      />
      <WorkoutStack.Screen
        name={ScreenNames.MarketplaceScreen}
        component={MarketplaceScreen}
        options={{ headerTitle: 'Find workout' }}
      />
      <WorkoutStack.Screen
        name={ScreenNames.WorkoutDetailScreen}
        component={WorkoutDetailScreen}
        options={{ headerTitle: 'Workout' }}
      />
    </WorkoutStack.Navigator>
  );
}
