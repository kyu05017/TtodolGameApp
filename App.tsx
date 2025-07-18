import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert, 
  Linking,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Modal,
  Slider
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_CONSTANTS, DIFFICULTY_SETTINGS } from './src/constants/gameConstants';
import { FRUITS_BASE } from './src/constants/fruits';
import { getAudioService } from './src/services/AudioService';
import { NICKNAME_WORDS } from './src/constants/nicknameWords';
import { GameProvider } from './src/services/GameContext';
import GameScreen from './src/screens/GameScreen';

const { width, height } = Dimensions.get('window');

// 플랫폼별 저장소 처리 (모바일용)
const Storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  
  async setItem(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }
};

const App = () => {
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    timeLeft: 0,
    isPlaying: false,
    gameMode: 'normal',
    currentFruit: null,
    fruits: []
  });

  const [showMenu, setShowMenu] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
  const [audioService] = useState(() => getAudioService());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [bgmVolume, setBgmVolume] = useState(0.5);
  const [effectVolume, setEffectVolume] = useState(0.7);
  const [isBgmMuted, setIsBgmMuted] = useState(false);
  const [isEffectMuted, setIsEffectMuted] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showGameSelectModal, setShowGameSelectModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [tempNickname, setTempNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [todayBestScore, setTodayBestScore] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('main'); // 'main' 또는 'game'

  // 앱 시작 시 닉네임 체크
  useEffect(() => {
    const loadPlayerName = async () => {
      const savedName = await Storage.getItem('playerName');
      if (!savedName) {
        setShowNicknameModal(true);
        setTempNickname('');
      } else {
        setPlayerName(savedName);
      }
    };
    
    loadPlayerName();
  }, []);

  const startGame = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    const difficultySettings = DIFFICULTY_SETTINGS[difficulty as keyof typeof DIFFICULTY_SETTINGS];
    
    setGameState({
      score: 0,
      level: 1,
      timeLeft: difficultySettings?.timeLimit || 0,
      isPlaying: true,
      gameMode: difficulty,
      currentFruit: FRUITS_BASE[0],
      fruits: []
    });
    
    // 모든 모달 닫기
    setShowMenu(false);
    setShowGameSelectModal(false);
    setShowChallengeModal(false);
    
    // 게임 화면으로 이동
    setCurrentScreen('game');
    
    // 게임 시작 시 배경음악 재생
    if (audioService && isAudioEnabled) {
      audioService.playBackgroundMusic();
    }
  };

  const openGameSelect = () => {
    setShowGameSelectModal(true);
  };

  const openChallengeSelect = () => {
    setShowChallengeModal(true);
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      timeLeft: 0,
      isPlaying: false,
      gameMode: 'normal',
      currentFruit: null,
      fruits: []
    });
    setShowMenu(true);
    setCurrentScreen('main'); // 메인 화면으로 돌아가기
    
    // 메뉴로 돌아갈 때 배경음악 정지
    if (audioService) {
      audioService.stopBackgroundMusic();
    }
  };

  const generateRandomNickname = () => {
    const adjectives = NICKNAME_WORDS.adjectives;
    const nouns = NICKNAME_WORDS.nouns;
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 999) + 1;
    return `${randomAdj}${randomNoun}${randomNum}`;
  };

  const savePlayerName = async (name: string) => {
    if (!name.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    
    // 동일한 닉네임 체크 (현재 닉네임과 같은 경우)
    if (name === playerName) {
      setNicknameError('동일한 닉네임입니다.');
      return;
    }
    
    const success = await Storage.setItem('playerName', name);
    if (success) {
      setPlayerName(name);
      setShowNicknameModal(false);
      setNicknameError('');
      setTempNickname('');
    } else {
      setNicknameError('닉네임 저장에 실패했습니다.');
    }
  };

  const openNicknameModal = () => {
    setTempNickname(playerName);
    setNicknameError('');
    setShowNicknameModal(true);
  };

  const closeNicknameModal = () => {
    // 닉네임이 없는 경우 모달을 닫을 수 없음
    if (!playerName) return;
    
    setShowNicknameModal(false);
    setNicknameError('');
    setTempNickname('');
  };

  const handleBgmVolumeChange = (volume: number) => {
    setBgmVolume(volume);
    if (audioService) {
      audioService.setVolume(isBgmMuted ? 0 : volume);
    }
  };

  const handleEffectVolumeChange = (volume: number) => {
    setEffectVolume(volume);
    // 효과음 볼륨 설정 (추후 구현)
  };

  const toggleBgmMute = () => {
    const newMuted = !isBgmMuted;
    setIsBgmMuted(newMuted);
    if (audioService) {
      audioService.setVolume(newMuted ? 0 : bgmVolume);
    }
  };

  const toggleEffectMute = () => {
    setIsEffectMuted(!isEffectMuted);
    // 효과음 음소거 설정 (추후 구현)
  };

  const clearCache = async () => {
    Alert.alert(
      '캐시 삭제',
      '캐시를 삭제하시겠습니까? 모든 설정과 기록이 초기화됩니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: async () => {
            await Storage.setItem('playerName', '');
            setPlayerName('');
            setBgmVolume(0.5);
            setEffectVolume(0.7);
            setIsBgmMuted(false);
            setIsEffectMuted(false);
            setTodayBestScore(0);
            setShowMenuModal(false);
            setShowNicknameModal(true);
            Alert.alert('완료', '캐시가 삭제되었습니다.');
          }
        }
      ]
    );
  };

  const openDeveloperPage = (platform: string) => {
    switch (platform) {
      case 'instagram':
        Linking.openURL('https://www.instagram.com/your_developer_account');
        break;
      case 'youtube':
        Linking.openURL('https://www.youtube.com/@your_developer_channel');
        break;
      default:
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (showMenu) {
    return (
      <View style={styles.container}>
        {/* 배경 이미지 */}
        <ImageBackground
          source={require('./src/assets/images/backgrounds/main_bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* 우측 상단 메뉴 버튼 */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowMenuModal(true)}
          >
            <Text style={styles.menuButtonText}>☰ 메뉴</Text>
          </TouchableOpacity>

          {/* 메인 콘텐츠 영역 */}
          <View style={styles.mainContent}>
            {/* 타이틀 제거됨 */}
          </View>

          {/* 하단 영역 */}
          <View style={styles.bottomSection}>
            {/* 닉네임과 최고점수 */}
            <View style={styles.playerInfo}>
              <TouchableOpacity
                style={styles.nicknameButton}
                onPress={openNicknameModal}
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
                onPress={openGameSelect}
              >
                <Text style={styles.gameButtonText}>🎮 일반</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.gameButton, styles.challengeButton]}
                onPress={openChallengeSelect}
              >
                <Text style={styles.gameButtonText}>🔥 챌린지</Text>
              </TouchableOpacity>
            </View>

            {/* 배너 광고 영역 */}
            <View style={styles.bannerAd}>
              <Text style={styles.bannerText}>📢 배너 광고</Text>
            </View>
          </View>
        </ImageBackground>

        {/* 메뉴 모달 */}
        <Modal
          visible={showMenuModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowMenuModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowMenuModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>게임 설정</Text>

              <ScrollView style={styles.modalScroll}>
                {/* 배경음악 볼륨 설정 */}
                <View style={styles.settingSection}>
                  <View style={styles.settingHeader}>
                    <Text style={styles.settingTitle}>🎵 배경음악</Text>
                    <TouchableOpacity
                      style={[styles.muteButton, isBgmMuted && styles.muteButtonActive]}
                      onPress={toggleBgmMute}
                    >
                      <Text style={styles.muteButtonText}>
                        {isBgmMuted ? '🔇' : '🔊'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>0</Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={1}
                      value={bgmVolume}
                      onValueChange={handleBgmVolumeChange}
                      disabled={isBgmMuted}
                      minimumTrackTintColor="#4CAF50"
                      maximumTrackTintColor="#ddd"
                    />
                    <Text style={styles.sliderLabel}>100</Text>
                  </View>
                  <Text style={styles.volumeText}>
                    {isBgmMuted ? '음소거' : `${Math.round(bgmVolume * 100)}%`}
                  </Text>
                </View>

                {/* 효과음 볼륨 설정 */}
                <View style={styles.settingSection}>
                  <View style={styles.settingHeader}>
                    <Text style={styles.settingTitle}>🔊 효과음</Text>
                    <TouchableOpacity
                      style={[styles.muteButton, isEffectMuted && styles.muteButtonActive]}
                      onPress={toggleEffectMute}
                    >
                      <Text style={styles.muteButtonText}>
                        {isEffectMuted ? '🔇' : '🔊'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>0</Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={1}
                      value={effectVolume}
                      onValueChange={handleEffectVolumeChange}
                      disabled={isEffectMuted}
                      minimumTrackTintColor="#4CAF50"
                      maximumTrackTintColor="#ddd"
                    />
                    <Text style={styles.sliderLabel}>100</Text>
                  </View>
                  <Text style={styles.volumeText}>
                    {isEffectMuted ? '음소거' : `${Math.round(effectVolume * 100)}%`}
                  </Text>
                </View>

                {/* 개발자 SNS 버튼 */}
                <View style={styles.settingSection}>
                  <Text style={styles.settingTitle}>👨‍💻 개발자 SNS</Text>
                  <View style={styles.snsButtons}>
                    <TouchableOpacity
                      style={[styles.snsButton, styles.instagramButton]}
                      onPress={() => openDeveloperPage('instagram')}
                    >
                      <Text style={styles.snsButtonText}>📷 Instagram</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.snsButton, styles.youtubeButton]}
                      onPress={() => openDeveloperPage('youtube')}
                    >
                      <Text style={styles.snsButtonText}>🎬 YouTube</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.snsDescription}>
                    개발자의 다른 작품과 소식을 확인해보세요!
                  </Text>
                </View>

                {/* 캐시 삭제 버튼 */}
                <View style={[styles.settingSection, styles.dangerSection]}>
                  <Text style={styles.settingTitle}>🗑️ 데이터 관리</Text>
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearCache}
                  >
                    <Text style={styles.clearButtonText}>전체 캐시 삭제</Text>
                  </TouchableOpacity>
                  <Text style={styles.clearDescription}>
                    닉네임, 점수, 설정이 모두 초기화됩니다
                  </Text>
                </View>

                {/* 앱 버전 정보 */}
                <View style={styles.versionSection}>
                  <Text style={styles.versionTitle}>뜨돌 수박게임</Text>
                  <Text style={styles.versionText}>버전 1.0.0</Text>
                  <Text style={styles.copyrightText}>© 2024 Ttodol Game</Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* 닉네임 설정 모달 */}
        <Modal
          visible={showNicknameModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closeNicknameModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* X 버튼 - 닉네임이 있는 경우에만 표시 */}
              {playerName && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeNicknameModal}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.modalTitle}>닉네임 설정</Text>

              <View style={styles.nicknameInputSection}>
                <Text style={styles.inputLabel}>닉네임:</Text>
                <TextInput
                  style={[styles.textInput, nicknameError && styles.textInputError]}
                  value={tempNickname}
                  onChangeText={(text) => {
                    setTempNickname(text);
                    setNicknameError('');
                  }}
                  placeholder="닉네임을 입력하세요"
                  maxLength={10}
                />
              </View>

              {/* 에러 메시지 */}
              {nicknameError ? (
                <View style={styles.errorMessage}>
                  <Text style={styles.errorText}>{nicknameError}</Text>
                </View>
              ) : null}

              <View style={styles.nicknameButtons}>
                <TouchableOpacity
                  style={[styles.nicknameButton, styles.saveButton]}
                  onPress={() => savePlayerName(tempNickname)}
                >
                  <Text style={styles.nicknameButtonText}>저장</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.nicknameButton, styles.randomButton]}
                  onPress={() => {
                    const randomName = generateRandomNickname();
                    setTempNickname(randomName);
                    setNicknameError('');
                  }}
                >
                  <Text style={styles.nicknameButtonText}>랜덤</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* 게임 셀렉트 모달 (일반 모드) */}
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
                  <Text style={styles.difficultyDescription}>
                    여유로운 게임 플레이
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.difficultyButton, styles.normalDifficultyButton]}
                  onPress={() => startGame('normal')}
                >
                  <Text style={styles.difficultyButtonText}>🎯 보통</Text>
                  <Text style={styles.difficultyDescription}>
                    표준 게임 플레이
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.difficultyButton, styles.hardButton]}
                  onPress={() => startGame('hard')}
                >
                  <Text style={styles.difficultyButtonText}>🔥 어려움</Text>
                  <Text style={styles.difficultyDescription}>
                    도전적인 게임 플레이
                  </Text>
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

        {/* 챌린지 모달 */}
        <Modal
          visible={showChallengeModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowChallengeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.gameSelectModal}>
              <Text style={styles.gameSelectTitle}>🔥 챌린지 모드</Text>
              <Text style={styles.gameSelectSubtitle}>시간과 싸워보세요!</Text>
              
              <View style={styles.difficultyButtons}>
                <TouchableOpacity
                  style={[styles.difficultyButton, styles.challenge2Button]}
                  onPress={() => startGame('timeattack')}
                >
                  <Text style={styles.difficultyButtonText}>⏱️ 2분 챌린지</Text>
                  <Text style={styles.difficultyDescription}>
                    2분 안에 최고 점수 도전
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.difficultyButton, styles.challenge3Button]}
                  onPress={() => startGame('speed')}
                >
                  <Text style={styles.difficultyButtonText}>⚡ 3분 챌린지</Text>
                  <Text style={styles.difficultyDescription}>
                    빠른 속도의 3분 게임
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.difficultyButton, styles.challenge5Button]}
                  onPress={() => startGame('expert')}
                >
                  <Text style={styles.difficultyButtonText}>🚀 5분 챌린지</Text>
                  <Text style={styles.difficultyDescription}>
                    전문가를 위한 5분 게임
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.difficultyButton, styles.chaosButton]}
                  onPress={() => startGame('chaos')}
                >
                  <Text style={styles.difficultyButtonText}>💥 카오스 모드</Text>
                  <Text style={styles.difficultyDescription}>
                    예측 불가능한 혼돈의 게임
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowChallengeModal(false)}
              >
                <Text style={styles.closeModalButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

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

  return (
    <View style={styles.gameContainer}>
      {/* 게임 헤더 */}
      <View style={styles.gameHeader}>
        <View style={styles.gameInfo}>
          <Text style={styles.gameInfoText}>
            점수: {gameState.score.toLocaleString()}
          </Text>
          <Text style={styles.gameInfoText}>
            레벨: {gameState.level}
          </Text>
        </View>
        
        <View style={styles.gameControls}>
          {DIFFICULTY_SETTINGS[selectedDifficulty as keyof typeof DIFFICULTY_SETTINGS]?.timeLimit > 0 && (
            <Text style={[styles.gameInfoText, gameState.timeLeft < 30 && styles.timeWarning]}>
              시간: {formatTime(gameState.timeLeft)}
            </Text>
          )}
          <TouchableOpacity
            style={[styles.controlButton, styles.audioButton]}
            onPress={() => setIsAudioEnabled(!isAudioEnabled)}
          >
            <Text style={styles.controlButtonText}>
              {isAudioEnabled ? '🔊' : '🔇'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.menuReturnButton]}
            onPress={resetGame}
          >
            <Text style={styles.controlButtonText}>메뉴로</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 게임 영역 */}
      <View style={styles.gameArea}>
        <View style={styles.gameBoard}>
          {/* 엔드라인 */}
          <View style={[
            styles.endLine,
            {
              top: DIFFICULTY_SETTINGS[selectedDifficulty as keyof typeof DIFFICULTY_SETTINGS]?.topMargin || 100,
              height: GAME_CONSTANTS.COLORS.LINE_THICKNESS?.[selectedDifficulty as keyof typeof GAME_CONSTANTS.COLORS.LINE_THICKNESS] || 3,
              backgroundColor: GAME_CONSTANTS.COLORS.LINE_COLORS?.[selectedDifficulty as keyof typeof GAME_CONSTANTS.COLORS.LINE_COLORS] || '#FF9800'
            }
          ]} />
          
          {/* 다음 과일 표시 */}
          {gameState.currentFruit && (
            <View style={styles.nextFruit}>
              <View style={[
                styles.fruitIcon,
                { backgroundColor: (gameState.currentFruit as any).color }
              ]}>
                <Text style={styles.fruitText}>
                  {!(gameState.currentFruit as any).name && (gameState.currentFruit as any).korean[0]}
                </Text>
              </View>
              <Text style={styles.nextFruitText}>
                다음: {(gameState.currentFruit as any).korean}
              </Text>
            </View>
          )}
          
          {/* 게임 안내 메시지 */}
          <View style={styles.gameGuide}>
            <Text style={styles.gameGuideText}>🎮 게임 준비 중...</Text>
            <Text style={styles.gameGuideSubText}>
              탭하여 과일을 떨어뜨려보세요!
            </Text>
          </View>
        </View>
      </View>

      {/* 과일 컬렉션 */}
      <View style={styles.fruitCollection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FRUITS_BASE.map((fruit, index) => (
            <View
              key={fruit.id}
              style={[
                styles.collectionFruit,
                {
                  backgroundColor: fruit.color,
                  opacity: index <= gameState.level ? 1 : 0.3
                }
              ]}
            >
              <Text style={styles.collectionFruitText}>
                {!fruit.name && fruit.korean[0]}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'space-between',
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
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    maxWidth: 450,
    width: '90%',
    maxHeight: '80%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#999',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalScroll: {
    maxHeight: 400,
  },
  settingSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 20,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  muteButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  muteButtonActive: {
    backgroundColor: '#ff4444',
  },
  muteButtonText: {
    color: 'white',
    fontSize: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  volumeText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  snsButtons: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginTop: 10,
  },
  snsButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  instagramButton: {
    backgroundColor: '#E4405F',
  },
  youtubeButton: {
    backgroundColor: '#FF0000',
  },
  snsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  snsDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  dangerSection: {
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
  },
  clearButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  versionSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  versionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
  copyrightText: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },
  nicknameInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textInputError: {
    borderColor: '#ff4444',
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffcdd2',
    marginBottom: 15,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
  },
  nicknameButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  randomButton: {
    backgroundColor: '#FF9800',
  },
  nicknameButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: GAME_CONSTANTS.COLORS.BACKGROUND,
  },
  gameHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  gameInfoText: {
    fontWeight: 'bold',
    color: '#333',
  },
  gameControls: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  timeWarning: {
    color: '#ff4444',
  },
  controlButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  audioButton: {
    backgroundColor: '#4CAF50',
  },
  menuReturnButton: {
    backgroundColor: '#ff4444',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 14,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameBoard: {
    width: 300,
    height: 450,
    backgroundColor: '#fff',
    borderWidth: GAME_CONSTANTS.PHYSICS.WALL_THICKNESS,
    borderColor: GAME_CONSTANTS.COLORS.WALL,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  endLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  nextFruit: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fruitIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  nextFruitText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameGuide: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
  gameGuideText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 10,
  },
  gameGuideSubText: {
    color: '#666',
    fontSize: 14,
  },
  fruitCollection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  collectionFruit: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  collectionFruitText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  // 게임 셀렉트 모달 스타일
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
  // 일반 모드 버튼 색상
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  normalDifficultyButton: {
    backgroundColor: '#2196F3',
  },
  hardButton: {
    backgroundColor: '#FF5722',
  },
  // 챌린지 모드 버튼 색상
  challenge2Button: {
    backgroundColor: '#FF9800',
  },
  challenge3Button: {
    backgroundColor: '#E91E63',
  },
  challenge5Button: {
    backgroundColor: '#9C27B0',
  },
  chaosButton: {
    backgroundColor: '#F44336',
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
