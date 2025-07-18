// Mock for react-native-responsive-dimensions
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const heightPercentageToDP = (percentage) => {
  return (height * percentage) / 100;
};

export const widthPercentageToDP = (percentage) => {
  return (width * percentage) / 100;
};

export const hp = heightPercentageToDP;
export const wp = widthPercentageToDP;

export default {
  heightPercentageToDP,
  widthPercentageToDP,
  hp,
  wp,
};