import {PermissionsAndroid, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const result = await check(PERMISSIONS.IOS.CAMERA);
    if (result === RESULTS.DENIED) {
      const newResult = await request(PERMISSIONS.IOS.CAMERA);
      return newResult === RESULTS.GRANTED;
    }
    return result === RESULTS.GRANTED;
  }
};

export const requestPhotoLibraryPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (result === RESULTS.DENIED) {
      const newResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      return newResult === RESULTS.GRANTED;
    }
    return result === RESULTS.GRANTED;
  }
};
