/**
 * ===================================================================
 * AUDIO SERVICE - 웹용 오디오 서비스
 * ===================================================================
 */

class AudioServiceWeb {
  constructor() {
    this.audioElements = {};
    this.musicVolume = 0.5; // 배경음악 볼륨 (디폴트 50%)
    this.effectVolume = 0.5; // 효과음 볼륨
    this.isEnabled = true;
    this.currentBGM = null;
    this.audioContext = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.filterNode = null;
    this.isFilterActive = false;
    this.isWaitingForUserInteraction = false;
    this.initialize()
  }

  initialize() {
    try {
      console.log('🎵 AudioService Web 초기화 시작...')
      this.initializeAudioContext()
      this.loadBackgroundMusic()
      console.log('✅ AudioService Web 초기화 완료')
    } catch (error) {
      console.error('❌ AudioService Web 초기화 실패:', error)
      this.isEnabled = false;
    }
  }

  initializeAudioContext() {
    try {
      // Web Audio API 컨텍스트 초기화
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // 게인 노드 생성 (볼륨 조절용)
      this.gainNode = this.audioContext.createGain()
      this.gainNode.gain.value = this.musicVolume;
      
      // 로우패스 필터 노드 생성 (물속 효과용)
      this.filterNode = this.audioContext.createBiquadFilter()
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 22050; // 기본값: 필터 비활성화
      this.filterNode.Q.value = 1;
      
      // 오디오 그래프 연결: source -> filter -> gain -> destination
      this.filterNode.connect(this.gainNode)
      this.gainNode.connect(this.audioContext.destination)
      
      console.log('✅ Web Audio Context 초기화 완료')
    } catch (error) {
      console.warn('Web Audio Context 초기화 실패:', error)
      // 폴백: 기본 HTML Audio 사용
    }
  }

  loadBackgroundMusic() {
    try {
      // 웹에서는 webpack이 빌드한 정적 경로 사용
      const bgmPath = '/src/assets/audio/background.mp3';
      console.log('🎵 배경음악 경로:', bgmPath)
      
      const audio = new Audio(bgmPath)
      audio.loop = true;
      audio.volume = this.musicVolume;
      audio.crossOrigin = 'anonymous'; // CORS 설정
      
      // Web Audio API를 사용할 수 있는 경우 소스 노드 연결
      if (this.audioContext && this.filterNode) {
        audio.addEventListener('canplaythrough', () => {
          if (!this.sourceNode) {
            try {
              this.sourceNode = this.audioContext.createMediaElementSource(audio)
              this.sourceNode.connect(this.filterNode)
              console.log('✅ Web Audio API 소스 연결 완료')
            } catch (error) {
              console.warn('Web Audio API 소스 연결 실패:', error)
            }
          }
        })
      }
      
      // 오디오 로딩 에러 처리
      audio.addEventListener('error', (e) => {
        console.error('❌ 배경음악 로딩 에러:', e)
        console.log('🔧 시도한 경로:', bgmPath)
        console.log('🔧 에러 상세:', audio.error)
        this.isEnabled = false;
      })
      
      // 음악 로드 완료 시 볼륨 재설정
      audio.addEventListener('loadeddata', () => {
        audio.volume = this.musicVolume;
        console.log(`✅ 음악 로드 완료 후 볼륨 설정: ${Math.round(this.musicVolume * 100)}%`)
        console.log('🔧 오디오 상태:', {
          src: audio.src,
          readyState: audio.readyState,
          duration: audio.duration
        })
      })
      
      // 재생 시작 시 볼륨 재설정
      audio.addEventListener('play', () => {
        audio.volume = this.musicVolume;
        console.log(`🎵 재생 이벤트에서 볼륨 설정: ${Math.round(this.musicVolume * 100)}%`)
      })
      
      // 메타데이터 로드 완료
      audio.addEventListener('loadedmetadata', () => {
        console.log('✅ 음악 메타데이터 로드 완료, 길이:', audio.duration, '초')
      })
      
      // 로딩 중
      audio.addEventListener('loadstart', () => {
        console.log('🔄 음악 로딩 시작...')
      })
      
      this.audioElements.background = audio;
      
      console.log('✅ 배경음악 로드 성공')
    } catch (error) {
      console.warn('배경음악 로드 실패:', error)
      this.isEnabled = false;
    }
  }

