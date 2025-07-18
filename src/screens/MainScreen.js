import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useGame } from '../services/GameContext';
import { NICKNAME_WORDS } from '../constants/nicknameWords';
import { getStorageService } from '../services/StorageService';
import { getAdService } from '../services/AdService';
import BackgroundImageSystem from '../components/UI/BackgroundImageSystem';
import AnimatedButton from '../components/UI/AnimatedButton';
import NicknameModal from '../components/UI/NicknameModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  const { state, actions } = useGame();
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  
  const storageService = getStorageService();
  const adService = getAdService();
  
  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
    showBannerAd();
  }, []);
  
  const loadInitialData = async () => {
    try {
      const gameData = await storageService.getGameData();
      if (gameData.nickname) {
        actions.setNickname(gameData.nickname);
      }
      
      const audioSettings = await storageService.getAudioSettings();
      actions.setMusicVolume(audioSettings.musicVolume);
      actions.setEffectVolume(audioSettings.effectVolume);
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
    navigation.navigate('GameScreen');
  };
  
  // 메뉴 열기
  const handleMenuPress = () => {
    actions.showModal('showMainMenu');
  };
  
  // 설정 메뉴
  const handleSettingsPress = () => {
    actions.showModal('showSettings');
  };
  
  // 캐시 삭제
  const handleClearCache = () => {
    Alert.alert(
      '캐시 삭제',
      '모든 게임 데이터가 삭제됩니다.\n정말로 진행하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => {
            actions.resetGame();
            actions.setNickname('');
            Alert.alert('완료', '캐시가 삭제되었습니다.');
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 배경 이미지 */}
      <BackgroundImageSystem
        images={[]} // 실제 이미지 배열로 교체 필요
        interval={5000}
        enableTransition={true}
        overlayColors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
        fallbackColor="#f3f0c3"
      >
        
        {/* 상단 메뉴 */}
        <View style={styles.topMenu}>
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <View style={styles.menuIcon}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* 메인 컨텐츠 */}
        <View style={styles.mainContent}>
          {/* 게임 영역 */}
          <View style={styles.gameArea}>
            <View style={styles.centerSpace} />
            
            {/* 하단 UI */}
            <View style={styles.bottomUI}>
              {/* 닉네임 박스 */}
              {state.nickname ? (
                <TouchableOpacity style={styles.nicknameBox} onPress={handleNicknamePress}>
                  <Text style={styles.nickname}>{state.nickname}</Text>
                  <Text style={styles.nicknameHint}>✏️ 클릭하여 변경</Text>
                </TouchableOpacity>
              ) : null}
              
              {/* 게임 모드 버튼 */}
              <View style={styles.gameModeBtns}>
                <AnimatedButton
                  style={[styles.modeBtn, styles.normalModeBtn]}
                  onPress={() => handleGameStart('normal')}
                  animationType="bounce"
                >
                  🎮 일반
                </AnimatedButton>
                
                <AnimatedButton
                  style={[styles.modeBtn, styles.challengeModeBtn]}
                  onPress={() => handleGameStart('challenge')}
                  animationType="bounce"
                >
                  🏆 챌린지
                </AnimatedButton>
              </View>
            </View>
          </View>
          
          {/* 광고 영역 */}
          <View style={styles.adSpace}>
            <View style={styles.adPlaceholder}>
              <Text style={styles.adText}>🎯 광고 영역</Text>
            </View>
          </View>
        </View>
      </BackgroundImageSystem>
      
      {/* 닉네임 모달 */}
      <NicknameModal
        visible={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f0c3',
  },
  backgroundImage: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#f3f0c3',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topMenu: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  menuButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuIcon: {
    width: 20,
    height: 15,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: '#8B5A3C',
    borderRadius: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centerSpace: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
  },
  bottomUI: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingBottom: 50,
  },
  nicknameBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5A3C',
    marginBottom: 4,
  },
  nicknameHint: {
    fontSize: 12,
    color: '#666',
  },
  gameModeBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  modeBtn: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  normalModeBtn: {
    backgroundColor: '#4CAF50',
  },
  challengeModeBtn: {
    backgroundColor: '#FF9800',
  },
  modeBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adSpace: {
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});

export default MainScreen;