import * as ImagePicker from 'expo-image-picker';
import {ImageInfo} from 'expo-image-picker/build/ImagePicker.types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';

type PicturePickerProps = {
  selected: (imageBase64: string, extension: string) => void;
};

function PicturePicker(props: PicturePickerProps) {
  const {selected} = props;

  const openImagePickerAsync = async () => {
    const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    });
    if (pickerResult.cancelled) {
      return;
    }

    readImagePickerResult(pickerResult);
  };

  const openCameraAsync = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access camera access is required!');
      return;
    }
    const pickerResult = await ImagePicker.launchCameraAsync({base64: true});
    if (pickerResult.cancelled) {
      return;
    }
    readImagePickerResult(pickerResult);
  };

  const readImagePickerResult = (
    pickerResult: ImagePicker.ImagePickerResult & ImageInfo,
  ) => {
    const base64 = pickerResult.base64;
    const ext = pickerResult.uri.split('.').pop();
    if (base64 && ext) {
      selected(base64, ext);
    }
    // delete pickerResult.base64;
    // console.log(pickerResult);
  };

  return (
    <View style={styles.container}>
      <Button
        style={styles.button}
        title="Pick an image"
        onPress={openImagePickerAsync}
      />
      <Button
        style={styles.button}
        title="Take a picture"
        onPress={openCameraAsync}
      />
    </View>
  );
}

export default PicturePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 5,
  },
});