  playBackgroundMusic() {
    console.log('🎵 playBackgroundMusic 호출됨')
    console.log('🔧 isEnabled:', this.isEnabled)
    console.log('🔧 audioElements.background:', !!this.audioElements.background)
    
    if (!this.isEnabled) {
      console.log('❌ 오디오가 비활성화되어 있음')
      return;
    }
    
    const bgm = this.audioElements.background;
    if (bgm) {
      console.log('🔧 bgm.paused:', bgm.paused)
      console.log('🔧 bgm.readyState:', bgm.readyState)
      console.log('🔧 bgm.src:', bgm.src)
      
      // 이미 재생 중이면 재생하지 않음
      if (!bgm.paused) {
        console.log('🎵 배경음악 이미 재생 중')
        // 재생 중이어도 볼륨은 현재 설정으로 업데이트
        bgm.volume = this.musicVolume;
        return;
      }
      
      // 재생 전에 볼륨을 먼저 설정
      bgm.volume = this.musicVolume;
      console.log(`🎵 재생 전 볼륨 설정: ${Math.round(this.musicVolume * 100)}%`)
      
      const playPromise = bgm.play()
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // 재생 성공 후 볼륨 다시 확인
          bgm.volume = this.musicVolume;
          console.log(`🎵 재생 후 볼륨 재설정: ${Math.round(this.musicVolume * 100)}%`)
          console.log('✅ 배경음악 재생 성공')
        }).catch(error => {
          console.error('❌ 배경음악 재생 실패:', error)
          console.log('🔧 에러 타입:', error.name)
          console.log('🔧 에러 메시지:', error.message)
          
          // 브라우저 자동재생 정책으로 인한 실패 처리
          if (error.name === 'NotAllowedError') {
            console.log('💡 브라우저 자동재생 정책으로 인한 차단 - 사용자 상호작용 필요')
            // 사용자 상호작용 후 재생을 위해 대기 상태로 설정
            this.isWaitingForUserInteraction = true;
          }
        })
      }
      
      this.currentBGM = bgm;
      console.log('🎵 배경음악 재생 시작 요청')
    } else {
      console.error('❌ 배경음악 파일이 로드되지 않음')
      console.log('🔧 현재 audioElements:', Object.keys(this.audioElements))
    }
  }

  pauseBackgroundMusic() {
    if (this.currentBGM) {
      this.currentBGM.pause()
      console.log('🎵 배경음악 일시정지')
    }
  }

  stopBackgroundMusic() {
    if (this.currentBGM) {
      this.currentBGM.pause()
      this.currentBGM.currentTime = 0;
      console.log('🎵 배경음악 정지')
    }
  }

  resumeBackgroundMusic() {
    if (this.currentBGM && this.isEnabled) {
      this.currentBGM.play().catch(error => {
        console.log('Background music resume failed:', error)
      })
      console.log('🎵 배경음악 재개')
    }
  }

  restartBackgroundMusic() {
    if (this.currentBGM) {
      // 현재 재생 위치를 처음으로 되돌리고 재생
      this.currentBGM.currentTime = 0;
      if (this.isEnabled) {
        this.currentBGM.play().catch(error => {
          console.log('Background music restart failed:', error)
        })
      }
      console.log('🎵 배경음악 처음부터 다시 재생')
    }
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    
    // 배경음악 볼륨 업데이트
    if (this.audioElements.background) {
      // 볼륨을 여러 번 시도해서 확실히 적용되도록 함
      const targetVolume = this.musicVolume;
      this.audioElements.background.volume = targetVolume;
      
      // 브라우저 호환성을 위해 잠깐 후에 다시 설정
      setTimeout(() => {
        if (this.audioElements.background) {
          this.audioElements.background.volume = targetVolume;
          console.log(`🎵 배경음악 볼륨 재설정: ${Math.round(targetVolume * 100)}%`)
        }
      }, 50)
      
      console.log(`🎵 배경음악 볼륨 설정: ${Math.round(this.musicVolume * 100)}% - 적용됨`)
      console.log('🎵 배경음악 상태:', {
        paused: this.audioElements.background.paused,
        currentTime: this.audioElements.background.currentTime,
        duration: this.audioElements.background.duration,
        volume: this.audioElements.background.volume,
        readyState: this.audioElements.background.readyState,
        src: this.audioElements.background.src
      })
    } else {
      console.warn('❌ 배경음악 요소가 없음 - 볼륨 설정 실패')
      console.log('🎵 현재 audioElements:', Object.keys(this.audioElements))
    }
    
    // currentBGM이 있으면 그것도 업데이트
    if (this.currentBGM && this.currentBGM !== this.audioElements.background) {
      this.currentBGM.volume = this.musicVolume;
      console.log('🎵 currentBGM 볼륨도 업데이트')
    }
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
    this.setMusicVolume(volume)
  }

  getVolume() {
    return this.musicVolume;
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
  playEffect(effectName) {
    if (!this.isEnabled) return;
    
    try {
      const effectPath = `/src/assets/audio/${effectName}.mp3`;
      const audio = new Audio(effectPath)
      audio.volume = this.effectVolume;
      audio.play().catch(error => {
        console.log(`효과음 ${effectName} 재생 실패:`, error)
      })
      
      console.log(`🔊 효과음 재생: ${effectName} (볼륨: ${Math.round(this.effectVolume * 100)}%)`)
    } catch (error) {
      console.error(`효과음 ${effectName} 로드 실패:`, error)
    }
  }

  // 메뉴 모달 효과 (볼륨 15% 감소 + 먹먹함 효과)
  enableUnderwaterEffect() {
    console.log('🎵 enableUnderwaterEffect 호출됨')
    console.log('🔍 현재 상태:', {
      hasGainNode: !!this.gainNode,
      hasAudioContext: !!this.audioContext,
      isFilterActive: this.isFilterActive,
      hasFilterNode: !!this.filterNode,
      currentVolume: this.musicVolume,
      bgmPlaying: this.currentBGM && !this.currentBGM.paused
    })
    
    if (!this.isFilterActive) {
      try {
        // 볼륨을 15% 감소 (85%로 설정)
        const targetVolume = this.musicVolume * 0.85;
        console.log(`🔇 볼륨 변경: ${this.musicVolume} → ${targetVolume}`)
        
        // HTML Audio 요소에 직접 볼륨 적용
        if (this.currentBGM) {
          this.currentBGM.volume = targetVolume;
          console.log('🔇 HTML Audio 볼륨 직접 적용됨')
        }
        
        // Web Audio API 사용 가능한 경우
        if (this.gainNode && this.audioContext) {
          this.gainNode.gain.setTargetAtTime(targetVolume, this.audioContext.currentTime, 0.3)
          console.log('🔇 Web Audio API 게인 노드 볼륨 적용됨')
          
          // 로우패스 필터로 먹먹함 효과 추가 (더 강한 효과)
          if (this.filterNode) {
            this.filterNode.frequency.setTargetAtTime(400, this.audioContext.currentTime, 0.2)
            this.filterNode.Q.setTargetAtTime(10, this.audioContext.currentTime, 0.2)
            console.log('🔇 로우패스 필터 적용됨 (400Hz, Q:10)')
          }
        }
        
        this.isFilterActive = true;
        console.log('🔇 메뉴 모달 효과 활성화 완료 (볼륨 15% 감소 + 먹먹함 효과)')
      } catch (error) {
        console.error('❌ 메뉴 모달 효과 활성화 실패:', error)
      }
    } else {
      console.log('⚠️ 필터가 이미 활성화되어 있음')
    }
  }

  // 메뉴 모달 효과 비활성화 (원래 볼륨으로 복원)
  disableUnderwaterEffect() {
    console.log('🎵 disableUnderwaterEffect 호출됨')
    console.log('🔍 현재 상태:', {
      isFilterActive: this.isFilterActive,
      currentVolume: this.musicVolume
    })
    
    if (this.isFilterActive) {
      try {
        // HTML Audio 요소에 직접 볼륨 복원
        if (this.currentBGM) {
          this.currentBGM.volume = this.musicVolume;
          console.log('🔊 HTML Audio 볼륨 직접 복원됨')
        }
        
        // Web Audio API 사용 가능한 경우
        if (this.gainNode && this.audioContext) {
          // 볼륨을 원래대로 복원 (재생 상태는 유지)
          this.gainNode.gain.setTargetAtTime(this.musicVolume, this.audioContext.currentTime, 0.3)
          console.log('🔊 Web Audio API 게인 노드 볼륨 복원됨')
          
          // 필터를 원래 상태로 복원 (먹먹함 효과 제거)
          if (this.filterNode) {
            this.filterNode.frequency.setTargetAtTime(22050, this.audioContext.currentTime, 0.3)
            this.filterNode.Q.setTargetAtTime(1, this.audioContext.currentTime, 0.3)
            console.log('🔊 로우패스 필터 해제됨')
          }
        }
        
        this.isFilterActive = false;
        console.log('🔊 메뉴 모달 효과 비활성화 완료 (볼륨 복원 + 먹먹함 효과 제거)')
      } catch (error) {
        console.error('❌ 메뉴 모달 효과 비활성화 실패:', error)
      }
    } else {
      console.log('⚠️ 필터가 이미 비활성화되어 있음')
    }
  }

  // 현재 필터 상태 확인
  isUnderwaterEffectActive() {
    return this.isFilterActive;
  }

  // 사용자 상호작용 후 오디오 재생 시도
  tryPlayAfterUserInteraction() {
    if (this.isWaitingForUserInteraction && this.isEnabled) {
      console.log('🎵 사용자 상호작용 감지 - 배경음악 재생 시도')
      this.isWaitingForUserInteraction = false;
      this.playBackgroundMusic()
    }
  }

  // 리소스 해제
  dispose() {
    this.stopBackgroundMusic()
    this.audioElements = {};
    this.currentBGM = null;
    console.log('🔇 AudioService Web 리소스 해제')
  }
}

// 싱글톤 인스턴스
let audioServiceInstance = null;

const getAudioService = () => {
  if (!audioServiceInstance) {
    audioServiceInstance = new AudioServiceWeb()
  }
  return audioServiceInstance;
};

const disposeAudioService = () => {
  if (audioServiceInstance) {
    audioServiceInstance.dispose()
    audioServiceInstance = null;
  }
};

export default audioServiceInstance || new AudioServiceWeb();
export { getAudioService, disposeAudioService };
