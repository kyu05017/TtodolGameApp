import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
  const [mousePosition, setMousePosition] = useState({ x: 175, y: 50 });
  
  const gameWidth = 350;
  const gameHeight = 600;
  
  // 이펙트 제거 함수
  const removeEffect = (effectId) => {
    setEffects(prev => prev.filter(effect => effect.id !== effectId));
  };
  
  // 점수 애니메이션 제거 함수
  const removeScoreAnimation = (animationId) => {
    setScoreAnimations(prev => prev.filter(animation => animation.id !== animationId));
  };
  
  // 게임 엔진 초기화
  useEffect(() => {
    console.log('🎮 Web GameRenderer 초기화 시작...');
    
    if (!gameEngineRef.current) {
      console.log('🏗️ GameEngine 인스턴스 생성...');
      gameEngineRef.current = new GameEngineService();
      
      console.log('🍎 첫 번째 과일 생성...');
      gameEngineRef.current.createNextFruit();
      
      // 초기 상태 설정
      console.log('🔄 초기 상태 설정...');
      setGameState(prev => ({
        ...prev,
        previewFruit: gameEngineRef.current.previewFruit
      }));
      
      console.log('🔁 게임 루프 시작...');
      startGameLoop();
      
      console.log('✅ Web GameRenderer 초기화 완료');
    }
    
    return () => {
      console.log('🗑️ GameRenderer 정리...');
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (gameEngineRef.current) {
        gameEngineRef.current.dispose();
      }
    };
  }, []);
  
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
              
              // 합치기 이펙트 추가
              const newEffect = {
                id: Date.now() + Math.random(),
                position: result.position || { x: gameWidth / 2, y: gameHeight / 2 },
                size: FRUITS_BASE[result.fruitId].size.width,
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
  
  // 마우스 이벤트 처리 (웹 전용)
  const handleMouseMove = (evt) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    
    setMousePosition({ x, y });
    
    // 미리보기 과일 위치 업데이트
    if (gameEngineRef.current && gameEngineRef.current.previewFruit) {
      gameEngineRef.current.moveCurrentFruit(x);
      setGameState(prev => ({
        ...prev,
        previewFruit: gameEngineRef.current.previewFruit
      }));
    }
  };
  
  const handleClick = (evt) => {
    console.log('🖱️ 클릭 이벤트');
    
    const rect = evt.currentTarget.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    
    if (gameEngineRef.current) {
      // 미리보기 과일이 없으면 생성
      if (!gameEngineRef.current.previewFruit) {
        gameEngineRef.current.createNextFruit();
      }
      
      gameEngineRef.current.moveCurrentFruit(x);
      
      const dropped = gameEngineRef.current.dropCurrentFruit();
      if (dropped) {
        console.log('🍎 과일 드롭 성공');
        // 새로운 미리보기 과일 생성
        setTimeout(() => {
          if (gameEngineRef.current) {
            gameEngineRef.current.createNextFruit();
            setGameState(prev => ({
              ...prev,
              previewFruit: gameEngineRef.current.previewFruit
            }));
          }
        }, 500);
      }
    }
  };
  
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
        <Circle
          cx={fruit.position.x}
          cy={fruit.position.y}
          r={radius}
          fill={fruitData.color}
          stroke="#000"
          strokeWidth="1"
          opacity="0.3"
          transform={`rotate(${rotation} ${fruit.position.x} ${fruit.position.y})`}
        />
        
        {/* 과일 이미지 */}
        {imageUri && (
          <Image
            x={fruit.position.x - radius}
            y={fruit.position.y - radius}
            width={radius * 2}
            height={radius * 2}
            href={imageUri}
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
        position: { x: mousePosition.x, y: 50 }
      };
      
      const radius = defaultFruit.fruitData.size.width / 2;
      
      return (
        <React.Fragment>
          <Circle
            cx={defaultFruit.position.x}
            cy={defaultFruit.position.y}
            r={radius}
            fill={defaultFruit.fruitData.color}
            stroke="#000"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.5"
          />
          <Circle
            cx={defaultFruit.position.x}
            cy={defaultFruit.position.y}
            r={radius / 2}
            fill="white"
            opacity="0.8"
          />
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
        {/* 배경 원 */}
        <Circle
          cx={fruit.position.x}
          cy={fruit.position.y}
          r={radius}
          fill={fruitData.color}
          stroke="#000"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.5"
        />
        
        {/* 내부 하이라이트 */}
        <Circle
          cx={fruit.position.x}
          cy={fruit.position.y}
          r={radius / 2}
          fill="white"
          opacity="0.6"
        />
        
        {/* 과일 이미지 */}
        {imageUri && (
          <Image
            x={fruit.position.x - radius}
            y={fruit.position.y - radius}
            width={radius * 2}
            height={radius * 2}
            href={imageUri}
            opacity="0.8"
          />
        )}
      </React.Fragment>
    );
  };

  // 드롭 라인 렌더링
  const renderDropLine = () => {
    const dropLineY = 120;
    return (
      <Line
        x1={GAME_CONSTANTS.WORLD.WALL_THICKNESS}
        y1={dropLineY}
        x2={gameWidth - GAME_CONSTANTS.WORLD.WALL_THICKNESS}
        y2={dropLineY}
        stroke="#FFD700"
        strokeWidth="3"
        strokeDasharray="10,5"
        opacity="0.7"
      />
    );
  };
  
  // 게임 영역 바운더리 렌더링
  const renderBoundaries = () => {
    const wallThickness = GAME_CONSTANTS.WORLD.WALL_THICKNESS;
    
    return (
      <React.Fragment>
        {/* 바닥 */}
        <Rect
          x={0}
          y={gameHeight - wallThickness}
          width={gameWidth}
          height={wallThickness}
          fill="#8B5A3C"
        />
        
        {/* 왼쪽 벽 */}
        <Rect
          x={0}
          y={0}
          width={wallThickness}
          height={gameHeight}
          fill="#8B5A3C"
        />
        
        {/* 오른쪽 벽 */}
        <Rect
          x={gameWidth - wallThickness}
          y={0}
          width={wallThickness}
          height={gameHeight}
          fill="#8B5A3C"
        />
        
        {/* 게임 오버 라인 */}
        <Rect
          x={0}
          y={100}
          width={gameWidth}
          height={2}
          fill="#FF0000"
          opacity="0.5"
        />
      </React.Fragment>
    );
  };
  
  return (
    <View style={styles.container}>
      <View
        style={[styles.gameArea, { width: gameWidth, height: gameHeight }]}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <Svg width={gameWidth} height={gameHeight} style={styles.svg}>
          {/* 게임 영역 바운더리 */}
          {renderBoundaries()}
          
          {/* 드롭 라인 */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f0c3',
  },
  gameArea: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    cursor: 'pointer',
  },
  svg: {
    borderRadius: 10,
  },
});

export default GameRenderer;