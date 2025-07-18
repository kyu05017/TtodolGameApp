import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SimpleGameRenderer = ({ 
  onScoreUpdate, 
  onGameOver, 
  onFruitMerge,
  isPaused,
  shakeIntensity = 0 
}) => {
  const [fruits, setFruits] = useState([]);
  const [previewFruit, setPreviewFruit] = useState({ x: 175, y: 50, id: 0 });
  const [score, setScore] = useState(0);
  const gameAreaRef = useRef(null);
  
  const gameWidth = 350;
  const gameHeight = 600;
  
  // 과일 색상 매핑
  const fruitColors = ['#FF6B6B', '#FF8E8E', '#9B59B6', '#F39C12', '#E67E22'];
  const fruitSizes = [16, 24, 30, 35, 45];
  
  // 마우스 이벤트 처리
  const handleMouseMove = (evt) => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    
    // 경계 내에서만 이동
    const clampedX = Math.max(20, Math.min(gameWidth - 20, x));
    
    setPreviewFruit(prev => ({ ...prev, x: clampedX }));
  };
  
  const handleClick = (evt) => {
    if (!gameAreaRef.current) return;
    
    console.log('🖱️ 웹 클릭 이벤트');
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const clampedX = Math.max(20, Math.min(gameWidth - 20, x));
    
    // 새 과일 추가
    const newFruit = {
      id: Date.now(),
      x: clampedX,
      y: 120,
      fruitId: previewFruit.id,
      color: fruitColors[previewFruit.id],
      size: fruitSizes[previewFruit.id],
      vx: 0,
      vy: 0
    };
    
    setFruits(prev => [...prev, newFruit]);
    
    // 새 미리보기 과일
    const nextFruitId = Math.floor(Math.random() * 5);
    setPreviewFruit({ x: clampedX, y: 50, id: nextFruitId });
    
    // 점수 업데이트
    const points = (previewFruit.id + 1) * 10;
    setScore(prev => prev + points);
    onScoreUpdate(points);
    
    console.log('🍎 과일 생성:', newFruit);
  };
  
  // 물리 시뮬레이션 (간단한 중력)
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setFruits(prev => prev.map(fruit => {
        let newY = fruit.y + 2; // 중력
        
        // 바닥 충돌
        if (newY > gameHeight - 50) {
          newY = gameHeight - 50;
        }
        
        return { ...fruit, y: newY };
      }));
    }, 16); // 60fps
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  return (
    <View style={styles.container}>
      <View
        ref={gameAreaRef}
        style={[styles.gameArea, { width: gameWidth, height: gameHeight }]}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {/* 게임 영역 표시 */}
        <Text style={styles.instruction}>마우스를 움직여서 과일 위치를 조정하고 클릭하세요!</Text>
        
        {/* 드롭 라인 */}
        <View style={[styles.dropLine, { top: 120 }]} />
        
        {/* 미리보기 과일 */}
        <View
          style={[
            styles.previewFruit,
            {
              left: previewFruit.x - fruitSizes[previewFruit.id],
              top: previewFruit.y - fruitSizes[previewFruit.id],
              width: fruitSizes[previewFruit.id] * 2,
              height: fruitSizes[previewFruit.id] * 2,
              backgroundColor: fruitColors[previewFruit.id],
              borderRadius: fruitSizes[previewFruit.id],
            }
          ]}
        />
        
        {/* 떨어진 과일들 */}
        {fruits.map(fruit => (
          <View
            key={fruit.id}
            style={[
              styles.fruit,
              {
                left: fruit.x - fruit.size,
                top: fruit.y - fruit.size,
                width: fruit.size * 2,
                height: fruit.size * 2,
                backgroundColor: fruit.color,
                borderRadius: fruit.size,
              }
            ]}
          />
        ))}
        
        {/* 점수 표시 */}
        <Text style={styles.scoreText}>점수: {score}</Text>
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
    border: '2px solid #8B5A3C',
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  instruction: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    fontSize: 12,
    color: '#8B5A3C',
    textAlign: 'center',
    zIndex: 1000,
  },
  dropLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FFD700',
    opacity: 0.7,
  },
  previewFruit: {
    position: 'absolute',
    opacity: 0.6,
    border: '2px dashed #000',
    zIndex: 100,
  },
  fruit: {
    position: 'absolute',
    border: '1px solid #000',
    zIndex: 10,
  },
  scoreText: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5A3C',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 5,
    zIndex: 1000,
  },
});

export default SimpleGameRenderer;