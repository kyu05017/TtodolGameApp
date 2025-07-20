/**
 * ===================================================================
 * AUDIO SERVICE - React Native용 오디오 서비스
 * ===================================================================
 * 
 * React Native 네이티브 환경에서 사용하는 오디오 서비스입니다.
 */

import { Platform, Vibration } from 'react-native';
import Sound from 'react-native-sound';

// Sound 라이브러리 초기 설정
Sound.setCategory('Playback');

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
    this.initialize();
  }

  initialize() {
    try {
      console.log('🎵 AudioService Native 초기화 시작...');
      this.loadBackgroundMusic();
      console.log('✅ AudioService Native 초기화 완료');
    } catch (error) {
      console.error('❌ AudioService Native 초기화 실패:', error);
      this.isEnabled = false;
    }
  }

  loadBackgroundMusic() {
    try {
      // React Native에서는 음악 파일을 번들에 포함시켜야 함
      const bgm = new Sound('background.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('배경음악 로드 실패:', error);
          this.isEnabled = false;
          return;
        }
        
        // 무한 반복 설정
        bgm.setNumberOfLoops(-1);
        bgm.setVolume(this.musicVolume);
        this.sounds.background = bgm;
        console.log('✅ 배경음악 로드 성공');
      });
    } catch (error) {
      console.warn('배경음악 로드 실패:', error);
      this.isEnabled = false;
    }
  }

  playBackgroundMusic() {
    if (!this.isEnabled) return;
    
    const bgm = this.sounds.background;
    if (bgm) {
      // 재생 전에 볼륨을 현재 설정으로 업데이트
      bgm.setVolume(this.musicVolume);
      console.log(`🎵 재생 전 볼륨 설정: ${Math.round(this.musicVolume * 100)}%`);
      
      bgm.play((success) => {
        if (success) {
          // 재생 성공 후 볼륨 다시 확인
          bgm.setVolume(this.musicVolume);
          console.log(`🎵 재생 후 볼륨 재설정: ${Math.round(this.musicVolume * 100)}%`);
          console.log('🎵 배경음악 재생 완료');
        } else {
          console.log('배경음악 재생 실패');
        }
      });
      this.currentBGM = bgm;
      console.log('🎵 배경음악 재생 시작');
    } else {
      console.warn('❌ 배경음악 파일이 로드되지 않음');
    }
  }

  pauseBackgroundMusic() {
    if (this.currentBGM) {
      this.currentBGM.pause();
      console.log('🎵 배경음악 일시정지');
    }
  }

  stopBackgroundMusic() {
    if (this.currentBGM) {
      this.currentBGM.stop(() => {
        // 정지 후 처음부터 재생할 수 있도록 준비
        this.currentBGM.setCurrentTime(0);
      });
      console.log('🎵 배경음악 정지');
    }
  }

  resumeBackgroundMusic() {
    if (this.currentBGM && this.isEnabled) {
      this.currentBGM.play();
      console.log('🎵 배경음악 재개');
    }
  }

  restartBackgroundMusic() {
    if (this.currentBGM) {
      // 현재 재생을 정지하고 처음부터 다시 재생
      this.currentBGM.stop(() => {
        this.currentBGM.setCurrentTime(0);
        if (this.isEnabled) {
          this.currentBGM.play();
        }
      });
      console.log('🎵 배경음악 처음부터 다시 재생');
    }
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    
    // 배경음악 볼륨 업데이트
    if (this.sounds.background) {
      this.sounds.background.setVolume(this.musicVolume);
      console.log(`🎵 배경음악 볼륨 설정: ${Math.round(this.musicVolume * 100)}% - 적용됨`);
    } else {
      console.warn('❌ 배경음악이 로드되지 않음 - 볼륨 설정 실패');
    }
    
    // currentBGM이 있으면 그것도 업데이트
    if (this.currentBGM && this.currentBGM !== this.sounds.background) {
      this.currentBGM.setVolume(this.musicVolume);
      console.log('🎵 currentBGM 볼륨도 업데이트');
    }
    
    console.log(`🎵 배경음악 볼륨 설정: ${Math.round(this.musicVolume * 100)}%`);
  }

  setEffectVolume(volume) {
    this.effectVolume = Math.max(0, Math.min(1, volume));
    console.log(`🔊 효과음 볼륨 설정: ${Math.round(this.effectVolume * 100)}%`);
  }

  getMusicVolume() {
    return this.musicVolume;
  }

  getEffectVolume() {
    return this.effectVolume;
  }

  // 하위 호환성을 위한 기존 메서드
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.setMusicVolume(volume);
    
    console.log(`🎵 볼륨 설정 (하위호환): ${this.volume * 100}%`);
  }

  getVolume() {
    return this.volume;
  }

  toggleEnabled() {
    this.isEnabled = !this.isEnabled;
    
    if (!this.isEnabled) {
      this.pauseBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
    
    console.log(`🔊 오디오 ${this.isEnabled ? '활성화' : '비활성화'}`);
    return this.isEnabled;
  }

  isAudioEnabled() {
    return this.isEnabled;
  }

  // 효과음 재생
  playEffect(effectName) {
    if (!this.isEnabled) return;
    
    // 효과음이 이미 로드되어 있는지 확인
    if (this.sounds[effectName]) {
      this.sounds[effectName].setVolume(this.effectVolume);
      this.sounds[effectName].play();
      console.log(`🔊 효과음 재생: ${effectName} (볼륨: ${Math.round(this.effectVolume * 100)}%)`);
      return;
    }
    
    // 새로운 효과음 로드 및 재생
    const sound = new Sound(`${effectName}.mp3`, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log(`효과음 ${effectName} 로드 실패:`, error);
        return;
      }
      
      sound.setVolume(this.effectVolume);
      sound.play((success) => {
        if (success) {
          console.log(`🔊 효과음 재생: ${effectName} (볼륨: ${Math.round(this.effectVolume * 100)}%)`);
        } else {
          console.log(`효과음 ${effectName} 재생 실패`);
        }
      });
      
      this.sounds[effectName] = sound;
    });
  }

  // 메뉴 모달 효과 (볼륨 10% 감소)
  enableUnderwaterEffect() {
    if (!this.isFilterActive) {
      this.originalVolume = this.musicVolume;
      const newVolume = this.musicVolume * 0.9; // 10% 감소 (90%로 설정)
      
      if (this.sounds.background) {
        this.sounds.background.setVolume(newVolume);
      }
      if (this.currentBGM && this.currentBGM !== this.sounds.background) {
        this.currentBGM.setVolume(newVolume);
      }
      
      this.isFilterActive = true;
      console.log('🔇 메뉴 모달 효과 활성화 (네이티브 - 볼륨 10% 감소)');
    }
  }

  // 메뉴 모달 효과 비활성화 (원래 볼륨으로 복원)
  disableUnderwaterEffect() {
    if (this.isFilterActive) {
      const originalVolume = this.originalVolume || this.musicVolume;
      
      if (this.sounds.background) {
        this.sounds.background.setVolume(originalVolume);
      }
      if (this.currentBGM && this.currentBGM !== this.sounds.background) {
        this.currentBGM.setVolume(originalVolume);
      }
      
      this.isFilterActive = false;
      console.log('🔊 메뉴 모달 효과 비활성화 (네이티브 - 볼륨 복원)');
    }
  }

  // 현재 필터 상태 확인
  isUnderwaterEffectActive() {
    return this.isFilterActive;
  }

  // 리소스 해제
  dispose() {
    this.stopBackgroundMusic();
    
    // 모든 사운드 리소스 해제
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.release();
      }
    });
    
    this.sounds = {};
    this.currentBGM = null;
    console.log('🔇 AudioService Native 리소스 해제');
  }
}

// 싱글톤 인스턴스
let audioServiceInstance = null;

export const getAudioService = () => {
  if (!audioServiceInstance) {
    audioServiceInstance = new AudioServiceNative();
  }
  return audioServiceInstance;
};

export const disposeAudioService = () => {
  if (audioServiceInstance) {
    audioServiceInstance.dispose();
    audioServiceInstance = null;
  }
};

export default audioServiceInstance || new AudioServiceNative();