import {Platform} from 'react-native';

export default function usePlatformInfo() {
  let isAndroid21 = false;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    isAndroid21 = true;
  }

  return {isAndroid21};
}
