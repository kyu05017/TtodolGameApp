import Matter from 'matter-js';
import { GAME_CONSTANTS } from '../constants/gameConstants.ts';
import { FRUITS_BASE } from '../constants/fruits';

class GameEngineService {
  constructor(gameWidth = 350, gameHeight = 600) {
    this.engine = null;
    this.world = null;
    this.bodies = [];
    this.fruits = [];
    this.currentFruit = null;
    this.nextFruit = null;
    this.previewFruit = null;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.isInitialized = false;
    this.dropLine = Math.min(120, gameHeight * 0.2) // 게임 높이의 20% 또는 120px 중 작은 값
    this.pendingMerges = []; // 대기 중인 병합 이벤트
    this.currentLevel = 1; // 현재 레벨
    this.lastDropTime = 0; // 마지막 과일 드롭 시간
    
    console.log('🎯 GameEngine 생성 - 크기:', gameWidth, 'x', gameHeight)
    this.initializeEngine()
  }

  initializeEngine() {
    try {
      console.log('🔄 GameEngine 초기화 시작...')
      
      // Matter.js 모듈 가용성 확인
      if (!Matter || typeof Matter !== 'object') {
        throw new Error('Matter.js 모듈이 로드되지 않았습니다.')
      }
      
      if (!Matter.Engine || typeof Matter.Engine.create !== 'function') {
        throw new Error('Matter.Engine을 사용할 수 없습니다.')
      }
      
      console.log('📦 Matter.js 모듈 확인 완료')
      
      // Matter.js 엔진 생성 (React Native 최적화 옵션)
      this.engine = Matter.Engine.create({
        enableSleeping: true,  // 성능 최적화: 정지된 객체는 계산 제외
        positionIterations: 6, // 위치 반복 계산 (기본값)
        velocityIterations: 4  // 속도 반복 계산 (기본값)
      })
      
      this.world = this.engine.world;
      
      if (!this.engine || !this.world) {
        throw new Error('Matter.js 엔진 생성에 실패했습니다.')
      }
      
      console.log('🔧 Matter.js 엔진 생성 완료')
      
      // 물리 엔진 설정 (React Native 환경에 최적화)
      // 게임 높이에 따라 중력 스케일 조정
      const gravityScale = Math.min(1.2, this.gameHeight / 600) // 600px 기준, 최대 1.2배
      this.engine.world.gravity.y = GAME_CONSTANTS.PHYSICS.GRAVITY * gravityScale;
      this.engine.world.gravity.x = 0;
      // gravity.scale 제거 - 기본값 0.001 사용
      
      console.log('⚙️ 물리 엔진 설정 완료')
      
      // 월드 바운더리 생성
      this.createWorldBoundaries()
      
      console.log('🏗️ 월드 바운더리 생성 완료')
      
      // Matter.js 이벤트 리스너 등록 (충돌 감지)
      Matter.Events.on(this.engine, 'collisionStart', (event) => {
        this.handleCollisionStart(event)
      })
      
      this.isInitialized = true;
      console.log('✅ GameEngine 초기화 완료')
    } catch (error) {
      console.error('❌ GameEngine 초기화 실패:', error)
      console.error('상세 오류:', error.message || error)
      console.error('Matter.js 버전:', Matter?.version || 'unknown')
      this.isInitialized = false;
      
      // 폴백: 기본 상태로 설정
      this.engine = null;
      this.world = null;
    }
  }

