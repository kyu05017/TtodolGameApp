/**
 * ===================================================================
 * IMAGE ASSETS - 이미지 리소스 관리
 * ===================================================================
 */

// 과일 이미지들 (ID로 접근)
export const FRUIT_IMAGES = {
  0: require('../assets/images/fruits/00_cherry.png'),
  1: require('../assets/images/fruits/01_strawberry.png'),
  2: require('../assets/images/fruits/02_grape.png'),
  3: require('../assets/images/fruits/03_gyool.png'),
  4: require('../assets/images/fruits/04_orange.png'),
  5: require('../assets/images/fruits/05_apple.png'),
  6: require('../assets/images/fruits/06_pear.png'),
  7: require('../assets/images/fruits/07_peach.png'),
  8: require('../assets/images/fruits/08_pineapple.png'),
  9: require('../assets/images/fruits/09_melon.png'),
  10: require('../assets/images/fruits/10_watermelon.png')
};

// 과일 이미지들 (이름으로 접근)
export const FRUIT_IMAGES_BY_NAME = {
  '00_cherry': require('../assets/images/fruits/00_cherry.png'),
  '01_strawberry': require('../assets/images/fruits/01_strawberry.png'),
  '02_grape': require('../assets/images/fruits/02_grape.png'),
  '03_gyool': require('../assets/images/fruits/03_gyool.png'),
  '04_orange': require('../assets/images/fruits/04_orange.png'),
  '05_apple': require('../assets/images/fruits/05_apple.png'),
  '06_pear': require('../assets/images/fruits/06_pear.png'),
  '07_peach': require('../assets/images/fruits/07_peach.png'),
  '08_pineapple': require('../assets/images/fruits/08_pineapple.png'),
  '09_melon': require('../assets/images/fruits/09_melon.png'),
  '10_watermelon': require('../assets/images/fruits/10_watermelon.png')
};

// 배경 이미지들
export const BACKGROUND_IMAGES = {
  main_bg: require('../assets/images/backgrounds/main_bg.png')
};

// 이미지 경로 생성 함수
export const getFruitImagePath = (fruitName) => {
  return FRUIT_IMAGES_BY_NAME[fruitName] || null;
};

export const getFruitImageById = (fruitId) => {
  return FRUIT_IMAGES[fruitId] || null;
};

export const getBackgroundImagePath = (bgName) => {
  return BACKGROUND_IMAGES[bgName] || null;
};

// 과일 이미지 URI 가져오기 함수 (SVG Image용)
export const getFruitImageUri = (fruitId) => {
  const imageSource = FRUIT_IMAGES[fruitId];
  if (!imageSource) return null;
  
  // React Native의 Image.resolveAssetSource를 사용하여 URI 가져오기
  const { Image } = require('react-native');
  const resolvedSource = Image.resolveAssetSource(imageSource);
  return resolvedSource ? resolvedSource.uri : null;
};