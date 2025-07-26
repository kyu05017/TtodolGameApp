/**
 * ===================================================================
 * IMAGE ASSETS - 이미지 리소스 관리
 * ===================================================================
 */

// 이미지 import
import cherry from '../assets/images/fruits/00_cherry.png';
import strawberry from '../assets/images/fruits/01_strawberry.png';
import grape from '../assets/images/fruits/02_grape.png';
import gyool from '../assets/images/fruits/03_gyool.png';
import orange from '../assets/images/fruits/04_orange.png';
import apple from '../assets/images/fruits/05_apple.png';
import pear from '../assets/images/fruits/06_pear.png';
import peach from '../assets/images/fruits/07_peach.png';
import pineapple from '../assets/images/fruits/08_pineapple.png';
import melon from '../assets/images/fruits/09_melon.png';
import watermelon from '../assets/images/fruits/10_watermelon.png';

// 과일 이미지들 (ID로 접근)
const FRUIT_IMAGES = {
  0: cherry,
  1: strawberry,
  2: grape,
  3: gyool,
  4: orange,
  5: apple,
  6: pear,
  7: peach,
  8: pineapple,
  9: melon,
  10: watermelon
};

// 과일 이미지들 (이름으로 접근)
const FRUIT_IMAGES_BY_NAME = {
  '00_cherry': cherry,
  '01_strawberry': strawberry,
  '02_grape': grape,
  '03_gyool': gyool,
  '04_orange': orange,
  '05_apple': apple,
  '06_pear': pear,
  '07_peach': peach,
  '08_pineapple': pineapple,
  '09_melon': melon,
  '10_watermelon': watermelon
};

// 배경 이미지들
const BACKGROUND_IMAGES = {
  main_bg: null
};

// 이미지 경로 생성 함수
const getFruitImagePath = (fruitName) => {
  return FRUIT_IMAGES_BY_NAME[fruitName] || null;
};

const getFruitImageById = (fruitId) => {
  return FRUIT_IMAGES[fruitId] || null;
};

const getBackgroundImagePath = (bgName) => {
  return BACKGROUND_IMAGES[bgName] || null;
};

// 과일 이미지 URI 가져오기 함수 (SVG Image용)
const getFruitImageUri = (fruitId) => {
  const imageSource = FRUIT_IMAGES[fruitId];
  if (!imageSource) return null;
  
  // Android에서 SVG Image를 위한 URI 처리
  if (typeof imageSource === 'object' && imageSource.uri) {
    return imageSource.uri;
  }
  
  // React Native에서 require()로 로드된 이미지의 경우
  if (typeof imageSource === 'number') {
    return imageSource;
  }
  
  // 이미지 소스를 직접 반환 (Hermes 호환)
  return imageSource;
};

export {
  FRUIT_IMAGES,
  FRUIT_IMAGES_BY_NAME,
  BACKGROUND_IMAGES,
  getFruitImagePath,
  getFruitImageById,
  getBackgroundImagePath,
  getFruitImageUri
};