  handleCollisionStart(event) {
    // 충돌 이벤트 처리 - 과일 병합 감지
    const pairs = event.pairs;
    for (let pair of pairs) {
      const { bodyA, bodyB } = pair;
      
      // 과일의 첫 충돌 추적
      if (bodyA.isFruit && !bodyA.hasFirstCollision) {
        bodyA.hasFirstCollision = true;
        console.log(`🎯 과일 첫 충돌! ID: ${bodyA.fruitId}, 위치: (${Math.round(bodyA.position.x)}, ${Math.round(bodyA.position.y)})`)
      }
      if (bodyB.isFruit && !bodyB.hasFirstCollision) {
        bodyB.hasFirstCollision = true;
        console.log(`🎯 과일 첫 충돌! ID: ${bodyB.fruitId}, 위치: (${Math.round(bodyB.position.x)}, ${Math.round(bodyB.position.y)})`)
      }
      
      // 두 바디가 모두 과일이고 병합 가능한 경우
      if (bodyA.isFruit && bodyB.isFruit && 
          bodyA.canMerge && bodyB.canMerge &&
          bodyA.fruitId === bodyB.fruitId &&
          bodyA.fruitId < FRUITS_BASE.length - 1) {
        
        console.log('🍎 과일 병합 감지:', bodyA.fruitId, '+', bodyB.fruitId)
        
        // 이미 대기 중인 병합에 포함되지 않은 경우에만 추가
        const alreadyPending = this.pendingMerges.some(merge => 
          merge.fruitA === bodyA || merge.fruitA === bodyB ||
          merge.fruitB === bodyA || merge.fruitB === bodyB
        )
        
        if (!alreadyPending) {
          // 두 과일의 속도를 고려한 모멘텀 보존
          const totalMass = bodyA.mass + bodyB.mass;
          const velocityX = (bodyA.velocity.x * bodyA.mass + bodyB.velocity.x * bodyB.mass) / totalMass;
          const velocityY = (bodyA.velocity.y * bodyA.mass + bodyB.velocity.y * bodyB.mass) / totalMass;
          
          this.pendingMerges.push({
            fruitA: bodyA,
            fruitB: bodyB,
            newFruitId: bodyA.fruitId + 1,
            position: {
              x: (bodyA.position.x + bodyB.position.x) / 2,
              y: (bodyA.position.y + bodyB.position.y) / 2
            },
            velocity: {
              x: velocityX * 0.5, // 병합 시 속도를 50%로 감쇠
              y: velocityY * 0.7  // y축은 덜 감쇠
            },
            timestamp: Date.now(), // 충돌 시간 기록
            requiredDelay: this.calculateMergeDelay(bodyA.fruitId) // 이 줄 추가
          })
        }
      }
    }
  }

  updateGameSize(newWidth, newHeight) {
    if (!this.isInitialized) return;
    
    console.log('📐 게임 크기 업데이트:', this.gameWidth, 'x', this.gameHeight, '->', newWidth, 'x', newHeight)
    
    // 크기가 실제로 변경된 경우에만 업데이트
    if (this.gameWidth === newWidth && this.gameHeight === newHeight) {
      return;
    }
    
    this.gameWidth = newWidth;
    this.gameHeight = newHeight;
    this.dropLine = Math.min(120, newHeight * 0.2)
    
    // 게임 크기 변경 시 중력도 재조정
    const gravityScale = Math.min(1, newHeight / 600)
    this.engine.world.gravity.y = GAME_CONSTANTS.PHYSICS.GRAVITY * gravityScale;
    
    // 기존 바운더리 제거
    if (this.bodies && this.world) {
      const bodiesToRemove = [
        this.bodies.floor,
        this.bodies.leftWall,
        this.bodies.rightWall,
        this.bodies.ceiling
      ].filter(body => body)
      
      if (bodiesToRemove.length > 0) {
        Matter.World.remove(this.world, bodiesToRemove)
      }
    }
    
    // 새로운 크기로 바운더리 재생성
    this.createWorldBoundaries()
    
    console.log('✅ 게임 크기 업데이트 완료')
  }

