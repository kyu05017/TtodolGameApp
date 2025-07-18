import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions,
  StyleSheet,
  Modal,
} from 'react-native';
import { GameProvider } from './src/services/GameContext';
import GameScreen from './src/screens/GameScreen';
import { DIFFICULTY_SETTINGS } from './src/constants/gameConstants';
import { getAudioService } from './src/services/AudioService';
import { 
  createTouchHandler, 
  createStorage
} from './src/utils/platform';

const { width } = Dimensions.get('window');

const App = () => {
  // 핵심 상태만 유지
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
  const [audioService] = useState(() => getAudioService());
  const [isAudioEnabled] = useState(true);
  const [showGameSelectModal, setShowGameSelectModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [todayBestScore] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('main');

  // 플랫폼별 스토리지
  const storage = createStorage();

  // 앱 시작 시 닉네임 체크
  useEffect(() => {
    const loadPlayerName = async () => {
      const savedName = await storage.getItem('playerName');
      if (savedName) {
        setPlayerName(savedName);
      }
    };
    
    loadPlayerName();
  }, []);

  const startGame = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setShowGameSelectModal(false);
    setCurrentScreen('game');
    
    if (audioService && isAudioEnabled) {
      audioService.playBackgroundMusic();
    }
  };

  const resetGame = () => {
    setCurrentScreen('main');
    
    if (audioService) {
      audioService.stopBackgroundMusic();
    }
  };


  // 게임 화면 렌더링
  if (currentScreen === 'game') {
    return (
      <GameProvider>
        <GameScreen 
          gameMode={selectedDifficulty}
          navigation={{ 
            navigate: (screen: string) => {
              if (screen === 'MainScreen') {
                resetGame();
              }
            }
          }}
        />
      </GameProvider>
    );
  }

  // 메인 화면 (통일된 UI)
  return (
    <View style={styles.container}>
      {/* 배경 그라데이션 */}
      <View style={styles.backgroundGradient}>
        {/* 우측 상단 메뉴 버튼 */}
        <TouchableOpacity
          style={styles.menuButton}
          {...createTouchHandler(() => {})}
        >
          <Text style={styles.menuButtonText}>☰ 메뉴</Text>
        </TouchableOpacity>

        {/* 메인 콘텐츠 영역 */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>
            🍉 또돌 수박게임
          </Text>
        </View>

        {/* 하단 영역 */}
        <View style={styles.bottomSection}>
          {/* 닉네임과 최고점수 */}
          <View style={styles.playerInfo}>
            <TouchableOpacity
              style={styles.nicknameButton}
              {...createTouchHandler(() => {})}
            >
              <Text style={styles.nicknameText}>
                {playerName || '플레이어'} ✏️
              </Text>
            </TouchableOpacity>
            
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>오늘 최고점수:</Text>
              <View style={styles.scoreValue}>
                <Text style={styles.scoreText}>
                  {todayBestScore.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* 게임 모드 버튼 */}
          <View style={styles.gameButtons}>
            <TouchableOpacity
              style={[styles.gameButton, styles.normalButton]}
              {...createTouchHandler(() => setShowGameSelectModal(true))}
            >
              <Text style={styles.gameButtonText}>🎮 일반</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.gameButton, styles.challengeButton]}
              {...createTouchHandler(() => {})}
            >
              <Text style={styles.gameButtonText}>🔥 챌린지</Text>
            </TouchableOpacity>
          </View>

          {/* 배너 광고 영역 */}
          <View style={styles.bannerAd}>
            <Text style={styles.bannerText}>📢 배너 광고</Text>
          </View>
        </View>
      </View>

      {/* 모달들 - 모바일 전용 */}
      <Modal
        visible={showGameSelectModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGameSelectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.gameSelectModal}>
            <Text style={styles.gameSelectTitle}>🎮 일반 게임 모드</Text>
            <Text style={styles.gameSelectSubtitle}>난이도를 선택하세요</Text>
            
            <View style={styles.difficultyButtons}>
              <TouchableOpacity
                style={[styles.difficultyButton, styles.easyButton]}
                onPress={() => startGame('easy')}
              >
                <Text style={styles.difficultyButtonText}>😊 쉬움</Text>
                <Text style={styles.difficultyDescription}>여유로운 게임 플레이</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.difficultyButton, styles.normalDifficultyButton]}
                onPress={() => startGame('normal')}
              >
                <Text style={styles.difficultyButtonText}>🎯 보통</Text>
                <Text style={styles.difficultyDescription}>표준 게임 플레이</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.difficultyButton, styles.hardButton]}
                onPress={() => startGame('hard')}
              >
                <Text style={styles.difficultyButtonText}>🔥 어려움</Text>
                <Text style={styles.difficultyDescription}>도전적인 게임 플레이</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowGameSelectModal(false)}
            >
              <Text style={styles.closeModalButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


// React Native 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#667eea',
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  bottomSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  nicknameButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nicknameText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scoreInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreLabel: {
    color: '#666',
    fontSize: 14,
  },
  scoreValue: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameButtons: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginBottom: 20,
  },
  gameButton: {
    flex: 1,
    maxWidth: 180,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  normalButton: {
    backgroundColor: '#4CAF50',
  },
  challengeButton: {
    backgroundColor: '#FF5722',
  },
  gameButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerAd: {
    height: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  bannerText: {
    color: '#999',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameSelectModal: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    maxWidth: 400,
    width: '90%',
    alignItems: 'center',
  },
  gameSelectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  gameSelectSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  difficultyButtons: {
    width: '100%',
    gap: 15,
    marginBottom: 30,
  },
  difficultyButton: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  difficultyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  difficultyDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  normalDifficultyButton: {
    backgroundColor: '#2196F3',
  },
  hardButton: {
    backgroundColor: '#FF5722',
  },
  closeModalButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;