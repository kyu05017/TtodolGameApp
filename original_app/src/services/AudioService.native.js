/**
 * ===================================================================
 * AUDIO SERVICE - React Native용 오디오 서비스
 * ===================================================================
 * 
 * React Native 네이티브 환경에서 사용하는 오디오 서비스입니다.
 */

import { Platform, Vibration } from 'react-native';
import { Audio } from 'expo-av';

class AudioServiceNative {
  constructor() {
    this.sounds = {};
    this.musicVolume = 0.5; // 배경음악 볼륨 (디폴트 50%)
    this.effectVolume = 0.5; // 효과음 볼륨
    this.volume = 0.5; // 하위 호환성을 위한 기존 볼륨
    this.isEnabled = true;
    this.currentBGM = null;
    this.isFilterActive = false; // 필터 효과 상태 (네이티브에서는 볼륨 조절로 대체)
    this.originalVolume = 0.5; // 원래 볼륨 저장 (디폴트 50%)
    this.initialize()
  }

  async initialize() {
    try {
      console.log('🎵 AudioService Native 초기화 시작...')
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: false
      })
      await this.loadBackgroundMusic()
      console.log('✅ AudioService Native 초기화 완료')
    } catch (error) {
      console.error('❌ AudioService Native 초기화 실패:', error)
      this.isEnabled = false;
    }
  }

  async loadBackgroundMusic() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/background.mp3'),
        { 
          isLooping: true,
          volume: this.musicVolume,
          shouldPlay: false
        }
      )
      this.sounds.background = sound;
      console.log('✅ 배경음악 로드 성공')
    } catch (error) {
      console.warn('배경음악 로드 실패:', error)
      this.isEnabled = false;
    }
  }

  async playBackgroundMusic() {
    if (!this.isEnabled) return;
    
    const bgm = this.sounds.background;
    if (bgm) {
      try {
        await bgm.setVolumeAsync(this.musicVolume)
        console.log(`🎵 재생 전 볼륨 설정: ${Math.round(this.musicVolume * 100)}%`)
        
        await bgm.playAsync()
        this.currentBGM = bgm;
        console.log('🎵 배경음악 재생 시작')
      } catch (error) {
        console.log('배경음악 재생 실패:', error)
      }
    } else {
      console.warn('❌ 배경음악 파일이 로드되지 않음')
    }
  }

  async pauseBackgroundMusic() {
    if (this.currentBGM) {
      await this.currentBGM.pauseAsync()
      console.log('🎵 배경음악 일시정지')
    }
  }

  async stopBackgroundMusic() {
    if (this.currentBGM) {
      await this.currentBGM.stopAsync()
      await this.currentBGM.setPositionAsync(0)
      console.log('🎵 배경음악 정지')
    }
  }

  async resumeBackgroundMusic() {
    if (this.currentBGM && this.isEnabled) {
      await this.currentBGM.playAsync()
      console.log('🎵 배경음악 재개')
    }
  }

  async restartBackgroundMusic() {
    if (this.currentBGM) {
      await this.currentBGM.stopAsync()
      await this.currentBGM.setPositionAsync(0)
      if (this.isEnabled) {
        await this.currentBGM.playAsync()
      }
      console.log('🎵 배경음악 처음부터 다시 재생')
    }
  }

  async setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    
    // 배경음악 볼륨 업데이트
    if (this.sounds.background) {
      await this.sounds.background.setVolumeAsync(this.musicVolume)
      console.log(`🎵 배경음악 볼륨 설정: ${Math.round(this.musicVolume * 100)}% - 적용됨`)
    } else {
      console.warn('❌ 배경음악이 로드되지 않음 - 볼륨 설정 실패')
    }
    
    // currentBGM이 있으면 그것도 업데이트
    if (this.currentBGM && this.currentBGM !== this.sounds.background) {
      await this.currentBGM.setVolumeAsync(this.musicVolume)
      console.log('🎵 currentBGM 볼륨도 업데이트')
    }
    
    console.log(`🎵 배경음악 볼륨 설정: ${Math.round(this.musicVolume * 100)}%`)
  }

  setEffectVolume(volume) {
    this.effectVolume = Math.max(0, Math.min(1, volume))
    console.log(`🔊 효과음 볼륨 설정: ${Math.round(this.effectVolume * 100)}%`)
  }

  getMusicVolume() {
    return this.musicVolume;
  }

  getEffectVolume() {
    return this.effectVolume;
  }

  // 하위 호환성을 위한 기존 메서드
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    this.setMusicVolume(volume)
    
    console.log(`🎵 볼륨 설정 (하위호환): ${this.volume * 100}%`)
  }

  getVolume() {
    return this.volume;
  }

  toggleEnabled() {
    this.isEnabled = !this.isEnabled;
    
    if (!this.isEnabled) {
      this.pauseBackgroundMusic()
    } else {
      this.playBackgroundMusic()
    }
    
    console.log(`🔊 오디오 ${this.isEnabled ? '활성화' : '비활성화'}`)
    return this.isEnabled;
  }

  isAudioEnabled() {
    return this.isEnabled;
  }

  // 효과음 재생
  async playEffect(effectName) {
    if (!this.isEnabled) return;
    
    try {
      // 효과음이 이미 로드되어 있는지 확인
      if (this.sounds[effectName]) {
        await this.sounds[effectName].setVolumeAsync(this.effectVolume)
        await this.sounds[effectName].replayAsync()
        console.log(`🔊 효과음 재생: ${effectName} (볼륨: ${Math.round(this.effectVolume * 100)}%)`)
        return;
      }
      
      // 새로운 효과음 로드 및 재생
      let soundFile;
      if (effectName === 'drop') {
        // drop.mp3 파일이 없으므로 배경음악으로 대체 또는 생략
        console.log(`효과음 ${effectName} 파일이 없음 - 생략`)
        return;
      } else if (effectName === 'merge') {
        // merge.mp3 파일이 없으므로 배경음악으로 대체 또는 생략
        console.log(`효과음 ${effectName} 파일이 없음 - 생략`)
        return;
      } else {
        console.log(`효과음 ${effectName} 파일을 찾을 수 없음`)
        return;
      }
      
      const { sound } = await Audio.Sound.createAsync(
        soundFile,
        { 
          volume: this.effectVolume,
          shouldPlay: true
        }
      )
      
      this.sounds[effectName] = sound;
      console.log(`🔊 효과음 재생: ${effectName} (볼래: ${Math.round(this.effectVolume * 100)}%)`)
    } catch (error) {
      console.log(`효과음 ${effectName} 재생 실패:`, error)
    }
  }

  // 메뉴 모달 효과 (볼륨 15% 감소)
  async enableUnderwaterEffect() {
    if (!this.isFilterActive) {
      this.originalVolume = this.musicVolume;
      const newVolume = this.musicVolume * 0.85; // 15% 감소 (85%로 설정)
      
      if (this.sounds.background) {
        await this.sounds.background.setVolumeAsync(newVolume)
      }
      if (this.currentBGM && this.currentBGM !== this.sounds.background) {
        await this.currentBGM.setVolumeAsync(newVolume)
      }
      
      this.isFilterActive = true;
      console.log('🔇 메뉴 모달 효과 활성화 (네이티브 - 볼륨 15% 감소)')
    }
  }

  // 메뉴 모달 효과 비활성화 (원래 볼륨으로 복원)
  async disableUnderwaterEffect() {
    if (this.isFilterActive) {
      const originalVolume = this.originalVolume || this.musicVolume;
      
      if (this.sounds.background) {
        await this.sounds.background.setVolumeAsync(originalVolume)
      }
      if (this.currentBGM && this.currentBGM !== this.sounds.background) {
        await this.currentBGM.setVolumeAsync(originalVolume)
      }
      
      this.isFilterActive = false;
      console.log('🔊 메뉴 모달 효과 비활성화 (네이티브 - 볼륨 복원)')
    }
  }

  // 현재 필터 상태 확인
  isUnderwaterEffectActive() {
    return this.isFilterActive;
  }

  // 리소스 해제
  async dispose() {
    await this.stopBackgroundMusic()
    
    // 모든 사운드 리소스 해제
    for (const sound of Object.values(this.sounds)) {
      if (sound) {
        await sound.unloadAsync()
      }
    }
    
    this.sounds = {};
    this.currentBGM = null;
    console.log('🔇 AudioService Native 리소스 해제')
  }
}

// 싱글톤 인스턴스
let audioServiceInstance = null;

const getAudioService = () => {
  if (!audioServiceInstance) {
    audioServiceInstance = new AudioServiceNative()
  }
  return audioServiceInstance;
};

const disposeAudioService = () => {
  if (audioServiceInstance) {
    audioServiceInstance.dispose()
    audioServiceInstance = null;
  }
};

// Convert to CommonJS
export {
  getAudioService,
  disposeAudioService
};
