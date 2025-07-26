/**
 * ===================================================================
 * GAME CONSTANTS - 게임 전역 상수 정의 (React Native 버전)
 * ===================================================================
 */

export type PhysicsConfig = {
  GRAVITY: number;
  CONSTRAINT_ITERATIONS: number;
  POSITION_ITERATIONS: number;
  VELOCITY_ITERATIONS: number;
  WALL_THICKNESS: number;
  WALL_RESTITUTION: number;
  WALL_FRICTION: number;
  GROUND_FRICTION: number;
  DENSITY: number;
  FRICTION: number;
  FRICTION_AIR: number;
  RESTITUTION: number;
};

export type WorldConfig = {
  WALL_THICKNESS: number;
};

export type FruitPhysicsDefaults = {
  DEFAULT_RESTITUTION: number;
  DEFAULT_FRICTION: number;
  DEFAULT_FRICTION_AIR: number;
  DEFAULT_DENSITY: number;
};

export type VelocityLimits = {
  MAX_VELOCITY: number;
  MAX_ANGULAR_VELOCITY: number;
  SETTLED_VELOCITY_THRESHOLD: number;
};

export type TimingConfig = {
  DROP_DELAY: number;
  FRUIT_DROP_DELAY: number;
  GAME_OVER_CHECK_DELAY: number;
  MERGE_DELAY: number;
  SHAKE_COUNTDOWN: number;
  BOUNDARY_CHECK_INTERVAL: number;
};

export type BoundariesConfig = {
  WALL_PENETRATION_THRESHOLD: number;
  POSITION_CORRECTION_FORCE: number;
  MAX_CORRECTION_FORCE: number;
  BOTTOM_MARGIN: number;
  ENDLINE_OFFSET: number;
};

export type ColorsConfig = {
  BACKGROUND: string;
  WALL: string;
  WALL_STROKE: string;
  ENDLINE: string;
  LINE_COLORS: Record<string, string>;
  LINE_THICKNESS: Record<string, number>;
};

export type UIConfig = {
  HEADER_HEIGHT: number;
  BUTTON_HEIGHT: number;
  MODAL_ANIMATION_DURATION: number;
  TOAST_DURATION: number;
};

export type GameConstants = {
  PHYSICS: PhysicsConfig;
  WORLD: WorldConfig;
  FRUIT: FruitPhysicsDefaults;
  VELOCITY_LIMITS: VelocityLimits;
  TIMING: TimingConfig;
  BOUNDARIES: BoundariesConfig;
  FRUIT_SCORES: number[];
  SCORING: { MERGE_MULTIPLIER: number };
  FRUIT_NAMES: string[];
  COLORS: ColorsConfig;
  UI: UIConfig;
};

export const GAME_CONSTANTS: GameConstants = {
  PHYSICS: {
    GRAVITY: 0.8,
    CONSTRAINT_ITERATIONS: 2,
    POSITION_ITERATIONS: 6,
    VELOCITY_ITERATIONS: 4,
    WALL_THICKNESS: 4,
    WALL_RESTITUTION: 0.1,
    WALL_FRICTION: 0.8,
    GROUND_FRICTION: 0.8,
    DENSITY: 0.001,
    FRICTION: 0.3,
    FRICTION_AIR: 0.008,
    RESTITUTION: 0.35,
  },
  WORLD: {
    WALL_THICKNESS: 12,
  },
  FRUIT: {
    DEFAULT_RESTITUTION: 0.35,
    DEFAULT_FRICTION: 0.3,
    DEFAULT_FRICTION_AIR: 0.008,
    DEFAULT_DENSITY: 0.001,
  },
  VELOCITY_LIMITS: {
    MAX_VELOCITY: 12,
    MAX_ANGULAR_VELOCITY: 0.3,
    SETTLED_VELOCITY_THRESHOLD: 1.2,
  },
  TIMING: {
    DROP_DELAY: 1000,
    FRUIT_DROP_DELAY: 500,
    GAME_OVER_CHECK_DELAY: 500,
    MERGE_DELAY: 100,
    SHAKE_COUNTDOWN: 30,
    BOUNDARY_CHECK_INTERVAL: 8000,
  },
  BOUNDARIES: {
    WALL_PENETRATION_THRESHOLD: 15,
    POSITION_CORRECTION_FORCE: 0.0005,
    MAX_CORRECTION_FORCE: 0.01,
    BOTTOM_MARGIN: 200,
    ENDLINE_OFFSET: 20,
  },
  FRUIT_SCORES: [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66],
  SCORING: {
    MERGE_MULTIPLIER: 1,
  },
  FRUIT_NAMES: ["체리", "딸기", "포도", "귤", "오렌지", "사과", "배", "복숭아", "파인애플", "멜론", "수박"],
  COLORS: {
    BACKGROUND: "rgba(247, 244, 200, 0.8)",
    WALL: "#8B4513",
    WALL_STROKE: "#654321",
    ENDLINE: "rgba(255, 200, 100, 0.3)",
    LINE_COLORS: {
      easy: "#4CAF50",
      normal: "#FF9800",
      hard: "#F44336",
      timeattack: "#9C27B0",
    },
    LINE_THICKNESS: {
      easy: 2,
      normal: 3,
      hard: 4,
      timeattack: 3,
    },
  },
  UI: {
    HEADER_HEIGHT: 100,
    BUTTON_HEIGHT: 50,
    MODAL_ANIMATION_DURATION: 300,
    TOAST_DURATION: 2000,
  },
};