  createWorldBoundaries() {
    if (!Matter || !Matter.Bodies || !Matter.World) {
      throw new Error('Matter.js Bodies 또는 World 모듈을 사용할 수 없습니다.')
    }
    
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
        friction: 0.5, // 바닥도 약간 미끌미끌하게 (0.8 → 0.5)
        frictionStatic: 0.6, // 바닥 정지 마찰력 감소 (1.0 → 0.6)
        restitution: 0.2, // 바닥도 젤리같은 탄성 (0.05 → 0.2)
        render: { 
          fillStyle: '#8B4513', // 더 자연스러운 갈색 (새들백 브라운)
          strokeStyle: '#654321',
          lineWidth: 1
        }
      }
    )
    
    // 왼쪽 벽
    const leftWall = Bodies.rectangle(
      wallThickness / 2,
      this.gameHeight / 2,
      wallThickness,
      this.gameHeight,
      {
        isStatic: true,
        friction: 0.8, // 벽 마찰력 증가 (0.4 → 0.8, 과일이 벽에서 미끄러지는 것 방지)
        frictionStatic: 0.9, // 정지 마찰력 증가 (0.5 → 0.9)
        restitution: 0.1, // 벽 반발력 감소 (0.15 → 0.1, 튕김 최소화)
        render: { 
          fillStyle: '#8B4513', // 더 자연스러운 갈색 (새들백 브라운)
          strokeStyle: '#654321',
          lineWidth: 1
        }
      }
    )
    
    // 오른쪽 벽
    const rightWall = Bodies.rectangle(
      this.gameWidth - wallThickness / 2,
      this.gameHeight / 2,
      wallThickness,
      this.gameHeight,
      {
        isStatic: true,
        friction: 0.8, // 벽 마찰력 증가 (0.4 → 0.8, 과일이 벽에서 미끄러지는 것 방지)
        frictionStatic: 0.9, // 정지 마찰력 증가 (0.5 → 0.9)
        restitution: 0.1, // 벽 반발력 감소 (0.15 → 0.1, 튕김 최소화)
        render: { 
          fillStyle: '#8B4513', // 더 자연스러운 갈색 (새들백 브라운)
          strokeStyle: '#654321',
          lineWidth: 1
        }
      }
    )
    
    // 천장 (레벨별 엔드라인에 맞춤)
    const endLineY = this.getEndLineHeight()
    const ceiling = Bodies.rectangle(
      this.gameWidth / 2,
      endLineY - wallThickness / 2,
      this.gameWidth,
      wallThickness,
      {
        isStatic: true,
        isSensor: false, // 물리적 충돌이 일어나도록 변경
        friction: 0.3, // 천장도 미끌미끌하게
        frictionStatic: 0.4,
        restitution: 0.1, // 천장 반발력 최소화
        render: { 
          fillStyle: 'rgba(255, 200, 100, 0.3)', // 부드러운 주황색 (엔드라인)
          strokeStyle: '#FF6B35',
          lineWidth: 2
        }
      }
    )
    
    // 월드에 추가
    World.add(this.world, [floor, leftWall, rightWall, ceiling])
    
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
      console.error('유효하지 않은 과일 ID:', fruitId)
      return null;
    }

    // 게임 크기에 따라 물리 속성 스케일링
    const sizeScale = Math.min(1, this.gameHeight / 600)
    const densityScale = 1 / sizeScale; // 높이가 클수록 밀도 감소
    
    const fruit = Bodies.circle(x, y, fruitData.size.width / 2, {
      density: GAME_CONSTANTS.PHYSICS.DENSITY * densityScale,
      friction: GAME_CONSTANTS.PHYSICS.FRICTION,
      frictionStatic: 0.2, // 정지 마찰력도 낮춰 미끌미끌한 효과
      frictionAir: GAME_CONSTANTS.PHYSICS.FRICTION_AIR * (1 + (1 - sizeScale) * 0.3), // 높이가 클수록 공기저항 증가
      restitution: GAME_CONSTANTS.PHYSICS.RESTITUTION,
      slop: 0.05, // 젤리같은 부드러운 충돌을 위한 여유값
      render: {
        fillStyle: fruitData.color,
        strokeStyle: '#000',
        lineWidth: 2
      },
      // 초기 속도와 회전을 0으로 설정
      velocity: { x: 0, y: 0 },
      angularVelocity: 0
    })

    // 과일 메타데이터 추가
    fruit.fruitId = fruitId;
    fruit.fruitData = fruitData;
    fruit.fruitData.radius = fruitData.size.width / 2; // 반지름 정보 추가
    fruit.isFruit = true;
    fruit.canMerge = true;
    fruit.isStacked = false; // 기본적으로 쌓여있지 않은 상태
    fruit.hasFirstCollision = false; // 첫 충돌 추적용

    // 큰 과일 (사과 이상, width >= 90)에 대한 특별 처리
    if (fruitData.size.width >= 90) {
      Matter.Body.set(fruit, {
        friction: 0.7, // 큰 과일은 마찰력 증가
        frictionStatic: 0.8,
        restitution: 0.2, // 반발력 감소
        frictionAir: 0.015 // 공기 저항 증가
      })
      console.log(`🍎 큰 과일 생성: ID=${fruitId}, 크기=${fruitData.size.width}px, 특별 물리 속성 적용`)
    }

    World.add(this.world, fruit)
    this.fruits.push(fruit)
    
    // 과일 생성 직후 속도를 명시적으로 0으로 설정
    Matter.Body.setVelocity(fruit, { x: 0, y: 0 })
    Matter.Body.setAngularVelocity(fruit, 0)
    
    return fruit;
  }

  createNextFruit() {
    console.log('🍎 과일 생성 시작...')
    
    // 이전에 생성된 nextFruit가 있다면 사용, 없다면 새로 생성
    const fruitId = this.nextFruit !== null ? this.nextFruit : Math.floor(Math.random() * 5)
    
    console.log('🎲 선택된 과일 ID:', fruitId)
    
    // 미리보기 과일 생성 (화면 위쪽에 반투명으로 표시)
    const x = this.gameWidth / 2;
    const y = 50;
    
    this.previewFruit = {
      fruitId: fruitId,
      fruitData: FRUITS_BASE[fruitId],
      position: { x, y },
      isPreview: true
    };
    
    console.log('👻 미리보기 과일 생성:', this.previewFruit)
    
    // 다음 과일 미리 생성
    this.nextFruit = Math.floor(Math.random() * 5)
    
    console.log('🔮 다음 과일 ID 예약:', this.nextFruit)
    
    return this.previewFruit;
  }

  dropCurrentFruit() {
    if (this.previewFruit && this.previewFruit.isPreview) {
      console.log('🍎 과일 드롭 시작:', this.previewFruit.fruitId, '위치:', this.previewFruit.position.x)
      
      // 미리보기 과일을 실제 물리 과일로 변환
      const realFruit = this.createFruit(
        this.previewFruit.fruitId,
        this.previewFruit.position.x,
        this.dropLine
      )
      
      if (realFruit) {
        // 현재 과일로 설정
        this.currentFruit = realFruit;
        this.previewFruit = null;
        
        // 드롭 시간 기록
        this.lastDropTime = Date.now()
        
        console.log('✅ 과일 드롭 완료')
        return true;
      }
    }
    console.warn('⚠️ 과일 드롭 실패 - 미리보기 과일이 없음')
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
      )
      
      this.previewFruit.position.x = clampedX;
    }
  }


  mergeFruits(mergeEvent) {
    const { fruitA, fruitB, newFruitId, position, velocity } = mergeEvent;
    
    // 벽 근처 병합 시 위치 보정
    const fruitData = FRUITS_BASE[newFruitId];
    const newRadius = fruitData.size.width / 2;
    const wallThickness = GAME_CONSTANTS.WORLD.WALL_THICKNESS;
    
    // 벽 경계 안쪽으로 위치 조정
    const adjustedPosition = {
      x: Math.max(wallThickness + newRadius + 5, 
         Math.min(this.gameWidth - wallThickness - newRadius - 5, position.x)),
      y: Math.min(this.gameHeight - wallThickness - newRadius - 5, position.y)
    };
    
    // 기존 과일 제거
    Matter.World.remove(this.world, [fruitA, fruitB])
    this.fruits = this.fruits.filter(fruit => fruit !== fruitA && fruit !== fruitB)
    
    // 새로운 과일 생성
    const newFruit = this.createFruit(newFruitId, adjustedPosition.x, adjustedPosition.y)
    
    // 병합된 속도 적용 (있는 경우)
    if (velocity) {
      Matter.Body.setVelocity(newFruit, velocity)
    }
    
    // 점수 계산
    const score = FRUITS_BASE[newFruitId].score * GAME_CONSTANTS.SCORING.MERGE_MULTIPLIER;
    
    return {
      newFruit,
      score,
      fruitId: newFruitId,
      position: adjustedPosition
    };
  }

  applyShake(intensity = 5) {
    this.fruits.forEach(fruit => {
      if (!fruit.isStatic) {
        const randomForce = {
          x: (Math.random() - 0.5) * intensity,
          y: (Math.random() - 0.5) * intensity
        };
        Matter.Body.applyForce(fruit, fruit.position, randomForce)
      }
    })
  }

  // 레벨별 엔드라인 높이 계산
  getEndLineHeight(level = this.currentLevel) {
    const baseHeight = 120; // 기본 높이
    const reductionPerLevel = 8; // 레벨당 줄어드는 높이
    const minHeight = 60; // 최소 높이
    
    const calculatedHeight = baseHeight - ((level - 1) * reductionPerLevel)
    return Math.max(calculatedHeight, minHeight)
  }

  // 레벨 설정
  setLevel(level) {
    this.currentLevel = level;
    console.log(`🎯 게임 레벨 변경: ${level}, 엔드라인: ${this.getEndLineHeight()}px`)
    
    // 레벨 변경 시 바운더리 재생성 (천장 위치 업데이트)
    if (this.isInitialized) {
      this.createWorldBoundaries()
    }
  }

  // 과일 정착 상태 업데이트
  updateStackedStatus() {
    this.fruits.forEach(fruit => {
      // 이미 쌓여있다고 판단된 과일은 건드리지 않음
      if (fruit.isStacked) return;
      
      // 바닥 근처인지 확인
      const bottomY = this.gameHeight - GAME_CONSTANTS.WORLD.WALL_THICKNESS - fruit.fruitData.radius;
      const isNearBottom = fruit.position.y >= bottomY - 5;
      
      // 다른 과일 위에 있는지 확인
      let isOnOtherFruit = false;
      for (const otherFruit of this.fruits) {
        if (otherFruit !== fruit && otherFruit.isStacked) {
          const distance = Math.sqrt(
            Math.pow(fruit.position.x - otherFruit.position.x, 2) +
            Math.pow(fruit.position.y - otherFruit.position.y, 2)
          )
          const combinedRadius = fruit.fruitData.radius + otherFruit.fruitData.radius;
          
          if (distance <= combinedRadius + 5 && fruit.position.y < otherFruit.position.y) {
            isOnOtherFruit = true;
            break;
          }
        }
      }
      
      // 정착 조건을 더 관대하게: (바닥 근처이거나 다른 과일 위) AND (속도가 느림)
      const isSettled = (isNearBottom || isOnOtherFruit) && 
        (Math.abs(fruit.velocity.x) < 1.0 && Math.abs(fruit.velocity.y) < 1.0)
      
      if (isSettled) {
        fruit.isStacked = true;
        fruit.stackedTime = Date.now() // 정착 시간 기록
        console.log(`📦 과일 정착: ${fruit.fruitId}, 위치: ${Math.round(fruit.position.y)}px`)
      }
    })
  }

  checkGameOver() {
    // 레벨별 엔드라인에 닿은 과일이 있는지 확인 (쌓여있는 과일만)
    const endLineY = this.getEndLineHeight()
    const currentTime = Date.now()
    
    for (let fruit of this.fruits) {
      // 과일의 상단이 엔드라인을 넘어섰는지 확인
      const fruitData = FRUITS_BASE[fruit.fruitId];
      if (!fruitData) continue;
      
      const fruitRadius = fruitData.size.width / 2;
      const fruitTop = fruit.position.y - fruitRadius;
      
      // 과일이 정착되어 있고, 과일의 상단이 엔드라인보다 위에 있으면서, 
      // 정착한 지 2초 이상 지났으면 게임 오버
      if (fruit.isStacked && fruitTop <= endLineY) {
        const timeSinceStacked = currentTime - (fruit.stackedTime || 0)
        if (timeSinceStacked > 2000) { // 2초 대기
          console.log(`🚨 게임 오버! 쌓인 과일(ID: ${fruit.fruitId})이 엔드라인(${endLineY}px)을 넘어섰습니다.`)
          console.log(`과일 위치: y=${Math.round(fruit.position.y)}, 상단: ${Math.round(fruitTop)}`)
          return true;
        }
      }
    }
    return false;
  }

  update() {
    if (!this.isInitialized || !this.engine) return null;
    
    try {
      // Matter.js 엔진 업데이트 (React Native에서 안정적인 프레임률)
      const deltaTime = 1000 / 60; // 60 FPS
      Matter.Engine.update(this.engine, deltaTime)
      
      // 속도 제한 적용 (버그 수정: 과일이 미친듯이 굴러가는 현상 방지)
      this.limitVelocities()
      
      // 과일 정착 상태 업데이트
      this.updateStackedStatus()
      
      // 대기 중인 병합 이벤트 처리
      const mergeResults = [];
      const currentTime = Date.now()
      
      // 충돌 후 최소 50ms 대기 시간을 둔 병합만 처리
      const readyMerges = [];
      const pendingMerges = [];
      
      for (const mergeEvent of this.pendingMerges) {
        const requiredDelay = mergeEvent.requiredDelay || this.calculateMergeDelay(mergeEvent.fruitA.fruitId)
        
        if (currentTime - mergeEvent.timestamp > requiredDelay) {
          readyMerges.push(mergeEvent)
        } else {
          pendingMerges.push(mergeEvent)
        }
      }
      
      this.pendingMerges = pendingMerges;
      
      for (const mergeEvent of readyMerges) {
        // 병합할 과일들이 여전히 월드에 존재하는지 확인
        if (this.fruits.includes(mergeEvent.fruitA) && 
            this.fruits.includes(mergeEvent.fruitB)) {
          const result = this.mergeFruits(mergeEvent)
          mergeResults.push(result)
        }
      }
      
      // 게임 오버 체크
      const isGameOver = this.checkGameOver()
      
      return {
        mergeResults,
        isGameOver,
        fruits: this.fruits.map(fruit => ({
          id: fruit.id,
          position: fruit.position,
          angle: fruit.angle,
          fruitId: fruit.fruitId,
          fruitData: fruit.fruitData,
          isStacked: fruit.isStacked
        })),
        previewFruit: this.previewFruit
      };
    } catch (error) {
      console.error('❌ GameEngine 업데이트 오류:', error)
      return null;
    }
  }

  // 새 메서드 추가 (클래스 마지막에 추가)
  calculateMergeDelay(fruitId) {
    // 작은 과일: 빠른 병합 (100ms)
    // 큰 과일: 느린 병합 (최대 200ms)
    return Math.min(200, 100 + (fruitId * 15))
  }
  reset() {
    // 모든 과일 제거
    this.fruits.forEach(fruit => {
      Matter.World.remove(this.world, fruit)
    })
    this.fruits = [];
    this.currentFruit = null;
    this.previewFruit = null;
    this.nextFruit = null;
    this.pendingMerges = []; // 대기 중인 병합 이벤트 초기화
    
    // 새로운 과일 생성
    this.createNextFruit()
  }

  // 속도 제한 함수 (버그 수정: 과일이 미친듯이 굴러가는 현상 방지)
  limitVelocities() {
    
    this.fruits.forEach(fruit => {
      
      const MAX_VELOCITY = GAME_CONSTANTS.VELOCITY_LIMITS.MAX_VELOCITY;
      const MAX_ANGULAR_VELOCITY = GAME_CONSTANTS.VELOCITY_LIMITS.MAX_ANGULAR_VELOCITY;

      // 1. 과일 크기별 차등 속도 제한
      const fruitSize = fruit.fruitData.radius || fruit.fruitData.size.width / 2;
      const sizeMultiplier = Math.min(1.2, fruitSize / 20) // 큰 과일일수록 느리게

      // 2. 단계별 속도 감소 (급격한 변화 방지)
      const MAX_HORIZONTAL_VELOCITY = MAX_VELOCITY * (0.4 + sizeMultiplier * 0.1) // 40-50%

      // 3. 부드러운 속도 감쇠 (급격한 변화 방지)
      if (Math.abs(fruit.velocity.x) > MAX_HORIZONTAL_VELOCITY) {
        const targetVelocity = Math.sign(fruit.velocity.x) * MAX_HORIZONTAL_VELOCITY;
        const dampedVelocity = fruit.velocity.x * 0.8 + targetVelocity * 0.2; // 선형 보간
        
        Matter.Body.setVelocity(fruit, {
          x: dampedVelocity,
          y: fruit.velocity.y
        })
      }
      // 전체 속도 제한
      const speed = Math.sqrt(fruit.velocity.x * fruit.velocity.x + fruit.velocity.y * fruit.velocity.y)
      if (speed > MAX_VELOCITY) {
        const ratio = MAX_VELOCITY / speed;
        Matter.Body.setVelocity(fruit, {
          x: fruit.velocity.x * ratio,
          y: fruit.velocity.y * ratio
        })
      }
      
      // 각속도 제한 (더 엄격하게)
      const MAX_ANGULAR = MAX_ANGULAR_VELOCITY * 0.5; // 회전을 50%로 제한
      if (Math.abs(fruit.angularVelocity) > MAX_ANGULAR) {
        const limitedAngularVelocity = Math.sign(fruit.angularVelocity) * MAX_ANGULAR;
        Matter.Body.setAngularVelocity(fruit, limitedAngularVelocity)
      }
      
      // 3. 부드러운 속도 감쇠
      if (Math.abs(fruit.velocity.x) > MAX_HORIZONTAL_VELOCITY) {
        const targetVelocity = Math.sign(fruit.velocity.x) * MAX_HORIZONTAL_VELOCITY;
        const dampedVelocity = fruit.velocity.x * 0.8 + targetVelocity * 0.2; // 선형 보간
        
        Matter.Body.setVelocity(fruit, {
          x: dampedVelocity,
          y: fruit.velocity.y
        })
      }
      
      // 4. 벽 근처에서 점진적 속도 감소 (70% → 20% 감소)
      const wallThickness = GAME_CONSTANTS.WORLD.WALL_THICKNESS;
      const fruitRadius = this.previewFruit.fruitData.size.width / 2;
      const wallProximity = Math.min(
        fruit.position.x - (wallThickness + fruitRadius),
        (this.gameWidth - wallThickness - fruitRadius) - fruit.position.x
      )
      
      if (wallProximity < 30) { // 벽에서 30px 이내
        const dampingFactor = 0.8 + (wallProximity / 30) * 0.2; // 0.8~1.0
        Matter.Body.setVelocity(fruit, {
          x: fruit.velocity.x * dampingFactor,
          y: fruit.velocity.y
        })
      }
      
      // 5. 각속도 제한 (50% → 30% 제한)
      const MAX_ANGULAR_REDUCED = MAX_ANGULAR_VELOCITY * 0.3;
      if (Math.abs(fruit.angularVelocity) > MAX_ANGULAR_REDUCED) {
        const limitedAngularVelocity = Math.sign(fruit.angularVelocity) * MAX_ANGULAR_REDUCED;
        Matter.Body.setAngularVelocity(fruit, limitedAngularVelocity)
      }

      // 과일이 공중에서 멈추는 것 방지 (y 위치가 바닥에서 멀 때)
      const bottomY = this.gameHeight - wallThickness - fruitRadius;
      if (fruit.position.y < bottomY - 10 && Math.abs(fruit.velocity.y) < 0.5) {
        // 공중에 있으면서 y축 속도가 너무 느린 경우
        Matter.Body.setVelocity(fruit, {
          x: fruit.velocity.x,
          y: Math.max(fruit.velocity.y, 1.0) // 최소 낙하 속도 보장
        })
        
        // Sleep 상태 해제
        if (fruit.isSleeping) {
          Matter.Sleeping.set(fruit, false)
        }
      }
    })
  }


  start() {
    console.log('▶️ GameEngine 시작')
    if (this.engine && this.isInitialized) {
      this.engine.enabled = true;
      return true;
    }
    console.warn('⚠️ GameEngine이 초기화되지 않아 시작할 수 없습니다')
    return false;
  }

  stop() {
    console.log('⏹️ GameEngine 정지')
    if (this.engine) {
      this.engine.enabled = false;
      return true;
    }
    return false;
  }

  pause() {
    console.log('⏸️ GameEngine 일시정지')
    if (this.engine) {
      this.engine.enabled = false;
      return true;
    }
    return false;
  }

  resume() {
    console.log('▶️ GameEngine 재개')
    if (this.engine && this.isInitialized) {
      this.engine.enabled = true;
      return true;
    }
    console.warn('⚠️ GameEngine이 초기화되지 않아 재개할 수 없습니다')
    return false;
  }

  handleTouchStart(x, y) {
    console.log('👆 Touch Start:', x, y)
    // 터치 시작 로직 구현
    if (this.currentFruit) {
      this.currentFruit.position.x = Math.max(
        this.currentFruit.radius,
        Math.min(this.gameWidth - this.currentFruit.radius, x)
      )
    }
    return true;
  }

  handleTouchMove(x, y) {
    console.log('👆 Touch Move:', x, y)
    // 터치 이동 로직 구현
    if (this.currentFruit) {
      this.currentFruit.position.x = Math.max(
        this.currentFruit.radius,
        Math.min(this.gameWidth - this.currentFruit.radius, x)
      )
    }
    return true;
  }

  handleTouchEnd() {
    console.log('👆 Touch End')
    // 터치 종료 로직 구현 (과일 드롭)
    if (this.currentFruit) {
      // 과일 드롭 로직 구현
      this.dropCurrentFruit()
    }
    return true;
  }


  dispose() {
    if (this.engine) {
      Matter.Engine.clear(this.engine)
      this.engine = null;
      this.world = null;
    }
    this.isInitialized = false;
  }
}

// Convert to CommonJS
export {
  GameEngineService
};
