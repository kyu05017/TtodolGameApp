/**
 * ===================================================================
 * FRUITS DATA - 게임 과일 데이터 정의 (React Native 버전)
 * ===================================================================
 */

export type Fruit = {
  id: number;
  name: string;
  korean: string;
  radius: number;
  size: { width: number; height: number };
  score: number;
  color: string;
};

const FRUITS_BASE: Fruit[] = [
  {
    id: 0,
    name: "00_cherry",
    korean: "체리",
    radius: 33 / 2,
    size: { width: 33, height: 33 },
    score: 1,
    color: "#FF6B6B",
  },
  {
    id: 1,
    name: "01_strawberry",
    korean: "딸기",
    radius: 48 / 2,
    size: { width: 48, height: 48 },
    score: 3,
    color: "#FF8E8E",
  },
  {
    id: 2,
    name: "02_grape",
    korean: "포도",
    radius: 61 / 2,
    size: { width: 61, height: 61 },
    score: 6,
    color: "#9B59B6",
  },
  {
    id: 3,
    name: "03_gyool",
    korean: "귤",
    radius: 69 / 2,
    size: { width: 69, height: 69 },
    score: 10,
    color: "#F39C12",
  },
  {
    id: 4,
    name: "04_orange",
    korean: "오렌지",
    radius: 89 / 2,
    size: { width: 89, height: 89 },
    score: 15,
    color: "#E67E22",
  },
  {
    id: 5,
    name: "05_apple",
    korean: "사과",
    radius: 114 / 2,
    size: { width: 114, height: 114 },
    score: 21,
    color: "#E74C3C",
  },
  {
    id: 6,
    name: "06_pear",
    korean: "배",
    radius: 129 / 2,
    size: { width: 129, height: 129 },
    score: 28,
    color: "#F1C40F",
  },
  {
    id: 7,
    name: "07_peach",
    korean: "복숭아",
    radius: 156 / 2,
    size: { width: 156, height: 156 },
    score: 36,
    color: "#FFB6C1",
  },
  {
    id: 8,
    name: "08_pineapple",
    korean: "파인애플",
    radius: 177 / 2,
    size: { width: 177, height: 177 },
    score: 45,
    color: "#FFD700",
  },
  {
    id: 9,
    name: "09_melon",
    korean: "멜론",
    radius: 220 / 2,
    size: { width: 220, height: 220 },
    score: 55,
    color: "#90EE90",
  },
  {
    id: 10,
    name: "10_watermelon",
    korean: "수박",
    radius: 259 / 2,
    size: { width: 259, height: 259 },
    score: 66,
    color: "#32CD32",
  },
];

const FRUIT_NAMES: string[] = FRUITS_BASE.map((fruit) => fruit.korean);

export { FRUITS_BASE, FRUIT_NAMES };