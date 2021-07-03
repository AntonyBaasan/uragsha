import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';

type TagEditorProps = {
  tag: string;
  save: (newTag: string) => void;
  cancel: () => void;
};

function TagEditor(props: TagEditorProps) {
  const { tag, save, cancel } = props;

  useEffect(() => {});

  const [tagValue, setTagValue] = useState(tag);

  const onSaveTag = () => {
    save(tagValue);
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoFocus={true}
        value={tagValue}
        onChangeText={setTagValue}
        style={styles.textInput}
      />
      <View style={styles.buttonRow}>
        <Button buttonStyle={styles.button} title="Save" onPress={onSaveTag} />
        <Button buttonStyle={styles.button} title="Cancel" onPress={cancel} />
      </View>
    </View>
  );
}

export default TagEditor;

const styles = StyleSheet.create({
  container: {
    width: 350,
    // height: 500,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    width: 150,
    height: 50,
    margin: 10,
  },
});
