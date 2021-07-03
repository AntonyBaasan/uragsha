import * as React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ThemeProvider, Icon, Text} from 'react-native-elements';

import {ScreenNames} from '../constants/Screen';
import {View} from '../components/Themed';
import {mainTheme} from '../constants/theme/Main';

type ChooseCreateScreenProps = {navigation: any};

function ChooseCreateScreen(props: ChooseCreateScreenProps) {
  function clickCreateWorkout() {
    props.navigation.navigate(ScreenNames.WorkoutEditorScreen, {
      workoutId: undefined,
    });
  }

  function clickDownload() {
    props.navigation.navigate(ScreenNames.MarketplaceScreen);
  }

  return (
    <ThemeProvider theme={mainTheme}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.selection, styles.left]}
          onPress={clickCreateWorkout}>
          <Icon size={45} name="create" type="evilicons" />
          <Text style={styles.text}>Create Workout</Text>
          <Text style={styles.description}>Description</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.selection} onPress={clickDownload}>
          <Icon size={45} name="cloud" type="evilicons" />
          <Text style={styles.text}>Download</Text>
          <Text style={styles.description}>Description</Text>
        </TouchableOpacity>
      </View>
    </ThemeProvider>
  );
}

export default ChooseCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  left: {
    backgroundColor: '#AFB0E150',
  },
  selection: {
    width: '50%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 25,
  },
  description: {
    textAlign: 'center',
    fontSize: 20,
  },
});
