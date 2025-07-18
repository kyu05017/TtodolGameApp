/**
 * ===================================================================
 * GAME CONSTANTS - 게임 전역 상수 정의 (React Native 버전)
 * ===================================================================
 */

export const GAME_CONSTANTS = {
  // ===== 물리 엔진 핵심 설정 =====
  PHYSICS: {
    GRAVITY: 1, // 중력 강도
    CONSTRAINT_ITERATIONS: 2, // 제약 조건 반복 계산 횟수
    POSITION_ITERATIONS: 6, // 위치 보정 반복 횟수
    VELOCITY_ITERATIONS: 4, // 속도 계산 반복 횟수
    WALL_THICKNESS: 8, // 게임 경계 벽 두께
    WALL_RESTITUTION: 0.1, // 벽 반발력
    WALL_FRICTION: 0.8, // 벽 마찰력
    GROUND_FRICTION: 0.8, // 바닥 마찰력
    DENSITY: 0.0008, // 과일 밀도
    FRICTION: 0.6, // 과일 간 마찰력
    FRICTION_AIR: 0.015, // 공기 저항
    RESTITUTION: 0.15, // 과일 반발력
  },

  // ===== 게임 월드 설정 =====
  WORLD: {
    WALL_THICKNESS: 8, // 벽 두께
  },

  // ===== 과일 물리 속성 기본값 =====
  FRUIT: {
    DEFAULT_RESTITUTION: 0.15, // 과일 반발력
    DEFAULT_FRICTION: 0.6, // 과일 간 마찰력
    DEFAULT_FRICTION_AIR: 0.015, // 공기 저항
    DEFAULT_DENSITY: 0.0008, // 과일 밀도
  },

  // ===== 물리 시스템 속도 제한 =====
  VELOCITY_LIMITS: {
    MAX_VELOCITY: 10, // 최대 이동 속도
    MAX_ANGULAR_VELOCITY: 0.3, // 최대 회전 속도
    SETTLED_VELOCITY_THRESHOLD: 1.5, // 정착 판정 임계값
  },

  // ===== 게임 타이밍 설정 =====
  TIMING: {
    DROP_DELAY: 1000, // 과일 드롭 후 다음 과일까지 지연 시간
    FRUIT_DROP_DELAY: 500, // 과일 드롭 지연 시간
    GAME_OVER_CHECK_DELAY: 500, // 게임 오버 조건 확인 지연
    MERGE_DELAY: 100, // 과일 병합 처리 지연
    SHAKE_COUNTDOWN: 30, // 쉐이크 기능 쿨다운 시간
    BOUNDARY_CHECK_INTERVAL: 8000, // 경계 벗어남 체크 주기
  },

  // ===== 게임 영역 및 경계 설정 =====
  BOUNDARIES: {
    WALL_PENETRATION_THRESHOLD: 15, // 벽 관통 허용 임계값
    POSITION_CORRECTION_FORCE: 0.0005, // 위치 보정 힘의 강도
    MAX_CORRECTION_FORCE: 0.01, // 최대 보정 힘 제한
    BOTTOM_MARGIN: 200, // 하단 여백
    ENDLINE_OFFSET: 20, // 엔드라인 오프셋
  },

  // ===== 점수 시스템 =====
  FRUIT_SCORES: [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66],
  
  SCORING: {
    MERGE_MULTIPLIER: 1, // 합치기 점수 배수
  },

  // ===== 과일 한글 이름 =====
  FRUIT_NAMES: ['체리', '딸기', '포도', '귤', '오렌지', '사과', '배', '복숭아', '파인애플', '멜론', '수박'],

  // ===== 렌더링 및 색상 설정 =====
  COLORS: {
    BACKGROUND: "#F7F4C8", // 게임 배경색
    WALL: "#E6B143", // 게임 경계 벽 색상
    LINE_COLORS: {
      easy: "#4CAF50", // 쉬움: 녹색
      normal: "#FF9800", // 보통: 주황색
      hard: "#F44336", // 어려움: 빨간색
      timeattack: "#9C27B0" // 시간제한: 보라색
    },
    LINE_THICKNESS: {
      easy: 2,
      normal: 3,
      hard: 4,
      timeattack: 3
    }
  },

  // ===== UI 설정 =====
  UI: {
    HEADER_HEIGHT: 100,
    BUTTON_HEIGHT: 50,
    MODAL_ANIMATION_DURATION: 300,
    TOAST_DURATION: 2000
  }
};

