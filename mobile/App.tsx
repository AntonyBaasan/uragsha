import 'react-native-get-random-values';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as Localization from 'expo-localization';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import i18n from 'i18n-js';

import en from './constants/langulages/en';
import ru from './constants/langulages/ru';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {enableScreens} from 'react-native-screens';
import {OverflowMenuProvider} from 'react-navigation-header-buttons';
import workoutReducer from './store/workout/reducers';
import {RootState} from './store/models';
import exerciseReducer from './store/exercise/reducers';
import statReducer from './store/stat/reducers';
import * as DB from './helpers/db/initialize';

i18n.translations = {en, ru};
i18n.locale = Localization.locale;
i18n.fallbacks = true; // fallbacks to eng language

// enables package: https://github.com/software-mansion/react-native-screens
enableScreens();

DB.initialize()
  .then(data => {
    console.log('db: ', data);
  })
  .catch(err => {
    console.log('db: ', err);
  });

const rootReducer = combineReducers<RootState>({
  workout: workoutReducer,
  exercise: exerciseReducer,
  stat: statReducer,
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <OverflowMenuProvider>
          <Navigation colorScheme={colorScheme} />
        </OverflowMenuProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
