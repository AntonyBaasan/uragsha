import * as React from 'react';
import {StyleSheet} from 'react-native';

import {View} from '../../components/Themed';
import {ThemeProvider, Text} from 'react-native-elements';
import {mainTheme} from '../../constants/theme/Main';

type SettingsScreenProps = {navigation: any};

function SettingsScreen(/*props: SettingsScreenProps*/) {
  return (
    <ThemeProvider theme={mainTheme}>
      <View style={styles.container}>
        <Text>Settings</Text>
      </View>
    </ThemeProvider>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
    fontSize: 25,
  },
});
