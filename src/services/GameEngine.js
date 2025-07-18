import Matter from 'matter-js';
import { GAME_CONSTANTS } from '../constants/gameConstants';
import { FRUITS_BASE } from '../constants/fruits';

export class GameEngineService {
  constructor() {
    this.engine = null;
    this.world = null;
    this.bodies = [];
    this.fruits = [];
    this.currentFruit = null;
    this.nextFruit = null;
    this.previewFruit = null;
    this.gameWidth = 350;
    this.gameHeight = 600;
    this.isInitialized = false;
    this.dropLine = 120; // 과일 드롭 라인
    
    this.initializeEngine();
  }

  initializeEngine() {
    try {
      console.log('🔄 GameEngine 초기화 시작...');
      
      // Matter.js 엔진 생성
      this.engine = Matter.Engine.create();
      this.world = this.engine.world;
      
      console.log('🔧 Matter.js 엔진 생성 완료');
      
      // 물리 엔진 설정
      this.engine.world.gravity.y = GAME_CONSTANTS.PHYSICS.GRAVITY;
      this.engine.world.gravity.x = 0;
      
      console.log('⚙️ 물리 엔진 설정 완료');
      
      // 월드 바운더리 생성
      this.createWorldBoundaries();
      
      console.log('🏗️ 월드 바운더리 생성 완료');
      
      this.isInitialized = true;
      console.log('✅ GameEngine 초기화 완료');
    } catch (error) {
      console.error('❌ GameEngine 초기화 실패:', error);
      this.isInitialized = false;
    }
  }

  createWorldBoundaries() {
    const { Bodies, World } = Matter;
    const wallThickness = GAME_CONSTANTS.WORLD.WALL_THICKNESS;
    
    // 바닥
    const floor = Bodies.rectangle(
      this.gameWidth / 2,
      this.gameHeight - wallThickness / 2,
      this.gameWidth,
      wallThickness,
      {
        isStatic: true,
        friction: GAME_CONSTANTS.PHYSICS.FRICTION,
        render: { fillStyle: '#8B5A3C' }
      }
    );
    
    // 왼쪽 벽
    const leftWall = Bodies.rectangle(
      wallThickness / 2,
      this.gameHeight / 2,
      wallThickness,
      this.gameHeight,
      {
        isStatic: true,
        friction: GAME_CONSTANTS.PHYSICS.FRICTION,
        render: { fillStyle: '#8B5A3C' }
      }
    );
    
    // 오른쪽 벽
    const rightWall = Bodies.rectangle(
      this.gameWidth - wallThickness / 2,
      this.gameHeight / 2,
      wallThickness,
      this.gameHeight,
      {
        isStatic: true,
        friction: GAME_CONSTANTS.PHYSICS.FRICTION,
        render: { fillStyle: '#8B5A3C' }
      }
    );
    
    // 천장 (게임 오버 라인)
    const ceiling = Bodies.rectangle(
      this.gameWidth / 2,
      -wallThickness / 2,
      this.gameWidth,
      wallThickness,
      {
        isStatic: true,
        isSensor: true,
        render: { fillStyle: 'transparent' }
      }
    );
    
    // 월드에 추가
    World.add(this.world, [floor, leftWall, rightWall, ceiling]);
    
    this.bodies = {
      floor,
      leftWall,
      rightWall,
      ceiling
    };
  }

  createFruit(fruitId, x, y) {
    const { Bodies, World } = Matter;
    const fruitData = FRUITS_BASE[fruitId];
    
    if (!fruitData) {
      console.error('유효하지 않은 과일 ID:', fruitId);
      return null;
    }

    const fruit = Bodies.circle(x, y, fruitData.size.width / 2, {
      density: GAME_CONSTANTS.PHYSICS.DENSITY,
      friction: GAME_CONSTANTS.PHYSICS.FRICTION,
      frictionAir: GAME_CONSTANTS.PHYSICS.FRICTION_AIR,
      restitution: GAME_CONSTANTS.PHYSICS.RESTITUTION,
      render: {
        fillStyle: fruitData.color,
        strokeStyle: '#000',
        lineWidth: 2
      }
    });

    // 과일 메타데이터 추가
    fruit.fruitId = fruitId;
    fruit.fruitData = fruitData;
    fruit.isFruit = true;
    fruit.canMerge = true;

    World.add(this.world, fruit);
    this.fruits.push(fruit);
    
    return fruit;
  }

  createNextFruit() {
    console.log('🍎 과일 생성 시작...');
    
    // 이전에 생성된 nextFruit가 있다면 사용, 없다면 새로 생성
    const fruitId = this.nextFruit !== null ? this.nextFruit : Math.floor(Math.random() * 5);
    
    console.log('🎲 선택된 과일 ID:', fruitId);
    
    // 미리보기 과일 생성 (화면 위쪽에 반투명으로 표시)
    const x = this.gameWidth / 2;
    const y = 50;
    
    this.previewFruit = {
      fruitId: fruitId,
      fruitData: FRUITS_BASE[fruitId],
      position: { x, y },
      isPreview: true
    };
    
    console.log('👻 미리보기 과일 생성:', this.previewFruit);
    
    // 다음 과일 미리 생성
    this.nextFruit = Math.floor(Math.random() * 5);
    
    console.log('🔮 다음 과일 ID 예약:', this.nextFruit);
    
    return this.previewFruit;
  }

