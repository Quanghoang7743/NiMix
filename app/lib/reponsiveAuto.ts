import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Kích thước thiết kế gốc (ví dụ iPhone 11)
const baseWidth = 375;
const baseHeight = 812;

export const scale = (size: number) => (SCREEN_WIDTH / baseWidth) * size;
export const verticalScale = (size: number) => (SCREEN_HEIGHT / baseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;