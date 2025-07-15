import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

// 기준 디바이스 크기 (Pixel - 411 x 731)
const baseWidth = 411;
const baseHeight = 731;

// 비율 계산
export const widthScale = width / baseWidth;
export const heightScale = height / baseHeight;

// 폰트 크기 스케일링
export const scaleFontSize = (size: number) => Math.round(size * widthScale);

// 여백, 패딩 등의 spacing 스케일링
export const scaleSize = (size: number) => Math.round(size * widthScale);

// 디바이스 사이즈별 구분
export const isSmallDevice = width < 360;
export const isMediumDevice = width >= 360 && width < 400;
export const isLargeDevice = width >= 400;
