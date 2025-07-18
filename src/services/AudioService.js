/**
 * ===================================================================
 * AUDIO SERVICE - 오디오 관리 서비스 (웹 버전)
 * ===================================================================
 */

import { getAudioURL } from '../constants/audioAssets';

class AudioService {
  constructor() {
    this.audioElements = {};
    this.volume = 0.5;
    this.isEnabled = true;
    this.currentBGM = null;
    this.initialize();
  }

  initialize() {
    // 배경음악 초기화
    this.loadBackgroundMusic();
  }

  loadBackgroundMusic() {
    try {
      // 웹 환경에서는 직접 audio 경로 사용
      const bgmPath = '/src/assets/audio/background.mp3';
      const audio = new Audio(bgmPath);
      audio.loop = true;
      audio.volume = this.volume * 0.3; // 배경음악은 좀 더 작게
      this.audioElements.background = audio;
      
      console.log('✅ 배경음악 로드 성공');
    } catch (error) {
      console.warn('배경음악 로드 실패:', error);
    }
  }

  playBackgroundMusic() {
    if (!this.isEnabled) return;
    
    const bgm = this.audioElements.background;
    if (bgm) {
      bgm.play().catch(error => {
        console.log('Background music play failed:', error);
      });
      this.currentBGM = bgm;
      console.log('🎵 배경음악 재생 시작');
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
      this.currentBGM.pause();
      this.currentBGM.currentTime = 0;
      console.log('🎵 배경음악 정지');
    }
  }

  resumeBackgroundMusic() {
    if (this.currentBGM && this.isEnabled) {
      this.currentBGM.play().catch(error => {
        console.log('Background music resume failed:', error);
      });
      console.log('🎵 배경음악 재개');
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // 모든 오디오 요소의 볼륨 업데이트
    Object.values(this.audioElements).forEach(audio => {
      if (audio) {
        audio.volume = this.volume * 0.3;
      }
    });
    
    console.log(`🎵 볼륨 설정: ${this.volume * 100}%`);
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

  // 효과음 재생 (미래 확장용)
  playEffect(effectName) {
    if (!this.isEnabled) return;
    
    // 효과음 재생 로직
    console.log(`🔊 효과음 재생: ${effectName}`);
  }

  // 리소스 해제
  dispose() {
    this.stopBackgroundMusic();
    this.audioElements = {};
    this.currentBGM = null;
    console.log('🔇 AudioService 리소스 해제');
  }
}

// 싱글톤 인스턴스
let audioServiceInstance = null;

export const getAudioService = () => {
  if (!audioServiceInstance) {
    audioServiceInstance = new AudioService();
  }
  return audioServiceInstance;
};

export const disposeAudioService = () => {
  if (audioServiceInstance) {
    audioServiceInstance.dispose();
    audioServiceInstance = null;
  }
};

export default audioServiceInstance || new AudioService();