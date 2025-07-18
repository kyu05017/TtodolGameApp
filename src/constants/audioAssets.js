/**
 * ===================================================================
 * AUDIO ASSETS - 오디오 리소스 관리
 * ===================================================================
 */

// 오디오 파일들
export const AUDIO_FILES = {
  background: require('../assets/audio/background.mp3')
};

// 오디오 경로 생성 함수
export const getAudioPath = (audioName) => {
  return AUDIO_FILES[audioName] || null;
};

// 웹 환경에서 사용할 오디오 URL 생성
export const getAudioURL = (audioName) => {
  const audioFile = AUDIO_FILES[audioName];
  if (!audioFile) return null;
  
  // 웹 환경에서는 파일 경로를 직접 사용
  return audioFile;
};