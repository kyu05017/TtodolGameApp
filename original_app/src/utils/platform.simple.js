import { Platform, Dimensions } from 'react-native';

// 플랫폼 감지
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

// 화면 크기 가져오기
export const getDimensions = () => {
  return Dimensions.get('window');
};

// 플랫폼별 스타일 적용
export const platformStyle = (webStyle, nativeStyle) => {
  return isWeb ? webStyle : nativeStyle;
};