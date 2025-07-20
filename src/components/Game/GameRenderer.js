import React, { useRef, useEffect, useState } from 'react';
import { View, PanResponder, Dimensions, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Line, Image } from 'react-native-svg';
import { GameEngineService } from '../../services/GameEngine';
import { FRUITS_BASE } from '../../constants/fruits';
import { GAME_CONSTANTS } from '../../constants/gameConstants';
import { getFruitImageUri } from '../../constants/imageAssets';
import ScoreAnimation from './ScoreAnimation';
import MergeEffect from './MergeEffect';

const GameRenderer = ({ 
  onScoreUpdate, 
  onGameOver, 
  onFruitMerge,
  isPaused,
  shakeIntensity = 0
}) => {
  const gameEngineRef = useRef(null);
  const animationRef = useRef(null);
  const [gameState, setGameState] = useState({
    fruits: [],
    currentFruit: null,
    previewFruit: null,
    isGameOver: false
  });
  
  const [effects, setEffects] = useState([]);
  const [scoreAnimations, setScoreAnimations] = useState([]);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isDragging, setIsDragging] = useState(false);
  
  // 반응형 게임 크기 계산
  const calculateGameSize = () => {
    const { width: screenWidth, height: screenHeight } = dimensions;
    const headerHeight = 65; // 70 → 65로 줄임 (헤더 패딩 감소)
    const gameTopMargin = 12; // 게임 영역 상단 마진 감소 (20 → 12)
    const fruitCollectionHeight = 66; // 80 → 66으로 줄임 (패딩 감소)
    const bannerHeight = 60; // 배너 광고 + 여백
    const totalReservedHeight = headerHeight + gameTopMargin + fruitCollectionHeight + bannerHeight;
    const availableHeight = screenHeight - totalReservedHeight;
    
    // 모바일에서는 화면 전체 너비 사용하되 안전 여백 확보
    const safeMargin = 16; // 좌우 안전 여백 최소화 (32 → 16)
    const maxWidth = screenWidth - safeMargin;
    const gameWidth = Math.min(maxWidth, screenWidth);
    
    // 세로 공간을 최대한 활용하되 적절한 비율 유지
    const maxHeightByWidth = gameWidth * 1.8; // 비율을 1.5 → 1.8로 증가
    const gameHeight = Math.min(availableHeight, maxHeightByWidth);
    
    return {
      width: Math.max(gameWidth, 300), // 최소 크기 보장
      height: Math.max(gameHeight, 450) // 최소 높이 증가 (400 → 450)
    };
  };
  
  const { width: gameWidth, height: gameHeight } = calculateGameSize();
  
  // 이펙트 제거 함수
  const removeEffect = (effectId) => {
    setEffects(prev => prev.filter(effect => effect.id !== effectId));
  };
  
  // 점수 애니메이션 제거 함수
  const removeScoreAnimation = (animationId) => {
    setScoreAnimations(prev => prev.filter(animation => animation.id !== animationId));
  };
  
  // 화면 크기 변경 감지
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription?.remove();
  }, []);

  // 게임 엔진 초기화 및 크기 업데이트
  useEffect(() => {
    if (!gameEngineRef.current) {
      try {
        // GameEngineService는 생성자에서 width, height를 직접 받습니다
        gameEngineRef.current = new GameEngineService(gameWidth, gameHeight);
        
        // GameEngine 초기화 상태 확인
        if (!gameEngineRef.current.isInitialized) {
          console.error('❌ GameEngine 초기화 실패');
          setGameState(prev => ({ ...prev, isGameOver: true }));
          return;
        }
        
        // 첫 번째 과일 생성
        gameEngineRef.current.createNextFruit();
        
        // 초기 상태 설정
        setGameState(prev => ({
          ...prev,
          previewFruit: gameEngineRef.current.previewFruit
        }));
        
        startGameLoop();
        console.log('✅ GameRenderer 초기화 완료');
      } catch (error) {
        console.error('❌ GameRenderer 초기화 중 오류 발생:', error);
        setGameState(prev => ({ ...prev, isGameOver: true }));
        if (onGameOver) onGameOver();
      }
    } else {
      // 게임 엔진의 크기 업데이트
      if (gameEngineRef.current.updateGameSize) {
        gameEngineRef.current.updateGameSize(gameWidth, gameHeight);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (gameEngineRef.current) {
        gameEngineRef.current.dispose();
      }
    };
  }, [gameWidth, gameHeight]);
  
  // 게임 일시정지 상태 변경 처리
  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      startGameLoop();
    }
  }, [isPaused]);
  
  // 게임 루프
  const startGameLoop = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const gameLoop = () => {
      if (!isPaused && gameEngineRef.current && gameEngineRef.current.isInitialized) {
        const updateResult = gameEngineRef.current.update();
        
        if (updateResult) {
          // 병합 이벤트 처리
          if (updateResult.mergeResults.length > 0) {
            let totalScore = 0;
            updateResult.mergeResults.forEach(result => {
              totalScore += result.score;
              onFruitMerge(result.fruitId);
              
              // 합치기 이펙트 추가 (병합된 원래 과일 색상 사용)
              const mergedFruitId = result.fruitId; // 새로 생성된 과일 ID
              const originalFruitId = mergedFruitId - 1; // 병합된 원래 과일 ID
              const fruitColor = FRUITS_BASE[originalFruitId]?.color; // 원래 과일 색상
              
              const newEffect = {
                id: Date.now() + Math.random(),
                position: result.position || { x: gameWidth / 2, y: gameHeight / 2 },
                size: FRUITS_BASE[mergedFruitId].size.width,
                color: fruitColor, // 색상 추가 (undefined일 경우 기본값 사용)
              };
              
              setEffects(prev => [...prev, newEffect]);
              
              // 점수 애니메이션 추가
              const newScoreAnimation = {
                id: Date.now() + Math.random() + 1,
                score: result.score,
                position: result.position || { x: gameWidth / 2, y: gameHeight / 2 },
              };
              
              setScoreAnimations(prev => [...prev, newScoreAnimation]);
            });
            onScoreUpdate(totalScore);
          }
          
          // 게임 오버 체크
          if (updateResult.isGameOver && !gameState.isGameOver) {
            setGameState(prev => ({ ...prev, isGameOver: true }));
            onGameOver();
            return;
          }
          
          // 상태 업데이트
          setGameState(prev => ({
            ...prev,
            fruits: updateResult.fruits,
            currentFruit: gameEngineRef.current.currentFruit,
            previewFruit: gameEngineRef.current.previewFruit
          }));
        }
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
  };
  
  // 쉐이크 효과
  useEffect(() => {
    if (shakeIntensity > 0 && gameEngineRef.current) {
      gameEngineRef.current.applyShake(shakeIntensity);
    }
  }, [shakeIntensity]);
  
  // 터치 이벤트 처리 - 드래그 방식으로 변경
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onStartShouldSetPanResponder: () => true,
    
    onPanResponderGrant: (evt) => {
      // 미리보기 과일이 없으면 터치 무시
      if (!gameEngineRef.current || !gameEngineRef.current.previewFruit) {
        return;
      }
      
      setIsDragging(true);
      
      // 터치 시작 시 미리보기 과일 x축 위치만 이동 (y축은 고정)
      const touchX = evt.nativeEvent.locationX;
      gameEngineRef.current.moveCurrentFruit(touchX);
      
      // 상태 업데이트
      setGameState(prev => ({
        ...prev,
        previewFruit: gameEngineRef.current.previewFruit
      }));
    },
    
    onPanResponderMove: (evt) => {
      // 드래그 중이고 미리보기 과일이 있을 때만 이동
      if (!isDragging || !gameEngineRef.current || !gameEngineRef.current.previewFruit) {
        return;
      }
      
      // 터치 이동 시 미리보기 과일 x축 위치만 이동 (y축은 고정)
      const touchX = evt.nativeEvent.locationX;
      gameEngineRef.current.moveCurrentFruit(touchX);
      
      // 상태 업데이트
      setGameState(prev => ({
        ...prev,
        previewFruit: gameEngineRef.current.previewFruit
      }));
    },
    
    onPanResponderRelease: (evt) => {
      if (!isDragging) return;
      
      setIsDragging(false);
      
      // 미리보기 과일이 없으면 드롭 무시
      if (!gameEngineRef.current || !gameEngineRef.current.previewFruit) {
        return;
      }
      
      // 터치 종료 시 과일 드롭
      const touchX = evt.nativeEvent.locationX;
      gameEngineRef.current.moveCurrentFruit(touchX);
      
      const dropped = gameEngineRef.current.dropCurrentFruit();
      if (dropped) {
        console.log('🎮 과일 드롭 성공, 새로운 과일 생성 중...');
        // 새로운 미리보기 과일 즉시 생성
        gameEngineRef.current.createNextFruit();
        setGameState(prev => ({
          ...prev,
          previewFruit: gameEngineRef.current.previewFruit
        }));
      } else {
        console.error('❌ 과일 드롭 실패');
      }
    }
  });
  
  // 과일 렌더링
  const renderFruit = (fruit) => {
    const fruitData = FRUITS_BASE[fruit.fruitId];
    if (!fruitData) return null;
    
    const radius = fruitData.size.width / 2;
    const rotation = fruit.angle * (180 / Math.PI);
    const imageUri = getFruitImageUri(fruit.fruitId);
    
    return (
      <React.Fragment key={fruit.id}>
        {/* 배경 원 */}
        {/* <Circle
          cx={fruit.position.x}
          cy={fruit.position.y}
          r={radius}
          fill={fruitData.color}
          stroke="#000"
          strokeWidth="1"
          opacity="0.3"
          transform={`rotate(${rotation} ${fruit.position.x} ${fruit.position.y})`}
        /> */}
        
        {/* 과일 이미지 */}
        {imageUri && (
          <Image
            x={fruit.position.x - radius}
            y={fruit.position.y - radius}
            width={radius * 2}
            height={radius * 2}
            href={imageUri}
            preserveAspectRatio="xMidYMid meet"
            transform={`rotate(${rotation} ${fruit.position.x} ${fruit.position.y})`}
          />
        )}
      </React.Fragment>
    );
  };
  
  // 미리보기 과일 렌더링 (반투명)
  const renderPreviewFruit = () => {
    // 항상 테스트용 과일 표시
    if (!gameState.previewFruit) {
      // 기본 체리 과일 표시
      const defaultFruit = {
        fruitId: 0,
        fruitData: FRUITS_BASE[0],
        position: { x: gameWidth / 2, y: 50 }
      };
      
      const radius = defaultFruit.fruitData.size.width / 2;
      
      return (
        <React.Fragment>
          {/* <Circle
            cx={defaultFruit.position.x}
            cy={defaultFruit.position.y}
            r={radius}
            fill={defaultFruit.fruitData.color}
            opacity="0.5"
          /> */}
        </React.Fragment>
      );
    }
    
    const fruit = gameState.previewFruit;
    const fruitData = fruit.fruitData;
    if (!fruitData) return null;
    
    const radius = fruitData.size.width / 2;
    const imageUri = getFruitImageUri(fruit.fruitId);
    
    return (
      <React.Fragment>
        {/* 과일 이미지만 표시 - 가이드라인 제거 */}
        {imageUri && (
          <Image
            x={fruit.position.x - radius}
            y={fruit.position.y - radius}
            width={radius * 2}
            height={radius * 2}
            href={imageUri}
            preserveAspectRatio="xMidYMid meet"
            opacity="0.9"
          />
        )}
      </React.Fragment>
    );
  };

  // 드롭 라인 렌더링 (떨어질 위치 예측)
  const renderDropLine = () => {
    if (!isDragging || !gameState.previewFruit) return null;
    
    const previewX = gameState.previewFruit.position.x;
    const previewRadius = gameState.previewFruit.fruitData.size.width / 2;
    
    // 해당 X 위치에서 가장 높은 과일의 Y 좌표 찾기
    let highestY = gameHeight - GAME_CONSTANTS.WORLD.WALL_THICKNESS; // 바닥
    let isLandingOnFruit = false; // 과일 위에 떨어지는지 여부
    
    gameState.fruits.forEach(fruit => {
      const fruitData = FRUITS_BASE[fruit.fruitId];
      if (!fruitData) return;
      
      const fruitRadius = fruitData.size.width / 2;
      const fruitX = fruit.position.x;
      const fruitY = fruit.position.y;
      
      // X 좌표가 겹치는 범위인지 확인 (과일 반지름 고려)
      const distance = Math.abs(previewX - fruitX);
      const combinedRadius = previewRadius + fruitRadius;
      
      if (distance < combinedRadius) {
        // 겹치는 과일이 있다면, 그 과일 위쪽으로 라인 위치 조정
        const potentialY = fruitY - fruitRadius - previewRadius;
        if (potentialY < highestY) {
          highestY = potentialY;
          isLandingOnFruit = true; // 과일 위에 떨어짐
        }
      }
    });
    
    // 최소 드롭 위치 제한 (엔드라인 아래)
    const endLineY = gameEngineRef.current ? 
      gameEngineRef.current.getEndLineHeight(gameState.level || 1) : 120;
    const minDropY = endLineY + 10;
    
    if (highestY < minDropY) {
      highestY = minDropY;
      isLandingOnFruit = false; // 엔드라인 제한으로 인해 바닥으로 간주
    }
    
    // 바닥에 떨어지는지 확인 (과일이 없고 바닥에 닿는 경우)
    const isLandingOnFloor = !isLandingOnFruit && (highestY >= gameHeight - GAME_CONSTANTS.WORLD.WALL_THICKNESS);
    
    return (
      <React.Fragment>
        {/* 드롭 라인 그라데이션 및 이펙트 정의 */}
        <defs>
          <linearGradient id="dropLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>
          
          <linearGradient id="dropPathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.3" />
          </linearGradient>
          
          <filter id="dropGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* 떨어지는 경로 배경 영역 (부드러운 그라데이션) */}
        <Rect
          x={previewX - 1}
          y={gameState.previewFruit.position.y + previewRadius}
          width="2"
          height={Math.max(0, highestY - gameState.previewFruit.position.y - previewRadius - 5)}
          fill="url(#dropPathGradient)"
          opacity="0.4"
          rx="1"
        />
        
        {/* 메인 떨어지는 경로 라인 */}
        <Line
          x1={previewX}
          y1={gameState.previewFruit.position.y + previewRadius}
          x2={previewX}
          y2={highestY - 5}
          stroke="url(#dropPathGradient)"
          strokeWidth="2"
          strokeDasharray="6,3"
          opacity="0.8"
          filter="url(#dropGlow)"
        />
        
        {/* 바닥에 떨어질 때만 가로 라인 표시 */}
        {(isLandingOnFloor || !isLandingOnFruit) && (
          <React.Fragment>
            {/* 드롭 위치 배경 (글로우 효과) */}
            <Rect
              x={previewX - previewRadius * 1.2}
              y={highestY - 3}
              width={previewRadius * 2.4}
              height="6"
              fill="url(#dropLineGradient)"
              opacity="0.4"
              rx="3"
            />
            
            {/* 메인 드롭 위치 라인 */}
            <Line
              x1={previewX - previewRadius * 1.0}
              y1={highestY}
              x2={previewX + previewRadius * 1.0}
              y2={highestY}
              stroke="#8b5cf6"
              strokeWidth="4"
              strokeDasharray="10,5"
              opacity="0.9"
              filter="url(#dropGlow)"
            />
            
            {/* 드롭 위치 하이라이트 라인 */}
            <Line
              x1={previewX - previewRadius * 0.6}
              y1={highestY}
              x2={previewX + previewRadius * 0.6}
              y2={highestY}
              stroke="#c084fc"
              strokeWidth="2"
              opacity="0.7"
            />
            
            {/* 양쪽 끝 포인트 */}
            <circle
              cx={previewX - previewRadius * 1.0}
              cy={highestY}
              r="2"
              fill="#8b5cf6"
              opacity="0.6"
            />
            <circle
              cx={previewX + previewRadius * 1.0}
              cy={highestY}
              r="2"
              fill="#8b5cf6"
              opacity="0.6"
            />
          </React.Fragment>
        )}
        
        {/* 중앙 포인트 (항상 표시) */}
        <circle
          cx={previewX}
          cy={highestY}
          r="3"
          fill={isLandingOnFruit ? "#ef4444" : "#a855f7"} // 과일 위일 때 빨간색, 바닥일 때 보라색
          opacity="0.8"
          filter="url(#dropGlow)"
        />
      </React.Fragment>
    );
  };
  
  // 게임 영역 바운더리 렌더링
  const renderBoundaries = () => {
    const wallThickness = GAME_CONSTANTS.WORLD.WALL_THICKNESS;
    
    // GameEngine에서 엔드라인 높이 가져오기
    const endLineY = gameEngineRef.current ? 
      gameEngineRef.current.getEndLineHeight(gameState.level || 1) : 
      120; // fallback
    
    return (
      <React.Fragment>
        {/* 벽 그라데이션 정의 */}
        <defs>
          <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* 바닥 - 그림자 효과 */}
        <Rect
          x={0}
          y={gameHeight - wallThickness}
          width={gameWidth}
          height={wallThickness}
          fill="url(#floorGrad)"
          filter="url(#glow)"
        />
        <Rect
          x={2}
          y={gameHeight - wallThickness + 2}
          width={gameWidth - 4}
          height={wallThickness - 2}
          fill="rgba(255,255,255,0.2)"
          rx="2"
        />
        
        {/* 왼쪽 벽 - 그림자 효과 */}
        <Rect
          x={0}
          y={0}
          width={wallThickness}
          height={gameHeight}
          fill="url(#wallGrad)"
          filter="url(#glow)"
        />
        <Rect
          x={2}
          y={2}
          width={wallThickness - 2}
          height={gameHeight - 4}
          fill="rgba(255,255,255,0.2)"
          ry="2"
        />
        
        {/* 오른쪽 벽 - 그림자 효과 */}
        <Rect
          x={gameWidth - wallThickness}
          y={0}
          width={wallThickness}
          height={gameHeight}
          fill="url(#wallGrad)"
          filter="url(#glow)"
        />
        <Rect
          x={gameWidth - wallThickness}
          y={2}
          width={wallThickness - 2}
          height={gameHeight - 4}
          fill="rgba(255,255,255,0.2)"
          ry="2"
        />
        
        {/* 게임 오버 라인 - 예쁘게 개선 */}
        <defs>
          <linearGradient id="dangerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        {/* 메인 엔드라인 - 굵고 명확하게 */}
        <Line
          x1={wallThickness}
          y1={endLineY}
          x2={gameWidth - wallThickness}
          y2={endLineY}
          stroke="#ff0000"
          strokeWidth="6"
          strokeDasharray="20,8"
          opacity="0.9"
          filter="url(#glow)"
        />
        {/* 보조 라인 - 더 얇게 */}
        <Line
          x1={wallThickness}
          y1={endLineY + 3}
          x2={gameWidth - wallThickness}
          y2={endLineY + 3}
          stroke="rgba(255,0,0,0.4)"
          strokeWidth="2"
          strokeDasharray="20,8"
          opacity="0.7"
        />
        
        {/* 레벨 표시 */}
        <text
          x={gameWidth - 80}
          y={endLineY - 10}
          fill="#ef4444"
          fontSize="12"
          fontWeight="bold"
          opacity="0.8"
        >
          Level {gameState.level || 1}
        </text>
      </React.Fragment>
    );
  };
  
  const styles = createStyles(gameWidth, gameHeight);

  return (
    <View style={styles.container}>
      <View
        style={styles.gameArea}
        {...panResponder.panHandlers}
      >
        <Svg width={gameWidth} height={gameHeight} style={styles.svg}>
          {/* 배경 그라데이션 */}
          <defs>
            <radialGradient id="bgGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(254, 251, 255, 0.1)" />
              <stop offset="50%" stopColor="rgba(250, 245, 255, 0.05)" />
              <stop offset="100%" stopColor="rgba(243, 232, 255, 0.02)" />
            </radialGradient>
            <pattern id="hexPattern" patternUnits="userSpaceOnUse" width="40" height="35">
              <polygon points="20,5 35,15 35,25 20,35 5,25 5,15" 
                       fill="none" 
                       stroke="#e9d5ff" 
                       strokeWidth="0.5" 
                       opacity="0.4" />
            </pattern>
            <filter id="innerShadow">
              <feOffset dx="0" dy="1"/>
              <feGaussianBlur stdDeviation="2" result="offset-blur"/>
              <feFlood floodColor="#8b5cf6" floodOpacity="0.1"/>
              <feComposite in2="offset-blur" operator="in"/>
            </filter>
          </defs>
          
          {/* 기본 배경 */}
          <Rect
            x={0}
            y={0}
            width={gameWidth}
            height={gameHeight}
            fill="url(#bgGradient)"
          />
          
          {/* 헥사곤 패턴 */}
          <Rect
            x={0}
            y={0}
            width={gameWidth}
            height={gameHeight}
            fill="url(#hexPattern)"
          />
          
          {/* 내부 그림자 효과 */}
          <Rect
            x={0}
            y={0}
            width={gameWidth}
            height={gameHeight}
            fill="url(#bgGradient)"
            filter="url(#innerShadow)"
            opacity="0.3"
          />
          
          {/* 게임 영역 바운더리 */}
          {renderBoundaries()}
          
          {/* 드롭 라인 (떨어질 위치 예측) */}
          {renderDropLine()}
          
          {/* 떨어진 과일들 */}
          {gameState.fruits.map(renderFruit)}
          
          {/* 미리보기 과일 (반투명) */}
          {renderPreviewFruit()}
        </Svg>
        
        {/* 합치기 이펙트들 */}
        {effects.map(effect => (
          <MergeEffect
            key={effect.id}
            position={effect.position}
            size={effect.size}
            color={effect.color}
            onComplete={() => removeEffect(effect.id)}
          />
        ))}
        
        {/* 점수 애니메이션들 */}
        {scoreAnimations.map(animation => (
          <ScoreAnimation
            key={animation.id}
            score={animation.score}
            position={animation.position}
            onComplete={() => removeScoreAnimation(animation.id)}
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (gameWidth, gameHeight) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  gameArea: {
    width: gameWidth,
    height: gameHeight,
    backgroundColor: 'transparent', // 하얀색 제거
    borderRadius: 20,
    elevation: 12,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    maxWidth: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  svg: {
    borderRadius: 10,
  },
});

export default GameRenderer;