# 🎵 배경음악 가이드

## 📁 음악 파일 추가 방법

1. **음악 파일을 이 폴더에 추가하세요:**
   - `background.mp3` (권장)
   - `background.ogg` (대체용)
   - `background.wav` (대체용)

2. **지원 형식:**
   - MP3 (가장 호환성 좋음)
   - OGG (Firefox에서 권장)
   - WAV (용량이 크지만 품질 좋음)

3. **권장 설정:**
   - 길이: 1-3분 (루프 재생됨)
   - 비트레이트: 128kbps (용량과 품질의 균형)
   - 볼륨: 적당한 크기 (코드에서 30%로 재생됨)

## 🎮 게임에서 사용법

### 기본 사용:
```javascript
// 자동으로 background.mp3 파일을 찾아서 재생
audioManager.startBackgroundMusic();

// 음악 정지
audioManager.stopBackgroundMusic();
```

### 고급 사용:
```javascript
// 볼륨 조절 (0.0 ~ 1.0)
audioManager.setMusicVolume(0.5);

// 다른 음악으로 변경
audioManager.changeBackgroundMusic('./assets/audio/다른음악.mp3');
```

## 🎼 음악 추천

게임에 어울리는 음악 스타일:
- **캐주얼 게임 BGM**: 밝고 경쾌한 분위기
- **로파이(Lo-fi)**: 집중하기 좋은 차분한 음악
- **치프튠(Chiptune)**: 레트로 게임 느낌
- **어쿠스틱**: 편안하고 따뜻한 분위기

## 🔧 문제 해결

### 음악이 재생되지 않을 때:
1. 파일 경로가 정확한지 확인
2. 파일 형식이 지원되는지 확인
3. 브라우저 콘솔에서 오류 메시지 확인
4. 파일이 없으면 자동으로 신시사이저 음악으로 대체됨

### 브라우저별 지원 형식:
- **Chrome/Edge**: MP3, OGG, WAV
- **Firefox**: OGG, WAV (MP3도 가능)
- **Safari**: MP3, WAV

## 📄 라이센스 주의사항

음악 파일을 사용할 때는 저작권을 확인하세요:
- 무료 음악 사이트: Freesound, Zapsplat, YouTube Audio Library
- 로열티 프리 음악: Epidemic Sound, AudioJungle
- 직접 제작한 음악 사용 권장