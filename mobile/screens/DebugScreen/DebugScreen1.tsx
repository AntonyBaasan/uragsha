import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import * as InitDB from '../../helpers/db/initialize';
import * as DebugDB from '../../helpers/db/debug';
import {ThemeProvider, Button, Text} from 'react-native-elements';
import {DevVersion} from '../../constants/Version';

import {mainTheme} from '../../constants/theme/Main';
import {ScreenNames} from '../../constants/Screen';

type Props = {navigation: any};

function DebugScreen1(props: Props) {
  function showProps() {
    console.log(props);
  }
  function showDebugScreen2() {
    props.navigation.navigate(ScreenNames.DebugScreen2);
  }

  function initializeTables() {
    InitDB.initialize();
  }

  function dropAllTables() {
    DebugDB.dropAllTable();
  }

  function clearWorkoutAndExercise() {
    DebugDB.clearWorkoutAndExercise();
  }

  function insertTestWorkouts() {
    DebugDB.insertTestWorkouts();
  }

  return (
    <ThemeProvider theme={mainTheme}>
      <View style={styles.container}>
        <Text>Basic</Text>
        <Button
          containerStyle={styles.button}
          title="Console This Screen Props"
          onPress={showProps}
        />
        <Button
          containerStyle={styles.button}
          title="Go to 2nd screen"
          onPress={showDebugScreen2}
        />

        <Text>Database:</Text>
        <Button
          containerStyle={styles.button}
          title="Create All Tables"
          onPress={initializeTables}
        />
        <Button
          containerStyle={styles.button}
          title="Drop All Tables"
          onPress={dropAllTables}
        />
        <Button
          containerStyle={styles.button}
          title="Clear tables: Workouts, Exercises, Stats"
          onPress={clearWorkoutAndExercise}
        />
        <Button
          containerStyle={styles.button}
          title="Insert Test Workouts"
          onPress={insertTestWorkouts}
        />
        <Text>DevVersion: {DevVersion}</Text>
      </View>
    </ThemeProvider>
  );
}

export default DebugScreen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginBottom: 5,
  },
});
