import * as React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Text} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';

const Item = Picker.Item as any;

type ExerciseTimeSelectorProps = {
  sets: number;
  duration: number;
  valueChanged: (fieldName: string, value: number) => void;
};

function ExerciseTimeSelector(props: ExerciseTimeSelectorProps) {
  const {sets, duration, valueChanged} = props;

  const minuteValue = Math.floor(duration / 60);
  const secondValue = duration % 60;

  const setMinuteValue = (value: number) => {
    const minuteInSecods = value * 60;
    const seconds = duration % 60;
    valueChanged('duration', minuteInSecods + seconds);
  };

  const setSecondsValue = (value: number) => {
    const minuteInSecods = duration * 60;
    valueChanged('duration', minuteInSecods + value);
  };

  const renderPickerItem = (len: number, keyPrefix: string) =>
    Array.from({length: len}, (v, i) => i).map(num => (
      <Item key={keyPrefix + num} label={keyPrefix + num} value={num} />
    ));

  return (
    <View style={styles.container}>
      <Text>Sets</Text>
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        placeholder="Sets"
        keyboardType="number-pad"
        value={sets.toString()}
        onChangeText={value => valueChanged('sets', +value)}
      />

      <Text>Min</Text>
      <Picker
        testID="min-picker"
        selectedValue={minuteValue}
        onValueChange={(v: any) => setMinuteValue(v)}>
        {renderPickerItem(60, 'min')}
      </Picker>
      <Text>Sec</Text>
      <Picker
        testID="sec-picker"
        selectedValue={secondValue}
        onValueChange={(v: any) => setSecondsValue(v)}>
        {renderPickerItem(60, 'sec')}
      </Picker>
    </View>
  );
}

export default ExerciseTimeSelector;

const styles = StyleSheet.create({
  container: {},
});
