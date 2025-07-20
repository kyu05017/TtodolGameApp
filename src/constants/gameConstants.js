/**
 * ===================================================================
 * GAME CONSTANTS - 게임 전역 상수 정의 (React Native 버전)
 * ===================================================================
 */

export const GAME_CONSTANTS = {
  // ===== 물리 엔진 핵심 설정 =====
  PHYSICS: {
    GRAVITY: 0.8, // 중력 강도 (1 → 0.8로 감소, 게임 영역이 커져도 자연스러운 낙하)
    CONSTRAINT_ITERATIONS: 2, // 제약 조건 반복 계산 횟수
    POSITION_ITERATIONS: 6, // 위치 보정 반복 횟수
    VELOCITY_ITERATIONS: 4, // 속도 계산 반복 횟수
    WALL_THICKNESS: 4, // 게임 경계 벽 두께 (8 → 4로 절반 감소)
    WALL_RESTITUTION: 0.1, // 벽 반발력 (0.05 → 0.1로 증가, 자연스러운 반발)
    WALL_FRICTION: 0.8, // 벽 마찰력 (0.9 → 0.8로 감소, 자연스러운 마찰)
    GROUND_FRICTION: 0.8, // 바닥 마찰력 (0.9 → 0.8로 감소)
    DENSITY: 0.001, // 과일 밀도 (0.0008 → 0.001로 증가, 무게감 증가)
    FRICTION: 0.3, // 과일 간 마찰력 (0.6 → 0.3로 대폭 감소, 미끌미끌한 성질)
    FRICTION_AIR: 0.008, // 공기 저항 (0.012 → 0.008로 감소, 더 부드러운 움직임)
    RESTITUTION: 0.35, // 과일 반발력 (0.2 → 0.35로 증가, 젤리같은 탄성)
  },

  // ===== 게임 월드 설정 =====
  WORLD: {
    WALL_THICKNESS: 12, // 벽 두께 (4 → 12로 증가, 큰 과일도 안전하게 막기 위함)
  },

  // ===== 과일 물리 속성 기본값 =====
  FRUIT: {
    DEFAULT_RESTITUTION: 0.35, // 과일 반발력 (0.2 → 0.35로 증가, 젤리같은 탄성)
    DEFAULT_FRICTION: 0.3, // 과일 간 마찰력 (0.6 → 0.3로 감소, 미끌미끌한 성질)
    DEFAULT_FRICTION_AIR: 0.008, // 공기 저항 (0.012 → 0.008로 감소)
    DEFAULT_DENSITY: 0.001, // 과일 밀도 (0.0008 → 0.001로 증가)
  },

  // ===== 물리 시스템 속도 제한 =====
  VELOCITY_LIMITS: {
    MAX_VELOCITY: 12, // 최대 이동 속도 (8 → 12로 증가, 자연스러운 움직임)
    MAX_ANGULAR_VELOCITY: 0.3, // 최대 회전 속도 (0.2 → 0.3로 증가)
    SETTLED_VELOCITY_THRESHOLD: 1.2, // 정착 판정 임계값 (1.5 → 1.2로 감소)
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
    BACKGROUND: "rgba(247, 244, 200, 0.8)", // 게임 배경색 (반투명)
    WALL: "#8B4513", // 게임 경계 벽 색상 (자연스러운 갈색)
    WALL_STROKE: "#654321", // 벽 테두리 색상
    ENDLINE: "rgba(255, 200, 100, 0.3)", // 엔드라인 색상
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

// ===== 게임 모드 설정 =====
export const GAME_MODES = {
  normal: {
    displayName: '일반 모드',
    description: '기본적인 게임 플레이',
    timeLimit: null,
    targetScore: null,
    difficulty: 1
  },
  easy: {
    displayName: '쉬움 모드',
    description: '초보자를 위한 쉬운 모드',
    timeLimit: null,
    targetScore: null,
    difficulty: 0.5
  },
  hard: {
    displayName: '어려움 모드',
    description: '도전적인 어려운 모드',
    timeLimit: null,
    targetScore: null,
    difficulty: 1.5
  },
  timeattack: {
    displayName: '시간 제한',
    description: '3분 안에 최고 점수를 얻어보세요',
    timeLimit: 180000, // 3분
    targetScore: null,
    difficulty: 1
  },
  targetscore: {
    displayName: '목표 점수',
    description: '목표 점수에 도달하세요',
    timeLimit: null,
    targetScore: 10000,
    difficulty: 1
  },
  chaos: {
    displayName: '카오스 모드',
    description: '예측 불가능한 물리 법칙',
    timeLimit: null,
    targetScore: null,
    difficulty: 2
  },
  survival: {
    displayName: '서바이벌',
    description: '끝까지 버텨보세요',
    timeLimit: null,
    targetScore: null,
    difficulty: 1.8
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