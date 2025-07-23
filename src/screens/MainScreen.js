import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useGame } from '../services/GameContext';
import { Platform } from 'react-native';
import { NICKNAME_WORDS } from '../constants/nicknameWords';
import { getStorageService } from '../services/StorageService';
import { getAdService } from '../services/AdService';
import AnimatedButton from '../components/UI/AnimatedButton';
import NicknameModal from '../components/UI/NicknameModal';
import MenuModal from '../components/Modal/MenuModal';
import { ScrollableScreenLayout } from '../components/Layout/ScreenLayout';
import { 
  isWeb, 
  platformStyle, 
  createTouchHandler, 
  getDimensions, 
  showAlert,
  createNavigation
} from '../utils/platform';

const { width: screenWidth, height: screenHeight } = getDimensions();

const MainScreen = ({ navigation }) => {
  const nav = createNavigation(navigation);
  // 플랫폼별 컨텍스트 사용 - 네이티브에서는 기본 GameContext만 사용
  const { state, actions } = useGame();
  // const [backgroundIndex, setBackgroundIndex] = useState(0); // 현재 사용하지 않음
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  
  const storageService = getStorageService();
  const adService = getAdService();
  // 메인화면에서는 오디오 서비스를 사용하지 않음
  
  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
    showBannerAd();
    // 메인화면에서는 배경음악을 재생하지 않음
  }, []);

  // 웹에서 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isWeb) {
      const body = document.body;
      if (showMenuModal || showNicknameModal) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = 'auto';
      }
      
      // 컴포넌트 언마운트 시 정리
      return () => {
        body.style.overflow = 'auto';
      };
    }
  }, [showMenuModal, showNicknameModal]);
  
  const loadInitialData = async () => {
    try {
      const gameData = await storageService.getGameData();
      if (gameData.nickname) {
        actions.setNickname(gameData.nickname);
      }
      
      const audioSettings = await storageService.getAudioSettings();
      // 저장된 값이 있으면 사용, 없으면 기본값 (0.5) 사용
      const musicVolume = audioSettings.musicVolume !== undefined ? audioSettings.musicVolume : 0.5;
      const effectVolume = audioSettings.effectVolume !== undefined ? audioSettings.effectVolume : 0.5;
      actions.setMusicVolume(musicVolume);
      actions.setEffectVolume(effectVolume);
      console.log(`🎵 메인화면 - 볼륨 설정 로드: 음악 ${Math.round(musicVolume * 100)}%, 효과음 ${Math.round(effectVolume * 100)}%`);
    } catch (error) {
      console.error('초기 데이터 로드 실패:', error);
    }
  };
  
  const showBannerAd = async () => {
    await adService.showBannerAd();
  };
  
  // 랜덤 닉네임 생성
  const generateRandomNickname = () => {
    const randomAdj = NICKNAME_WORDS.adjectives[Math.floor(Math.random() * NICKNAME_WORDS.adjectives.length)];
    const randomNoun = NICKNAME_WORDS.nouns[Math.floor(Math.random() * NICKNAME_WORDS.nouns.length)];
    return `${randomAdj} ${randomNoun}`;
  };
  
  // 닉네임 설정
  const handleNicknamePress = () => {
    if (!state.nickname) {
      const randomNickname = generateRandomNickname();
      actions.setNickname(randomNickname);
      saveNickname(randomNickname);
    } else {
      setShowNicknameModal(true);
    }
  };
  
  const saveNickname = async (nickname) => {
    try {
      await storageService.saveNickname(nickname);
    } catch (error) {
      console.error('닉네임 저장 실패:', error);
    }
  };
  
  // 게임 시작
  const handleGameStart = (mode) => {
    if (!state.nickname) {
      const randomNickname = generateRandomNickname();
      actions.setNickname(randomNickname);
    }
    
    actions.startGame(mode);
    nav.navigate('GameScreen');
  };
  
  // 메뉴 열기
  const handleMenuPress = () => {
    console.log('🔧 메인화면 메뉴 버튼 클릭 - isWeb:', isWeb);
    console.log('🔧 현재 showMenuModal 상태:', showMenuModal);
    setShowMenuModal(true);
    console.log('🔧 메뉴 모달 열기 호출 완료');
  };

  // 메뉴 닫기
  const handleMenuClose = () => {
    setShowMenuModal(false);
  };
  
  // // 설정 메뉴 (현재 사용하지 않음)
  // const handleSettingsPress = () => {
  //   actions.showModal('showSettings');
  // };
  
  // // 캐시 삭제 (현재 사용하지 않음)
  // const handleClearCache = () => {
  //   showAlert(
  //     '캐시 삭제',
  //     '모든 게임 데이터가 삭제됩니다.\n정말로 진행하시겠습니까?',
  //     [
  //       { text: '취소' },
  //       { 
  //         text: '삭제',
  //         onPress: () => {
  //           actions.resetGame();
  //           actions.setNickname('');
  //           showAlert('완료', '캐시가 삭제되었습니다.');
  //         }
  //       }
  //     ]
  //   );
  // };
  
  return (
    <ScrollableScreenLayout 
      backgroundColor="#FF6B6B"
      statusBarStyle="light-content"
      statusBarBackgroundColor="#FF6B6B"
    >
      
      {/* 배경 그라데이션 */}
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.gameTitle}>🍉 또돌 수박게임</Text>
            <Text style={styles.gameSubtitle}>Watermelon Merge Game</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={handleMenuPress}
            {...(isWeb ? {} : createTouchHandler(handleMenuPress))}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        
        {/* 스크롤 가능한 메인 컨텐츠 */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!showMenuModal && !showNicknameModal} // 모달이 열렸을 때 스크롤 비활성화
        >
          {/* 게임 로고/이미지 영역 */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.bigWatermelon}>🍉</Text>
              <View style={styles.logoTextContainer}>
                <Text style={styles.logoText}>또돌</Text>
                <Text style={styles.logoSubText}>수박게임</Text>
              </View>
            </View>
          </View>
          
          {/* 플레이어 정보 */}
          <View style={styles.playerSection}>
            {state.nickname ? (
              <TouchableOpacity 
                style={styles.playerCard} 
                onPress={handleNicknamePress}
                {...(isWeb ? {} : createTouchHandler(handleNicknamePress))}
              >
                <View style={styles.playerAvatar}>
                  <Text style={styles.avatarIcon}>👤</Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{state.nickname}</Text>
                  <Text style={styles.playerHint}>탭하여 닉네임 변경</Text>
                </View>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.createPlayerCard} 
                onPress={handleNicknamePress}
                {...(isWeb ? {} : createTouchHandler(handleNicknamePress))}
              >
                <Text style={styles.createPlayerIcon}>➕</Text>
                <Text style={styles.createPlayerText}>닉네임 설정하기</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* 게임 모드 선택 */}
          <View style={styles.gameModeSection}>
            <Text style={styles.sectionTitle}>게임 모드를 선택하세요</Text>
            
            <View style={styles.modeButtonsContainer}>
              <AnimatedButton
                style={styles.normalModeCard}
                onPress={() => handleGameStart('normal')}
                animationType="scale"
              >
                <View style={styles.modeCardContent}>
                  <Text style={styles.modeIcon}>🎮</Text>
                  <Text style={styles.modeTitle}>일반 모드</Text>
                  <Text style={styles.modeDescription}>편안하게 즐기는 기본 게임</Text>
                </View>
              </AnimatedButton>
              
              <AnimatedButton
                style={styles.challengeModeCard}
                onPress={() => handleGameStart('challenge')}
                animationType="scale"
              >
                <View style={styles.modeCardContent}>
                  <Text style={styles.modeIcon}>🏆</Text>
                  <Text style={styles.modeTitle}>챌린지 모드</Text>
                  <Text style={styles.modeDescription}>시간 제한과 특별 미션</Text>
                </View>
              </AnimatedButton>
            </View>
          </View>
          
          {/* 최고 기록 */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>최고 기록</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>최고 점수</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⏱️</Text>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>플레이 시간</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🏅</Text>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>완성한 수박</Text>
              </View>
            </View>
          </View>
          
          {/* 하단 여백 */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </LinearGradient>
      
      {/* 닉네임 모달 */}
      <NicknameModal
        visible={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
      />

      {/* 메인 메뉴 모달 */}
      <MenuModal
        visible={showMenuModal}
        onClose={handleMenuClose}
        type="main"
      />
    </ScrollableScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: isWeb ? 20 : 10,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleContainer: {
    flex: 1,
  },
  gameTitle: {
    fontSize: isWeb ? 28 : 24,
    fontWeight: 'bold',
    color: 'white',
    ...platformStyle(
      { textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' },
      {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      }
    ),
  },
  gameSubtitle: {
    fontSize: isWeb ? 14 : 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    ...platformStyle(
      { cursor: 'pointer' },
      {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      }
    ),
  },
  settingsIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    ...platformStyle(
      { 
        overflow: 'auto',
        height: '100%'
      },
      {}
    ),
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    ...platformStyle(
      { 
        minHeight: '100vh',
        paddingBottom: 40
      },
      {
        flexGrow: 1
      }
    ),
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 25,
    ...platformStyle(
      { boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' },
      {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      }
    ),
  },
  bigWatermelon: {
    fontSize: 60,
    marginRight: 15,
  },
  logoTextContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    ...platformStyle(
      { textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' },
      {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      }
    ),
  },
  logoSubText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: -5,
  },
  playerSection: {
    marginBottom: 30,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    ...platformStyle(
      { cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' },
      {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    ),
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarIcon: {
    fontSize: 24,
    color: 'white',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  playerHint: {
    fontSize: 12,
    color: '#666',
  },
  editIcon: {
    fontSize: 20,
    color: '#999',
  },
  createPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    ...platformStyle(
      { cursor: 'pointer' },
      {}
    ),
  },
  createPlayerIcon: {
    fontSize: 24,
    color: 'white',
    marginRight: 10,
  },
  createPlayerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  gameModeSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
    ...platformStyle(
      { textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' },
      {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      }
    ),
  },
  modeButtonsContainer: {
    gap: 15,
  },
  normalModeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    ...platformStyle(
      { cursor: 'pointer', boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)' },
      {
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      }
    ),
  },
  challengeModeCard: {
    backgroundColor: 'rgba(255, 183, 77, 0.9)',
    borderRadius: 20,
    padding: 20,
    ...platformStyle(
      { cursor: 'pointer', boxShadow: '0 6px 24px rgba(255, 183, 77, 0.3)' },
      {
        elevation: 6,
        shadowColor: '#FFB74D',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      }
    ),
  },
  modeCardContent: {
    alignItems: 'center',
  },
  modeIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    ...platformStyle(
      { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' },
      {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }
    ),
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default MainScreen;