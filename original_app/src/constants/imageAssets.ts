/**
 * ===================================================================
 * IMAGE ASSETS - 이미지 리소스 관리 (TypeScript 버전)
 * ===================================================================
 */

// 이미지 import
import cherry from "../assets/images/fruits/00_cherry.png";
import strawberry from "../assets/images/fruits/01_strawberry.png";
import grape from "../assets/images/fruits/02_grape.png";
import gyool from "../assets/images/fruits/03_gyool.png";
import orange from "../assets/images/fruits/04_orange.png";
import apple from "../assets/images/fruits/05_apple.png";
import pear from "../assets/images/fruits/06_pear.png";
import peach from "../assets/images/fruits/07_peach.png";
import pineapple from "../assets/images/fruits/08_pineapple.png";
import melon from "../assets/images/fruits/09_melon.png";
import watermelon from "../assets/images/fruits/10_watermelon.png";

// 과일 ID 타입
type FruitId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// 과일 이름 타입
type FruitName =
  | "00_cherry"
  | "01_strawberry"
  | "02_grape"
  | "03_gyool"
  | "04_orange"
  | "05_apple"
  | "06_pear"
  | "07_peach"
  | "08_pineapple"
  | "09_melon"
  | "10_watermelon";

// 배경 이미지 키 타입
type BackgroundName = "main_bg";

// 과일 이미지들 (ID로 접근)
const FRUIT_IMAGES: Record<FruitId, any> = {
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
  10: watermelon,
};

// 과일 이미지들 (이름으로 접근)
const FRUIT_IMAGES_BY_NAME: Record<FruitName, any> = {
  "00_cherry": cherry,
  "01_strawberry": strawberry,
  "02_grape": grape,
  "03_gyool": gyool,
  "04_orange": orange,
  "05_apple": apple,
  "06_pear": pear,
  "07_peach": peach,
  "08_pineapple": pineapple,
  "09_melon": melon,
  "10_watermelon": watermelon,
};

// 배경 이미지들
const BACKGROUND_IMAGES: Record<BackgroundName, any> = {
  main_bg: null,
};

// 이미지 경로 생성 함수
const getFruitImagePath = (fruitName: FruitName): any | null => {
  return FRUIT_IMAGES_BY_NAME[fruitName] || null;
};

const getFruitImageById = (fruitId: FruitId): any | null => {
  return FRUIT_IMAGES[fruitId] || null;
};

const getBackgroundImagePath = (bgName: BackgroundName): any | null => {
  return BACKGROUND_IMAGES[bgName] || null;
};

// 과일 이미지 URI 가져오기 함수 (SVG Image용)
const getFruitImageUri = (fruitId: FruitId): any | null => {
  const imageSource = FRUIT_IMAGES[fruitId];
  if (!imageSource) return null;

  // Android에서 SVG Image를 위한 URI 처리
  if (typeof imageSource === "object" && "uri" in imageSource) {
    return (imageSource as { uri: string }).uri;
  }

  // React Native에서 require()로 로드된 이미지의 경우
  if (typeof imageSource === "number") {
    return imageSource;
  }

  // Hermes 호환
  return imageSource;
};

export {
  FRUIT_IMAGES,
  FRUIT_IMAGES_BY_NAME,
  BACKGROUND_IMAGES,
  getFruitImagePath,
  getFruitImageById,
  getBackgroundImagePath,
  getFruitImageUri,
};