// 난이도 설정
export const DIFFICULTY_SETTINGS = {
  easy: { 
    topMargin: 140, 
    timeLimit: 0, 
    maxFruitIndex: 4,
    description: "여유로운 엔드라인, 다양한 과일",
    physics: {
      gravity: 0.8,
      maxVelocity: 12,
      frictionAir: 0.01
    }
  },
  normal: { 
    topMargin: 0, 
    timeLimit: 0, 
    maxFruitIndex: 2,
    description: "중간 엔드라인, 제한된 과일",
    physics: {
      gravity: 1.0,
      maxVelocity: 10,
      frictionAir: 0.015
    }
  },
  hard: { 
    topMargin: 0, 
    timeLimit: 0, 
    maxFruitIndex: 1,
    description: "높은 엔드라인, 작은 과일만",
    physics: {
      gravity: 1.2,
      maxVelocity: 8,
      frictionAir: 0.02
    }
  },
  timeattack_2min: { 
    topMargin: 100, 
    timeLimit: 120, 
    maxFruitIndex: 4,
    description: "2분 안에 최고 점수 달성!",
    physics: {
      gravity: 1.0,
      maxVelocity: 10,
      frictionAir: 0.015
    }
  },
  timeattack_3min: { 
    topMargin: 100, 
    timeLimit: 180, 
    maxFruitIndex: 4,
    description: "3분 안에 최고 점수 달성!",
    physics: {
      gravity: 1.0,
      maxVelocity: 10,
      frictionAir: 0.015
    }
  },
  timeattack_5min: { 
    topMargin: 100, 
    timeLimit: 300, 
    maxFruitIndex: 4,
    description: "5분 안에 최고 점수 달성!",
    physics: {
      gravity: 1.0,
      maxVelocity: 10,
      frictionAir: 0.015
    }
  },
  target_1000: { 
    topMargin: 0, 
    timeLimit: 0, 
    maxFruitIndex: 3,
    targetScore: 1000,
    description: "1,000점을 달성하세요!",
    physics: {
      gravity: 1.0,
      maxVelocity: 10,
      frictionAir: 0.015
    }
  },
  target_5000: { 
    topMargin: 0, 
    timeLimit: 0, 
    maxFruitIndex: 2,
    targetScore: 5000,
    description: "5,000점을 달성하세요!",
    physics: {
      gravity: 1.0,
      maxVelocity: 10,
      frictionAir: 0.015
    }
  },
  target_10000: { 
    topMargin: 0, 
    timeLimit: 0, 
    maxFruitIndex: 1,
    targetScore: 10000,
    description: "10,000점을 달성하세요!",
    physics: {
      gravity: 1.0,
      maxVelocity: 10,
      frictionAir: 0.015
    }
  },
  chaos: { 
    topMargin: 50, 
    timeLimit: 0, 
    maxFruitIndex: 4,
    description: "예측 불가능한 물리 법칙!",
    physics: {
      gravity: 1.2,
      maxVelocity: 15,
      frictionAir: 0.005
    }
  },
  survival: { 
    topMargin: 0, 
    timeLimit: 0, 
    maxFruitIndex: 2,
    description: "끝없는 도전에서 살아남으세요!",
    physics: {
      gravity: 1.1,
      maxVelocity: 12,
      frictionAir: 0.01
    }
  }
};