  dropCurrentFruit() {
    if (this.previewFruit && this.previewFruit.isPreview) {
      // 미리보기 과일을 실제 물리 과일로 변환
      const realFruit = this.createFruit(
        this.previewFruit.fruitId,
        this.previewFruit.position.x,
        this.dropLine
      );
      
      // 현재 과일로 설정
      this.currentFruit = realFruit;
      this.previewFruit = null;
      
      return true;
    }
    return false;
  }

  moveCurrentFruit(x) {
    if (this.previewFruit && this.previewFruit.isPreview) {
      // 미리보기 과일 이동 (벽 경계 체크)
      const fruitRadius = this.previewFruit.fruitData.size.width / 2;
      const clampedX = Math.max(
        GAME_CONSTANTS.WORLD.WALL_THICKNESS + fruitRadius,
        Math.min(
          this.gameWidth - GAME_CONSTANTS.WORLD.WALL_THICKNESS - fruitRadius,
          x
        )
      );
      
      this.previewFruit.position.x = clampedX;
    }
  }

  checkCollisions() {
    const pairs = Matter.Pairs.from(this.engine.pairs.list);
    const mergeEvents = [];
    
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;
      
      // 두 바디가 모두 과일이고 병합 가능한 경우
      if (bodyA.isFruit && bodyB.isFruit && 
          bodyA.canMerge && bodyB.canMerge &&
          bodyA.fruitId === bodyB.fruitId &&
          bodyA.fruitId < FRUITS_BASE.length - 1) {
        
        mergeEvents.push({
          fruitA: bodyA,
          fruitB: bodyB,
          newFruitId: bodyA.fruitId + 1,
          position: {
            x: (bodyA.position.x + bodyB.position.x) / 2,
            y: (bodyA.position.y + bodyB.position.y) / 2
          }
        });
      }
    }
    
    return mergeEvents;
  }

  mergeFruits(mergeEvent) {
    const { fruitA, fruitB, newFruitId, position } = mergeEvent;
    
    // 기존 과일 제거
    Matter.World.remove(this.world, [fruitA, fruitB]);
    this.fruits = this.fruits.filter(fruit => fruit !== fruitA && fruit !== fruitB);
    
    // 새로운 과일 생성
    const newFruit = this.createFruit(newFruitId, position.x, position.y);
    
    // 점수 계산
    const score = FRUITS_BASE[newFruitId].score * GAME_CONSTANTS.SCORING.MERGE_MULTIPLIER;
    
    return {
      newFruit,
      score,
      fruitId: newFruitId,
      position: position
    };
  }

  applyShake(intensity = 5) {
    this.fruits.forEach(fruit => {
      if (!fruit.isStatic) {
        const randomForce = {
          x: (Math.random() - 0.5) * intensity,
          y: (Math.random() - 0.5) * intensity
        };
        Matter.Body.applyForce(fruit, fruit.position, randomForce);
      }
    });
  }

  checkGameOver() {
    // 천장에 닿은 과일이 있는지 확인
    for (let fruit of this.fruits) {
      if (fruit.position.y < 100 && !fruit.isStatic) {
        return true;
      }
    }
    return false;
  }

  update() {
    if (!this.isInitialized) return;
    
    Matter.Engine.update(this.engine, 1000 / 60);
    
    // 충돌 검사 및 병합
    const mergeEvents = this.checkCollisions();
    const mergeResults = [];
    
    for (let mergeEvent of mergeEvents) {
      const result = this.mergeFruits(mergeEvent);
      mergeResults.push(result);
    }
    
    // 게임 오버 체크
    const isGameOver = this.checkGameOver();
    
    return {
      mergeResults,
      isGameOver,
      fruits: this.fruits.map(fruit => ({
        id: fruit.id,
        position: fruit.position,
        angle: fruit.angle,
        fruitId: fruit.fruitId,
        fruitData: fruit.fruitData
      })),
      previewFruit: this.previewFruit
    };
  }

  reset() {
    // 모든 과일 제거
    this.fruits.forEach(fruit => {
      Matter.World.remove(this.world, fruit);
    });
    this.fruits = [];
    this.currentFruit = null;
    this.previewFruit = null;
    this.nextFruit = null;
    
    // 새로운 과일 생성
    this.createNextFruit();
  }

  dispose() {
    if (this.engine) {
      Matter.Engine.clear(this.engine);
      this.engine = null;
      this.world = null;
    }
    this.isInitialized = false;
  }
}