export type GameMode = {
  displayName: string;
  description: string;
  timeLimit: number | null;
  targetScore: number | null;
  difficulty: number;
};

export const GAME_MODES: Record<string, GameMode> = {
  normal: { displayName: "일반 모드", description: "기본적인 게임 플레이", timeLimit: null, targetScore: null, difficulty: 1 },
  easy: { displayName: "쉬움 모드", description: "초보자를 위한 쉬운 모드", timeLimit: null, targetScore: null, difficulty: 0.5 },
  hard: { displayName: "어려움 모드", description: "도전적인 어려운 모드", timeLimit: null, targetScore: null, difficulty: 1.5 },
  timeattack: { displayName: "시간 제한", description: "3분 안에 최고 점수를 얻어보세요", timeLimit: 180000, targetScore: null, difficulty: 1 },
  targetscore: { displayName: "목표 점수", description: "목표 점수에 도달하세요", timeLimit: null, targetScore: 10000, difficulty: 1 },
  chaos: { displayName: "카오스 모드", description: "예측 불가능한 물리 법칙", timeLimit: null, targetScore: null, difficulty: 2 },
  survival: { displayName: "서바이벌", description: "끝까지 버텨보세요", timeLimit: null, targetScore: null, difficulty: 1.8 },
};

export type DifficultySetting = {
  topMargin: number;
  timeLimit: number;
  maxFruitIndex: number;
  targetScore?: number;
  description: string;
  physics: {
    gravity: number;
    maxVelocity: number;
    frictionAir: number;
  };
};

export const DIFFICULTY_SETTINGS: Record<string, DifficultySetting> = {
  easy: { topMargin: 140, timeLimit: 0, maxFruitIndex: 4, description: "여유로운 엔드라인, 다양한 과일", physics: { gravity: 0.8, maxVelocity: 12, frictionAir: 0.01 } },
  normal: { topMargin: 0, timeLimit: 0, maxFruitIndex: 2, description: "중간 엔드라인, 제한된 과일", physics: { gravity: 1.0, maxVelocity: 10, frictionAir: 0.015 } },
  hard: { topMargin: 0, timeLimit: 0, maxFruitIndex: 1, description: "높은 엔드라인, 작은 과일만", physics: { gravity: 1.2, maxVelocity: 8, frictionAir: 0.02 } },
  timeattack_2min: { topMargin: 100, timeLimit: 120, maxFruitIndex: 4, description: "2분 안에 최고 점수 달성!", physics: { gravity: 1.0, maxVelocity: 10, frictionAir: 0.015 } },
  timeattack_3min: { topMargin: 100, timeLimit: 180, maxFruitIndex: 4, description: "3분 안에 최고 점수 달성!", physics: { gravity: 1.0, maxVelocity: 10, frictionAir: 0.015 } },
  timeattack_5min: { topMargin: 100, timeLimit: 300, maxFruitIndex: 4, description: "5분 안에 최고 점수 달성!", physics: { gravity: 1.0, maxVelocity: 10, frictionAir: 0.015 } },
  target_1000: { topMargin: 0, timeLimit: 0, maxFruitIndex: 3, targetScore: 1000, description: "1,000점을 달성하세요!", physics: { gravity: 1.0, maxVelocity: 10, frictionAir: 0.015 } },
  target_5000: { topMargin: 0, timeLimit: 0, maxFruitIndex: 2, targetScore: 5000, description: "5,000점을 달성하세요!", physics: { gravity: 1.0, maxVelocity: 10, frictionAir: 0.015 } },
  target_10000: { topMargin: 0, timeLimit: 0, maxFruitIndex: 1, targetScore: 10000, description: "10,000점을 달성하세요!", physics: { gravity: 1.0, maxVelocity: 10, frictionAir: 0.015 } },
  chaos: { topMargin: 50, timeLimit: 0, maxFruitIndex: 4, description: "예측 불가능한 물리 법칙!", physics: { gravity: 1.2, maxVelocity: 15, frictionAir: 0.005 } },
  survival: { topMargin: 0, timeLimit: 0, maxFruitIndex: 2, description: "끝없는 도전에서 살아남으세요!", physics: { gravity: 1.1, maxVelocity: 12, frictionAir: 0.01 } },
};
