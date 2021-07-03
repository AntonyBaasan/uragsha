import * as React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Text} from 'react-native-elements';

type ExerciseRepSelectorProps = {
  sets: number;
  reps: number;
  weight: number;
  valueChanged: (fieldName: string, value: number) => void;
};

function ExerciseRepSelector(props: ExerciseRepSelectorProps) {
  const {sets, reps, weight, valueChanged} = props;

  return (
    <View style={styles.container}>
      <Text>ExerciseRepSelector</Text>
      <View>
        <Text>Sets</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder="Sets"
          keyboardType="number-pad"
          value={sets.toString()}
          onChangeText={value => valueChanged('sets', +value)}
        />
        <Text>Repetition</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder="Reps"
          keyboardType="number-pad"
          value={reps?.toString()}
          onChangeText={value => valueChanged('reps', +value)}
        />
        <Text>Weight</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder="Weight"
          keyboardType="number-pad"
          value={weight?.toString()}
          onChangeText={value => valueChanged('weight', +value)}
        />
      </View>
    </View>
  );
}

export default ExerciseRepSelector;

const styles = StyleSheet.create({
  container: {},
});
