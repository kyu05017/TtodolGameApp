// Mock for react-native-responsive-dimensions
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window')

const heightPercentageToDP = (percentage) => {
  return (height * percentage) / 100;
};

const widthPercentageToDP = (percentage) => {
  return (width * percentage) / 100;
};

const hp = heightPercentageToDP;
const wp = widthPercentageToDP;

export {
  heightPercentageToDP,
  widthPercentageToDP,
  hp,
  wp,
};

