import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Temporarily disabled
import { useGame } from '../services/GameContext';
import { GAME_CONSTANTS } from '../constants/gameConstants.ts';
import { Platform } from 'react-native';
import GameRenderer from '../components/Game/GameRenderer';
import { GameScreenLayout } from '../components/Layout/ScreenLayout';
import FixedBannerLayout from '../components/Layout/FixedBannerLayout';
import BannerAd from '../components/Ad/BannerAd';
import { showAlert, isWeb, platformStyle, createTouchHandler } from '../utils/platform';
import { webStyles } from '../styles/web';
import AnimatedButton from '../components/UI/AnimatedButton';
import MenuButton from '../components/UI/MenuButton';
import FruitCollectionStatus from '../components/Game/FruitCollectionStatus';
import MenuModal from '../components/Modal/MenuModal';
import { getAudioService } from '../services/AudioService';

// 네이티브에서는 기본 GameRenderer 사용
const SelectedGameRenderer = GameRenderer;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const GameScreen = ({ navigation, gameMode = 'normal' }) => {
  // 플랫폼별 컨텍스트 사용 - 네이티브에서는 기본 GameContext만 사용
  const { state, actions } = useGame()
  const [gameTime, setGameTime] = useState(0)
  const [shakeCountdown, setShakeCountdown] = useState(30)
  const [shakeIntensity, setShakeIntensity] = useState(0)
  const [scoreAnimation] = useState(new Animated.Value(1))
  const [shakeButtonScale] = useState(new Animated.Value(1)) // 쉐이크 버튼 숨쉬는 애니메이션
  const [showMenuModal, setShowMenuModal] = useState(false)
  
  // 오디오 서비스 인스턴스
  const audioService = getAudioService()
  
  // 컴포넌트 마운트 시 볼륨 설정 적용
  useEffect(() => {
    if (audioService) {
      // GameContext의 볼륨값을 오디오 서비스에 적용
      audioService.setMusicVolume(state.musicVolume)
      audioService.setEffectVolume(state.effectVolume)
      console.log(`🎵 게임 화면 진입 - 볼륨 설정 적용: 음악 ${Math.round(state.musicVolume * 100)}%, 효과음 ${Math.round(state.effectVolume * 100)}%`)
    }
  }, [])
  
  // 게임 시작 핸들러
  const handleGameStart = () => {
    console.log('🎮 게임 시작 버튼 클릭')
    console.log('🎯 게임 모드:', gameMode)
    console.log('🔧 현재 상태:', state)
    
    // 사용자 상호작용 발생 - 브라우저 자동재생 정책 우회
    if (audioService && audioService.tryPlayAfterUserInteraction) {
      audioService.tryPlayAfterUserInteraction()
    }
    
    // 게임 시작 전에 배경음악 처리
    if (audioService) {
      if (state.isGameStarted) {
        // 이미 게임이 진행 중이었다면 (재시작) 처음부터 재생
        audioService.restartBackgroundMusic()
        console.log('🎵 배경음악 재시작 (처음부터)')
      }
    }
    
    actions.startGame(gameMode)
    
    console.log('✅ 게임 시작 액션 호출 완료')
  };
  
  // 컴포넌트 마운트 시 및 게임 상태 변경 시 배경음악 처리
  useEffect(() => {
    if (audioService) {
      if (state.isGameStarted) {
        // 게임이 시작되면 배경음악 재생 (일시정지 상태와 무관하게)
        audioService.playBackgroundMusic()
        console.log('🎵 게임 진행 중 - 배경음악 재생')
      } else {
        // 게임이 종료되었을 때만 배경음악 정지
        audioService.stopBackgroundMusic()
        console.log('🎵 게임 종료 - 배경음악 정지')
      }
    }
  }, [state.isGameStarted, audioService])
  
  // 컴포넌트 언마운트 시 배경음악 정리
  useEffect(() => {
    return () => {
      if (audioService && !state.isGameStarted) {
        audioService.stopBackgroundMusic()
        console.log('🎵 GameScreen 언마운트 - 배경음악 정지')
      }
    };
  }, [])
  
  // 메뉴 모달 상태에 따른 음악 효과 처리
  useEffect(() => {
    console.log('🔍 메뉴 모달 상태 변경:', {
      showMenuModal,
      isGameStarted: state.isGameStarted,
      hasAudioService: !!audioService,
      audioServiceType: audioService?.constructor?.name
    })
    
    if (audioService && state.isGameStarted) {
      if (showMenuModal) {
        // 메뉴 모달이 열리면 볼륨 15% 감소 + 먹먹함 효과
        console.log('🔇 메뉴 모달 효과 적용 시도...')
        audioService.enableUnderwaterEffect()
        console.log('🔇 메뉴 모달 열림 - 볼륨 15% 감소 + 먹먹함 효과 적용 완료')
      } else {
        // 메뉴 모달이 닫히면 원래 볼륨으로 복원 (재생 상태 유지)
        console.log('🔊 메뉴 모달 효과 해제 시도...')
        audioService.disableUnderwaterEffect()
        console.log('🔊 메뉴 모달 닫힘 - 볼륨 복원 + 먹먹함 효과 제거 완료')
      }
    }
  }, [showMenuModal, audioService, state.isGameStarted])
  
  // 게임 시간 타이머
  useEffect(() => {
    let interval;
    if (state.isGameStarted && !state.isPaused) {
      interval = setInterval(() => {
        actions.updateTime()
        
        // 쉐이크 카운트다운
        if (shakeCountdown > 0) {
          setShakeCountdown(prev => prev - 1)
        }
      }, 1000)
    }
    
    return () => clearInterval(interval)
  }, [state.isGameStarted, state.isPaused, shakeCountdown])
  
  // 점수 애니메이션
  useEffect(() => {
    Animated.sequence([
      Animated.spring(scoreAnimation, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scoreAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [state.score])

  // 쉐이크 버튼 숨쉬는 애니메이션
  useEffect(() => {
    if (shakeCountdown === 0) {
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shakeButtonScale, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(shakeButtonScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      )
      breathingAnimation.start()
      
      return () => breathingAnimation.stop()
    } else {
      // 카운트다운 중일 때는 기본 크기로 복원
      Animated.timing(shakeButtonScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [shakeCountdown])
  
  // 메뉴 모달 열기
  const handleOpenMenu = () => {
    console.log('🔧 게임화면 메뉴 버튼 클릭 - isWeb:', isWeb)
    console.log('🔧 현재 showMenuModal 상태:', showMenuModal)
    setShowMenuModal(true)
    actions.pauseGame()
    console.log('🔧 게임 메뉴 모달 열기 및 게임 일시정지 완료')
  };

  // 메뉴 모달 닫기
  const handleCloseMenu = () => {
    setShowMenuModal(false)
    actions.resumeGame()
  };

  // 게임 재개
  const handleResumeFromMenu = () => {
    setShowMenuModal(false)
    actions.resumeGame()
  };

  
  // 게임 종료
  const handleGameOver = () => {
    actions.endGame()
    showAlert(
      '게임 종료',
      `최종 점수: ${state.score.toLocaleString()}점\n플레이 시간: ${formatTime(state.playTime)}`,
      [
        { text: '다시 시작', onPress: handleRestart },
        { text: '메인으로', onPress: handleGoToMain }
      ]
    )
  };
  
  // 게임 재시작
  const handleRestart = () => {
    // 로우패스 필터 해제
    if (audioService) {
      audioService.disableUnderwaterEffect()
      console.log('🔊 게임 재시작 - 로우패스 필터 효과 해제')
    }
    actions.resetGame()
    setShakeCountdown(30)
    setShakeIntensity(0)
  };
  
  // 메인 화면으로
  const handleGoToMain = () => {
    // 로우패스 필터 해제
    if (audioService) {
      audioService.disableUnderwaterEffect()
      console.log('🔊 메인화면으로 이동 - 로우패스 필터 효과 해제')
    }
    actions.resetGame()
    navigation.navigate('MainScreen')
  };
  
  // 쉐이크 실행
  const handleShake = () => {
    if (shakeCountdown === 0) {
      // 쉐이크 효과 구현
      setShakeIntensity(5)
      setShakeCountdown(30)
      
      // 쉐이크 효과 초기화
      setTimeout(() => {
        setShakeIntensity(0)
      }, 500)
    }
  };
  
  // 점수 업데이트 핸들러
  const handleScoreUpdate = (points) => {
    actions.updateScore(points, true)
  };
  
  // 과일 병합 핸들러
  const handleFruitMerge = (fruitId) => {
    actions.addToCollection(fruitId)
    actions.updateFruitCount(fruitId)
  };
  
  // 게임 오버 핸들러
  const handleGameOverFromEngine = () => {
    handleGameOver()
  };
  
  // 시간 포맷팅
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  
  return (
    <GameScreenLayout>
        {/* 배경 그라데이션 - 더 부드러운 색상 */}
        <View
          
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
        {/* 장식용 원형 배경 */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        
        {/* 게임 헤더 */}
        <View style={styles.header}>
          <View style={styles.scoreContainer}>
            <Animated.View style={[styles.pillCard, { transform: [{ scale: scoreAnimation }] }]}>
              <Text style={styles.pillIcon}>🎯</Text>
              <Text style={styles.pillValue}>{state.score.toLocaleString()}</Text>
            </Animated.View>
            
            <View style={styles.pillCard}>
              <Text style={styles.pillIcon}>⏱️</Text>
              <Text style={styles.pillValue}>{formatTime(state.playTime)}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MenuButton onPress={handleOpenMenu} />
          </View>
        </View>
      
      
      {/* 게임 영역 - flex를 이용해 높이 확장 */}
      <View style={styles.gameWrapper}>
        <View style={styles.gameContainer}>
          {/* 우측 상단 컨트롤 영역 */}
          <View style={styles.rightControls}>
            {/* 쉐이크 컨트롤 */}
            {state.isGameStarted && (
              <View style={styles.shakeControls}>
                <View style={styles.shakeTimerBar}>
                  <View 
                    style={[
                      styles.shakeTimerFill, 
                      { height: `${((30 - shakeCountdown) / 30) * 100}%` }
                    ]} 
                  />
                  <Text style={styles.shakeTimerText}>{shakeCountdown}</Text>
                </View>
                
                {/* 새로운 알약 모양 쉐이크 버튼 */}
                <Animated.View
                  style={[
                    { transform: [{ scale: shakeButtonScale }] }
                  ]}
                >
                  <AnimatedButton
                    style={[
                      styles.shakePillBtn,
                      { 
                        opacity: shakeCountdown === 0 ? 1 : 0.6,
                        backgroundColor: shakeCountdown === 0 
                          ? 'rgba(34, 197, 94, 0.9)' // 초록색으로 변경
                          : 'rgba(100, 100, 100, 0.7)',
                        borderColor: shakeCountdown === 0
                          ? 'rgba(21, 128, 61, 0.6)' // 더 어두운 초록색 테두리 (투명도 증가)
                          : 'rgba(30, 30, 30, 0.6)' // 투명도 증가
                      }
                    ]}
                    onPress={handleShake}
                    disabled={shakeCountdown > 0}
                    animationType="scale"
                  >
                    <Text style={styles.shakeIcon}>🎁</Text>
                  </AnimatedButton>
                </Animated.View>
              </View>
            )}
          </View>
          {state.isGameStarted ? (
            <View 
              style={[
                styles.gameArea,
                isWeb && { backgroundColor: 'transparent' }
              ]}
              testID="game-area"
            >
              <SelectedGameRenderer
                onScoreUpdate={handleScoreUpdate}
                onGameOver={handleGameOverFromEngine}
                onFruitMerge={handleFruitMerge}
                isPaused={state.isPaused}
                shakeIntensity={shakeIntensity}
              />
            </View>
          ) : (
            <View style={styles.gameAreaPlaceholder}>
              <View style={styles.placeholderContent}>
                <Text style={styles.placeholderEmoji}>🎮</Text>
                <Text style={styles.placeholderText}>게임을 시작하세요!</Text>
                <Text style={styles.placeholderSubtext}>과일을 떨어뜨려 합쳐보세요</Text>
              </View>
            </View>
          )}
        </View>
      </View>
      
      {/* 과일 수집 현황 - 게임 영역 아래 */}
      {state.isGameStarted && (
        <View style={styles.fruitCollectionContainer}>
          <FruitCollectionStatus 
            currentGameCollection={state.fruitCount || {}} 
            horizontal={true}
          />
        </View>
      )}
      
      {/* 게임 시작 모달 */}
      {state.showGameStartModal && (
        <View style={styles.modalOverlay}>
          <Animated.View style={styles.startModal}>
            <View
              
              style={styles.modalGradient}
            >
              <Text style={styles.startTitle}>🍉 또돌 수박게임</Text>
              <Text style={styles.startSubtitle}>터치해서 과일을 떨어뜨려 보세요!</Text>
              
              <AnimatedButton 
                style={styles.startBtn} 
                onPress={handleGameStart}
                animationType="scale"
              >
                <View
                  
                  style={styles.startBtnGradient}
                >
                  <Text style={styles.startBtnIcon}>🎮</Text>
                  <Text style={styles.startBtnText}>게임 시작</Text>
                </View>
              </AnimatedButton>
              
              <View style={styles.fruitPreview}>
                <Text style={styles.fruitPreviewText}>🍒 🍓 🍇 🍊 🍎</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      )}

        </View>
        
        {/* 하단 고정 배너 광고 */}
        <View style={styles.bannerContainer}>
          <BannerAd
            position="bottom"
            size="standard"
            testMode={true}
          />
        </View>

        {/* 게임 메뉴 모달 */}
        <MenuModal
          visible={showMenuModal}
          onClose={handleCloseMenu}
          type="game"
          onResumeGame={handleResumeFromMenu}
          onRestartGame={() => {
            setShowMenuModal(false)
            handleRestart()
          }}
          onGoToMain={() => {
            setShowMenuModal(false)
            handleGoToMain()
          }}
        />
    </GameScreenLayout>
  )
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -150,
    left: -150,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -200,
    right: -200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingTop: isWeb ? 16 : 12, // 헤더 상단 패딩 복원 및 증가
    paddingBottom: 12, // 헤더 하단 패딩 복원 및 증가
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: isWeb ? 26 : 22,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: isWeb ? 13 : 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    fontStyle: 'italic',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 이미 8로 일치
    flex: 1,
    justifyContent: 'center',
  },
  pillCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 24, // 25 → 24 (8의 배수)
    paddingHorizontal: 16, // 이미 16으로 일치
    paddingVertical: 8, // 이미 8로 일치
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 중앙 정렬 추가
    gap: 8, // 이미 8로 일치
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    minWidth: isWeb ? 140 : 120, // 웹에서는 더 넓게, 모바일에서는 적당히
    width: isWeb ? 140 : 120, // 고정 너비로 완전히 통일
    height: 40, // 고정 높이 설정
    ...platformStyle(
      { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' },
      {
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }
    ),
  },
  pillIcon: {
    fontSize: 18,
  },
  pillValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    flex: 1, // 남은 공간 사용
    textAlign: 'center', // 텍스트 중앙 정렬
  },
  rightControls: {
    position: 'absolute',
    top: 140, // 엔드라인 밑으로 이동 (대략 120px + 여백)
    right: 15, // 15픽셀 좌측으로 이동
    zIndex: 10,
    gap: 8, // 간격 줄임
  },
  fruitCollectionContainer: {
    paddingTop: 8, // 게임 영역과의 간격 최소화 (16 → 8)
    paddingBottom: 8, // 광고 영역과의 간격 최소화 (16 → 8)
    marginHorizontal: 8, // 좌우 마진 최소화 (16 → 8)
    flexShrink: 0, // 크기 축소 방지
    minHeight: 50, // 최소 높이 줄임 (60 → 50)
  },
  shakeControls: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8, // 10 → 8
  },
  shakeTimerBar: {
    width: 32, // 30 → 32 (8의 배수)
    height: 96, // 100 → 96 (8의 배수)
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16, // 15 → 16 (8의 배수)
    overflow: 'hidden',
    borderWidth: 1, // 2 → 1로 줄임
    borderColor: 'rgba(30, 30, 30, 0.6)', // 투명도 증가로 더 자연스럽게
    justifyContent: 'flex-end',
    alignItems: 'center',
    elevation: 8, // 그림자 강화
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋 증가
    shadowOpacity: 0.15, // 그림자 불투명도 증가
    shadowRadius: 6, // 그림자 블러 증가
  },
  shakeTimerFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00c9ff',
    borderRadius: 16, // 15 → 16 (8의 배수)
  },
  shakeTimerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    zIndex: 1,
    marginBottom: 8, // 5 → 8
  },
  gameWrapper: {
    flex: 4, // flex 가중치를 3.5에서 4로 증가 (더 많은 공간 할당)
    position: 'relative',
    paddingHorizontal: 8, // 좌우 여백 최소화 (16 → 8)
    paddingTop: 12, // 헤더와의 간격 줄임 (20 → 12)
    paddingBottom: 0, // 과일 수집 패널과의 간격 제거
    justifyContent: 'center', // 수직 중앙 정렬
    alignItems: 'center', // 수평 중앙 정렬
  },
  gameContainer: {
    flex: 1,
    maxWidth: '100%', // 화면 너비를 넘지 않도록 제한
    width: '100%', // 전체 너비 사용
    alignSelf: 'center', // 자기 자신을 중앙 정렬
    borderRadius: 24, // 16 → 24로 증가, 더 부드러운 모서리
    overflow: 'hidden',
    backgroundColor: 'transparent', // 하얀색 제거
    // 그라데이션 테두리 효과를 위한 설정
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...platformStyle(
      { 
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15), inset 0 0 50px rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      },
      {
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
      }
    ),
  },
  gameArea: {
    flex: 1,
    backgroundColor: 'rgba(248, 250, 252, 0.8)', // 반투명 배경
    // 게임 영역 내부 그라데이션 효과
    ...platformStyle(
      {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      {}
    ),
  },
  gameAreaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 250, 252, 0.8)', // 반투명 배경
    // 플레이스홀더 배경 그라데이션
    ...platformStyle(
      {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(200, 220, 240, 0.1) 100%)',
      },
      {}
    ),
  },
  placeholderContent: {
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 80,
    marginBottom: 24, // 20 → 24 (8의 배수)
  },
  placeholderText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8, // 10 → 8
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  shakeBtn: {
    borderRadius: 24, // 25 → 24 (8의 배수)
    overflow: 'hidden',
    ...platformStyle(
      { cursor: 'pointer' },
      {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }
    ),
  },
  shakeBtnGradient: {
    width: 48, // 50 → 48 (8의 배수)
    height: 48, // 50 → 48
    borderRadius: 24, // 25 → 24
    justifyContent: 'center',
    alignItems: 'center',
  },
  shakeBtnIcon: {
    fontSize: 24,
  },
  
  // 동그라미 모양 쉐이크 버튼
  shakePillBtn: {
    borderRadius: 20, // 완전한 원형으로 변경
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // 2 → 1로 줄임
    borderColor: 'rgba(30, 30, 30, 0.6)', // 투명도 증가로 더 자연스럽게
    width: 40, // 높이와 동일하게 설정하여 완전한 원형
    height: 40, // 타이머와 동일한 높이
    marginTop: 8,
    ...platformStyle(
      { 
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)', // 그림자 강화
        cursor: 'pointer'
      },
      {
        elevation: 8, // 그림자 강화
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 }, // 그림자 오프셋 증가
        shadowOpacity: 0.15, // 그림자 불투명도 증가
        shadowRadius: 6, // 그림자 블러 증가
      }
    ),
  },
  
  shakeIcon: {
    fontSize: 18, // 타이머와 동일한 크기
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  startModal: {
    borderRadius: 32, // 30 → 32 (8의 배수)
    overflow: 'hidden',
    maxWidth: 380,
    width: '90%',
    ...platformStyle(
      { boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4)' },
      {
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
      }
    ),
  },
  modalGradient: {
    padding: 48, // 45 → 48 (8의 배수)
    alignItems: 'center',
  },
  startTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16, // 15 → 16
    color: '#333',
    textAlign: 'center',
  },
  startSubtitle: {
    fontSize: 18,
    marginBottom: 32, // 35 → 32 (8의 배수)
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
  startBtn: {
    borderRadius: 32, // 30 → 32 (8의 배수)
    overflow: 'hidden',
    ...platformStyle(
      { cursor: 'pointer' },
      {
        elevation: 8,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }
    ),
  },
  startBtnGradient: {
    paddingHorizontal: 48, // 50 → 48 (8의 배수)
    paddingVertical: 16, // 18 → 16
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 12 → 8
  },
  startBtnIcon: {
    fontSize: 24,
  },
  startBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fruitPreview: {
    marginTop: 32, // 30 → 32 (8의 배수)
  },
  fruitPreviewText: {
    fontSize: 30,
    letterSpacing: 8,
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1000,
    ...platformStyle(
      {
        position: 'fixed',
        zIndex: 9998
      },
      {
        elevation: 1000
      }
    ),
  },
})

export default GameScreen;