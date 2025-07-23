import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useGame } from '../../services/GameContext';
import { isWeb, platformStyle } from '../../utils/platform';
import VolumeSlider from '../UI/VolumeSlider';
import ConfirmModal from './ConfirmModal';
import { getStorageService } from '../../services/StorageService';
import { getAudioService } from '../../services/AudioService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MenuModal = ({ 
  visible, 
  onClose, 
  type = 'main', // 'main' 또는 'game'
  onResumeGame,
  onRestartGame,
  onGoToMain
}) => {
  const { state, actions } = useGame();
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [localMusicVolume, setLocalMusicVolume] = useState(state.musicVolume || 0.5);
  const [localEffectVolume, setLocalEffectVolume] = useState(state.effectVolume || 0.5);
  const storageService = getStorageService();
  const audioService = getAudioService();

  // 볼륨 설정 불러오기
  const loadVolumeSettings = async () => {
    try {
      const audioSettings = await storageService.getAudioSettings();
      
      // 저장된 값이 있으면 사용, 없으면 기본값 (0.5) 사용
      const musicVol = audioSettings.musicVolume || 0.5;
      const effectVol = audioSettings.effectVolume || 0.5;
      
      setLocalMusicVolume(musicVol);
      setLocalEffectVolume(effectVol);
      actions.setMusicVolume(musicVol);
      actions.setEffectVolume(effectVol);
      audioService.setMusicVolume(musicVol);
      audioService.setEffectVolume(effectVol);
      
      console.log('🎵 볼륨 설정 불러옴:', { musicVol, effectVol });
    } catch (error) {
      console.error('❌ 볼륨 설정 불러오기 실패:', error);
    }
  };

  // 볼륨 설정 저장하기
  const saveVolumeSettings = async (musicVol, effectVol) => {
    try {
      await storageService.saveAudioSettings({
        musicVolume: musicVol,
        effectVolume: effectVol,
        isMusicEnabled: true,
        isEffectEnabled: true
      });
      console.log('💾 볼륨 설정 저장 완료:', { musicVol, effectVol });
    } catch (error) {
      console.error('❌ 볼륨 설정 저장 실패:', error);
    }
  };

  React.useEffect(() => {
    if (visible) {
      // 모달이 열릴 때 볼륨 설정 불러오기
      loadVolumeSettings();
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  const handleMusicVolumeChange = async (volume) => {
    console.log(`🎵 MenuModal (${type}) - Music Volume 변경:`, volume);
    
    // 로컬 상태 업데이트
    setLocalMusicVolume(volume);
    
    // GameContext 상태 업데이트
    actions.setMusicVolume(volume);
    
    // AudioService에 실제 볼륨 적용
    audioService.setMusicVolume(volume);
    
    // 기기에 저장
    await saveVolumeSettings(volume, localEffectVolume);
  };

  const handleEffectVolumeChange = async (volume) => {
    console.log(`🔊 MenuModal (${type}) - Effect Volume 변경:`, volume);
    
    // 로컬 상태 업데이트
    setLocalEffectVolume(volume);
    
    // GameContext 상태 업데이트
    actions.setEffectVolume(volume);
    
    // AudioService에 실제 볼륨 적용
    audioService.setEffectVolume(volume);
    
    // 효과음 테스트 재생
    if (volume > 0) {
      audioService.playEffect('button_click');
    }
    
    // 기기에 저장
    await saveVolumeSettings(localMusicVolume, volume);
  };

  const handleClearCache = () => {
    setShowClearCacheModal(true);
  };

  const confirmClearCache = async () => {
    // 캐시 삭제 로직
    try {
      // AsyncStorage 또는 localStorage 클리어
      if (isWeb) {
        localStorage.clear();
      } else {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.clear();
      }
      
      // 게임 상태 초기화
      actions.resetGame();
      
      // 페이지 새로고침 또는 앱 재시작 안내
      if (isWeb) {
        window.location.reload();
      } else {
        // React Native에서는 앱 재시작이 필요함을 알림
        alert('앱을 재시작해주세요.');
      }
    } catch (error) {
      console.error('캐시 삭제 중 오류:', error);
    }
    
    setShowClearCacheModal(false);
    onClose();
  };

  const renderGameMenuItems = () => (
    <>
      {/* 게임 재개 */}
      <TouchableOpacity style={styles.menuItem} onPress={onResumeGame}>
        {isWeb ? (
          <View style={[styles.menuItemGradient, { backgroundColor: '#667eea' }]}>
            <Text style={styles.menuItemIcon}>▶️</Text>
            <Text style={styles.menuItemText}>게임 재개</Text>
          </View>
        ) : (
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.menuItemGradient}>
            <Text style={styles.menuItemIcon}>▶️</Text>
            <Text style={styles.menuItemText}>게임 재개</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>

      {/* 다시 시작 */}
      <TouchableOpacity style={styles.menuItem} onPress={onRestartGame}>
        {isWeb ? (
          <View style={[styles.menuItemGradient, { backgroundColor: '#00c9ff' }]}>
            <Text style={styles.menuItemIcon}>🔄</Text>
            <Text style={styles.menuItemText}>다시 시작</Text>
          </View>
        ) : (
          <LinearGradient colors={['#00c9ff', '#92fe9d']} style={styles.menuItemGradient}>
            <Text style={styles.menuItemIcon}>🔄</Text>
            <Text style={styles.menuItemText}>다시 시작</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>

      {/* 메인화면 */}
      <TouchableOpacity style={styles.menuItem} onPress={onGoToMain}>
        {isWeb ? (
          <View style={[styles.menuItemGradient, { backgroundColor: '#f093fb' }]}>
            <Text style={styles.menuItemIcon}>🏠</Text>
            <Text style={styles.menuItemText}>메인화면</Text>
          </View>
        ) : (
          <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.menuItemGradient}>
            <Text style={styles.menuItemIcon}>🏠</Text>
            <Text style={styles.menuItemText}>메인화면</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>

      {/* 구분선 */}
      <View style={styles.divider} />
    </>
  );

  const renderMainMenuItems = () => (
    <>
      {/* 캐시 삭제 */}
      <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
        {isWeb ? (
          <View style={[styles.menuItemGradient, { backgroundColor: '#fc4a1a' }]}>
            <Text style={styles.menuItemIcon}>🗑️</Text>
            <Text style={styles.menuItemText}>캐시 삭제</Text>
          </View>
        ) : (
          <LinearGradient colors={['#fc4a1a', '#f7b733']} style={styles.menuItemGradient}>
            <Text style={styles.menuItemIcon}>🗑️</Text>
            <Text style={styles.menuItemText}>캐시 삭제</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>

      {/* 구분선 */}
      <View style={styles.divider} />
    </>
  );

  // 웹에서는 Modal 대신 조건부 렌더링 사용
  const renderModal = () => (
    <Animated.View 
      style={[
        styles.modalOverlay,
        { 
          opacity: fadeAnim,
          // ConfirmModal이 열렸을 때 배경을 투명하게
          backgroundColor: showClearCacheModal ? 'transparent' : 'rgba(0, 0, 0, 0.7)'
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.modalBackdrop} 
        activeOpacity={1} 
        onPress={(e) => {
          if (isWeb) {
            e.preventDefault();
            e.stopPropagation();
          }
          // 모든 플랫폼에서 배경 클릭 차단
        }}
        disabled={false} // 이벤트 캐치를 위해 활성화
      />
      
      <Animated.View 
        style={[
          styles.modalContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim
          }
        ]}
      >
        {isWeb ? (
          <View style={[styles.modalContent, { backgroundColor: '#ffffff' }]}>
            {/* 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {type === 'game' ? '⚙️ 게임 메뉴' : '⚙️ 설정'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 메뉴 아이템들 */}
            <View style={styles.menuItems}>
              {/* 게임별 메뉴 */}
              {type === 'game' && renderGameMenuItems()}
              {type === 'main' && renderMainMenuItems()}

              {/* 공통 볼륨 설정 */}
              <View style={styles.volumeSection}>
                {/* 배경음악 볼륨 */}
                <View style={styles.volumeItem}>
                  <Text style={styles.volumeLabel}>🎵 배경음악</Text>
                  <VolumeSlider
                    value={localMusicVolume}
                    onValueChange={handleMusicVolumeChange}
                    volumeType="music"
                  />
                </View>

                {/* 효과음 볼륨 */}
                <View style={styles.volumeItem}>
                  <Text style={styles.volumeLabel}>🔊 효과음</Text>
                  <VolumeSlider
                    value={localEffectVolume}
                    onValueChange={handleEffectVolumeChange}
                    volumeType="effect"
                  />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.modalContent}
          >
            {/* 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {type === 'game' ? '⚙️ 게임 메뉴' : '⚙️ 설정'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 메뉴 아이템들 */}
            <View style={styles.menuItems}>
              {/* 게임별 메뉴 */}
              {type === 'game' && renderGameMenuItems()}
              {type === 'main' && renderMainMenuItems()}

              {/* 공통 볼륨 설정 */}
              <View style={styles.volumeSection}>
                {/* 배경음악 볼륨 */}
                <View style={styles.volumeItem}>
                  <Text style={styles.volumeLabel}>🎵 배경음악</Text>
                  <VolumeSlider
                    value={localMusicVolume}
                    onValueChange={handleMusicVolumeChange}
                    volumeType="music"
                  />
                </View>

                {/* 효과음 볼륨 */}
                <View style={styles.volumeItem}>
                  <Text style={styles.volumeLabel}>🔊 효과음</Text>
                  <VolumeSlider
                    value={localEffectVolume}
                    onValueChange={handleEffectVolumeChange}
                    volumeType="effect"
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        )}
      </Animated.View>
    </Animated.View>
  );

  // 디버깅 로그 추가
  React.useEffect(() => {
    console.log('🔧 MenuModal 상태 변경:', { 
      visible, 
      isWeb, 
      type, 
      musicVolume: state.musicVolume, 
      effectVolume: state.effectVolume 
    });
  }, [visible, isWeb, type, state.musicVolume, state.effectVolume]);

  return (
    <>
      {isWeb ? (
        // 웹에서는 조건부 렌더링
        visible && renderModal()
      ) : (
        // 모바일에서는 Modal 컴포넌트 사용
        <Modal
          visible={visible}
          transparent={true}
          animationType="none"
          onRequestClose={onClose}
        >
          {renderModal()}
        </Modal>
      )}

      {/* 캐시 삭제 확인 모달 */}
      <ConfirmModal
        visible={showClearCacheModal}
        title="안내"
        message="캐시를 삭제하고 게임을 재실행 합니다."
        onConfirm={confirmClearCache}
        onCancel={() => setShowClearCacheModal(false)}
        confirmText="네"
        cancelText="아니요"
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // 기본값을 투명으로 (인라인에서 설정)
    justifyContent: 'center',
    alignItems: 'center',
    ...platformStyle(
      {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
      },
      {}
    ),
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: Math.min(screenWidth * 0.9, 400),
    maxHeight: screenHeight * 0.8,
    borderRadius: 24,
    overflow: 'hidden',
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
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  menuItems: {
    gap: 16,
  },
  menuItem: {
    borderRadius: 16,
    overflow: 'hidden',
    ...platformStyle(
      { cursor: 'pointer' },
      {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }
    ),
  },
  menuItemGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemIcon: {
    fontSize: 20,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 8,
  },
  volumeSection: {
    gap: 20,
    paddingTop: 8,
  },
  volumeItem: {
    gap: 12,
  },
  volumeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MenuModal;