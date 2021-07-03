import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Overlay, Text } from 'react-native-elements';
import TagEditor from './TagEditor';

type TagViewProps = {
  title: string;
  tags: string[];
  addTag: (newTag: string) => void;
  removeTag: (tag: string) => void;
};

function TagView(props: TagViewProps) {
  const { title, tags, addTag, removeTag } = props;

  useEffect(() => {});

  const [isAddTagOverlayVisible, setIsAddTagOverlayVisible] = useState(false);

  function toCamelCase(str: string) {
    return str.replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

  const onSaveTag = (newTagValue: string) => {
    addTag(newTagValue);
    closeOverlay();
  };

  const closeOverlay = () => {
    setIsAddTagOverlayVisible(false);
  };

  const toggleAddTagOverlay = () => {
    setIsAddTagOverlayVisible(!isAddTagOverlayVisible);
  };

  const renderTagEditorOverlay = () => {
    return (
      <Overlay
        isVisible={isAddTagOverlayVisible}
        onBackdropPress={toggleAddTagOverlay}
      >
        <TagEditor tag={''} save={onSaveTag} cancel={closeOverlay} />
      </Overlay>
    );
  };

  const renderTagList = () => {
    return tags.map((tag, index) => {
      return (
        <View style={styles.tagContainer} key={index}>
          <Text style={styles.tagText}>{toCamelCase(tag)}</Text>
          <Button
            buttonStyle={styles.tagCloseButton}
            titleStyle={styles.tagCloseButtonText}
            title="x"
            onPress={() => removeTag(tag)}
          />
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>{title}</Text>
      </View>
      {renderTagList()}
      <Button title="Add" onPress={toggleAddTagOverlay} />
      {renderTagEditorOverlay()}
    </View>
  );
}

export default TagView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    // backgroundColor: 'red',
  },
  tagContainer: {
    flexDirection: 'row',
    marginRight: 5,
    height: 42,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    // margin: 3,
  },
  tagText:{
    fontSize: 20,
    marginRight: 5,
  },
  tagCloseButton: {
    backgroundColor: 'grey',
    padding: 2,
    // height: 25,
    width: 25,
  },
  tagCloseButtonText: {
    // fontSize: 14,
  },
});
