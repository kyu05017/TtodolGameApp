import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { useGame } from '../services/GameContext';
import { GAME_CONSTANTS } from '../constants/gameConstants';
import { Platform } from 'react-native';
import GameRenderer from '../components/Game/GameRenderer';

// 플랫폼별 GameRenderer 로딩 - 동적 require 제거
let SimpleGameRenderer;

if (Platform.OS === 'web') {
  // 웹에서는 기본 GameRenderer 사용
  SimpleGameRenderer = GameRenderer;
} else {
  // 모바일에서도 기본 GameRenderer 사용
  SimpleGameRenderer = GameRenderer;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GameScreen = ({ navigation, gameMode = 'normal' }) => {
  const { state, actions } = useGame();
  const [gameTime, setGameTime] = useState(0);
  const [shakeCountdown, setShakeCountdown] = useState(30);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  
  // 게임 시작 핸들러
  const handleGameStart = () => {
    console.log('🎮 게임 시작 버튼 클릭');
    console.log('🎯 게임 모드:', gameMode);
    console.log('🔧 현재 상태:', state);
    
    actions.startGame(gameMode);
    
    console.log('✅ 게임 시작 액션 호출 완료');
  };
  
  // 게임 시간 타이머
  useEffect(() => {
    let interval;
    if (state.isGameStarted && !state.isPaused) {
      interval = setInterval(() => {
        actions.updateTime();
        
        // 쉐이크 카운트다운
        if (shakeCountdown > 0) {
          setShakeCountdown(prev => prev - 1);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [state.isGameStarted, state.isPaused, shakeCountdown]);
  
  // 게임 일시정지
  const handlePause = () => {
    actions.pauseGame();
  };
  
  // 게임 재개
  const handleResume = () => {
    actions.resumeGame();
  };
  
  // 게임 종료
  const handleGameOver = () => {
    actions.endGame();
    Alert.alert(
      '게임 종료',
      `최종 점수: ${state.score.toLocaleString()}점\n플레이 시간: ${formatTime(state.playTime)}`,
      [
        { text: '다시 시작', onPress: handleRestart },
        { text: '메인으로', onPress: handleGoToMain }
      ]
    );
  };
  
  // 게임 재시작
  const handleRestart = () => {
    actions.resetGame();
    setShakeCountdown(30);
    setShakeIntensity(0);
  };
  
  // 메인 화면으로
  const handleGoToMain = () => {
    actions.resetGame();
    navigation.navigate('MainScreen');
  };
  
  // 쉐이크 실행
  const handleShake = () => {
    if (shakeCountdown === 0) {
      // 쉐이크 효과 구현
      setShakeIntensity(5);
      setShakeCountdown(30);
      
      // 쉐이크 효과 초기화
      setTimeout(() => {
        setShakeIntensity(0);
      }, 500);
    }
  };
  
  // 점수 업데이트 핸들러
  const handleScoreUpdate = (points) => {
    actions.updateScore(points, true);
  };
  
  // 과일 병합 핸들러
  const handleFruitMerge = (fruitId) => {
    actions.addToCollection(fruitId);
    actions.updateFruitCount(fruitId);
  };
  
  // 게임 오버 핸들러
  const handleGameOverFromEngine = () => {
    handleGameOver();
  };
  
  // 시간 포맷팅
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 게임 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>또돌 수박게임</Text>
        
        <View style={styles.scoreContainer}>
          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreLabel}>점수:</Text>
            <Text style={styles.scoreValue}>{state.score.toLocaleString()}</Text>
          </View>
          
          <View style={styles.timeDisplay}>
            <Text style={styles.timeLabel}>플레이타임:</Text>
            <Text style={styles.timeValue}>{formatTime(state.playTime)}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.menuBtn} onPress={handlePause}>
          <Text style={styles.menuBtnText}>☰</Text>
        </TouchableOpacity>
      </View>
      
      {/* 게임 영역 */}
      <View style={styles.gameWrapper}>
        {state.isGameStarted ? (
          (() => {
            const RendererComponent = Platform.OS === 'web' && SimpleGameRenderer ? SimpleGameRenderer : GameRenderer;
            return (
              <RendererComponent
                onScoreUpdate={handleScoreUpdate}
                onGameOver={handleGameOverFromEngine}
                onFruitMerge={handleFruitMerge}
                isPaused={state.isPaused}
                shakeIntensity={shakeIntensity}
              />
            );
          })()
        ) : (
          <View style={styles.gameAreaPlaceholder}>
            <Text style={styles.placeholderText}>게임을 시작하세요!</Text>
          </View>
        )}
        
        {/* 쉐이크 컨트롤 */}
        {state.isGameStarted && (
          <View style={styles.shakeControls}>
            <View style={styles.countdownBar}>
              <View 
                style={[
                  styles.countdownFill, 
                  { width: `${((30 - shakeCountdown) / 30) * 100}%` }
                ]} 
              />
              <Text style={styles.countdownText}>{shakeCountdown}</Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.shakeBtn,
                { opacity: shakeCountdown === 0 ? 1 : 0.5 }
              ]}
              onPress={handleShake}
              disabled={shakeCountdown > 0}
            >
              <Text style={styles.shakeBtnText}>🌊 쉐이크</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* 게임 시작 모달 */}
      {state.showGameStartModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.startModal}>
            <Text style={styles.startTitle}>🍉 또돌 수박게임</Text>
            <Text style={styles.startSubtitle}>터치해서 과일을 떨어뜨려 보세요!</Text>
            
            <TouchableOpacity style={styles.startBtn} onPress={handleGameStart}>
              <Text style={styles.startBtnText}>🎮 게임 시작</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 일시정지 오버레이 */}
      {state.isPaused && (
        <View style={styles.modalOverlay}>
          <View style={styles.pauseModal}>
            <Text style={styles.pauseTitle}>⏸️ 게임 일시정지</Text>
            
            <View style={styles.pauseButtons}>
              <TouchableOpacity style={styles.pauseBtn} onPress={handleResume}>
                <Text style={styles.pauseBtnText}>▶️ 계속하기</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.pauseBtn} onPress={handleRestart}>
                <Text style={styles.pauseBtnText}>🔄 다시 시작</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.pauseBtn} onPress={handleGameOver}>
                <Text style={styles.pauseBtnText}>🏳️ 게임 포기</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.pauseBtn} onPress={handleGoToMain}>
                <Text style={styles.pauseBtnText}>🏠 메인으로</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f0c3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5A3C',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD54F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#8B5A3C',
    fontWeight: 'bold',
    marginRight: 6,
  },
  scoreValue: {
    fontSize: 16,
    color: '#E65100',
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'right',
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#81C784',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
  },
  timeLabel: {
    fontSize: 12,
    color: '#8B5A3C',
    fontWeight: 'bold',
    marginRight: 6,
  },
  timeValue: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'right',
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD54F',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  menuBtnText: {
    fontSize: 18,
    color: '#8B5A3C',
  },
  gameWrapper: {
    flex: 1,
    position: 'relative',
  },
  gameAreaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    margin: 20,
    borderRadius: 10,
    elevation: 5,
  },
  placeholderText: {
    fontSize: 18,
    color: '#8B5A3C',
    fontWeight: 'bold',
  },
  shakeControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  countdownBar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  countdownFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
  },
  countdownText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5A3C',
  },
  shakeBtn: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
  },
  shakeBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    maxWidth: 320,
    width: '80%',
    elevation: 10,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8B5A3C',
    textAlign: 'center',
  },
  startSubtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  startBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
  },
  startBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pauseModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 300,
    width: '80%',
    elevation: 10,
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8B5A3C',
  },
  pauseButtons: {
    width: '100%',
  },
  pauseBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  pauseBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;