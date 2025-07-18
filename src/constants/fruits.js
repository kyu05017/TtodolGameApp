/**
 * ===================================================================
 * FRUITS DATA - 게임 과일 데이터 정의 (React Native 버전)
 * ===================================================================
 */

export const FRUITS_BASE = [
  // === 레벨 0: 체리 ===
  {
    id: 0,
    name: "00_cherry", // 체리 이미지 이름
    korean: "체리",
    radius: 33 / 2, // 반지름 16.5px
    size: { width: 33, height: 33 }, // 크기 정보 추가
    score: 1,
    color: "#FF6B6B"
  },
  // === 레벨 1: 딸기 ===
  {
    id: 1,
    name: "01_strawberry", // 딸기 이미지 이름
    korean: "딸기",
    radius: 48 / 2, // 반지름 24px
    size: { width: 48, height: 48 }, // 크기 정보 추가
    score: 3,
    color: "#FF8E8E"
  },
  // === 레벨 2: 포도 ===
  {
    id: 2,
    name: "02_grape", // 포도 이미지 이름
    korean: "포도",
    radius: 61 / 2, // 반지름 30.5px
    size: { width: 61, height: 61 }, // 크기 정보 추가
    score: 6,
    color: "#9B59B6"
  },
  // === 레벨 3: 귤 ===
  {
    id: 3,
    name: "03_gyool", // 귤 이미지 이름
    korean: "귤",
    radius: 69 / 2, // 반지름 34.5px
    size: { width: 69, height: 69 }, // 크기 정보 추가
    score: 10,
    color: "#F39C12"
  },
  // === 레벨 4: 오렌지 ===
  {
    id: 4,
    name: "04_orange", // 오렌지 이미지 이름
    korean: "오렌지",
    radius: 89 / 2, // 반지름 44.5px
    size: { width: 89, height: 89 }, // 크기 정보 추가
    score: 15,
    color: "#E67E22"
  },
  // === 레벨 5: 사과 ===
  {
    id: 5,
    name: "05_apple", // 사과 이미지 이름
    korean: "사과",
    radius: 114 / 2, // 반지름 57px
    size: { width: 114, height: 114 }, // 크기 정보 추가
    score: 21,
    color: "#E74C3C"
  },
  // === 레벨 6: 배 ===
  {
    id: 6,
    name: "06_pear", // 배 이미지 이름
    korean: "배",
    radius: 129 / 2, // 반지름 64.5px
    size: { width: 129, height: 129 }, // 크기 정보 추가
    score: 28,
    color: "#F1C40F"
  },
  // === 레벨 7: 복숭아 ===
  {
    id: 7,
    name: "07_peach", // 복숭아 이미지 이름
    korean: "복숭아",
    radius: 156 / 2, // 반지름 78px
    size: { width: 156, height: 156 }, // 크기 정보 추가
    score: 36,
    color: "#FFB6C1"
  },
  // === 레벨 8: 파인애플 ===
  {
    id: 8,
    name: "08_pineapple", // 파인애플 이미지 이름
    korean: "파인애플",
    radius: 177 / 2, // 반지름 88.5px
    size: { width: 177, height: 177 }, // 크기 정보 추가
    score: 45,
    color: "#FFD700"
  },
  // === 레벨 9: 멜론 ===
  {
    id: 9,
    name: "09_melon", // 멜론 이미지 이름
    korean: "멜론",
    radius: 220 / 2, // 반지름 110px
    size: { width: 220, height: 220 }, // 크기 정보 추가
    score: 55,
    color: "#90EE90"
  },
  // === 레벨 10: 수박 ===
  {
    id: 10,
    name: "10_watermelon", // 수박 이미지 이름
    korean: "수박",
    radius: 259 / 2, // 반지름 129.5px
    size: { width: 259, height: 259 }, // 크기 정보 추가
    score: 66,
    color: "#32CD32"
  }
];

export const FRUIT_NAMES = FRUITS_BASE.map(fruit => fruit.korean);