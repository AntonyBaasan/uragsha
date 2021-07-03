import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemeProvider, Text, Button} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {defaultStatView} from '../../constants/DefaultValues';
import {mainTheme} from '../../constants/theme/Main';
import * as StatUtility from '../../helpers/StatUtility';
import {StatView} from '../../models/Stat';
import {RootState} from '../../store/models';
import {loadStatBetween} from '../../store/stat/actions';

type StatsScreenProps = {navigation: any};

function StatsScreen(props: StatsScreenProps) {
  const [showDebug, setShowDebug] = React.useState<boolean>(false);
  const [statView, setStatView] = React.useState<StatView>(defaultStatView);
  const dispatch = useDispatch();
  const currentStat = useSelector((state: RootState) => state.stat.daily);
  useEffect(() => {
    // const today = StatUtility.getFormattedDate(new Date());
    // dispatch(loadStatBetween(today, today));
    dispatch(loadStatBetween());
  }, [dispatch]);
  useEffect(() => {
    const stat = StatUtility.calculateStatView(currentStat);
    setStatView(stat);
  }, [currentStat]);

  return (
    <ThemeProvider theme={mainTheme}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={[styles.row, styles.xp]}>XP: {statView.xp}</Text>
          <Text style={[styles.row, styles.workout]}>
            Workouts: {statView.workout}
          </Text>
          <Text style={[styles.row, styles.exercise]}>
            Exercises: {statView.exercise}
          </Text>
        </View>
        <Button title="show debug" onPress={() => setShowDebug(!showDebug)} />
        {showDebug && <Text>{JSON.stringify(currentStat, null, 2)}</Text>}
      </ScrollView>
    </ThemeProvider>
  );
}

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    margin: 10,
    // justifyContent: 'center',
    textAlign: 'center',
  },
  xp: {
    fontSize: 45,
  },
  workout: {
    fontSize: 35,
  },
  exercise: {
    fontSize: 25,
  },
});
