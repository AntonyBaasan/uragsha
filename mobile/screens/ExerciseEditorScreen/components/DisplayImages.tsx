import React from 'react';
import {v4 as uuidv4} from 'uuid';
import {View, StyleSheet, Image} from 'react-native';
import PicturePicker from '../../../components/picture/PicturePicker';
import {ImageModel} from '../../../models/ImageModel';
import {getBase64TypePrefix} from '../../../helpers/ImageUtility';

type DisplayImagesProps = {
  images: ImageModel[];
  updated: (imageModels: ImageModel[]) => void;
};

function DisplayImages(props: DisplayImagesProps) {
  const {images, updated} = props;

  const onPictureSelected = (base64: string, extension: string) => {
    const newImage = {
      id: uuidv4(),
      base64,
      extension,
    } as ImageModel;
    if (!images) {
      updated([newImage]);
    } else {
      images.push(newImage);
      updated(images);
    }
  };

  const renderImages = () => {
    return images.map(image => {
      return (
        <Image
          key={image.id}
          style={styles.image}
          source={{uri: getBase64TypePrefix(image.extension) + image.base64}}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagesContainer}>{renderImages()}</View>
      <PicturePicker selected={onPictureSelected} />
    </View>
  );
}

export default DisplayImages;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: 'row',
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  restSlider: {
    margin: 10,
  },
});
