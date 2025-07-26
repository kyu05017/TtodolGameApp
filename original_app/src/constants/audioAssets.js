/**
 * ===================================================================
 * AUDIO ASSETS - 오디오 리소스 관리
 * ===================================================================
 */

// 오디오 파일들 - 임시로 null 사용 (오디오 파일이 없음)
const AUDIO_FILES = {
  background: null
};

// 오디오 경로 생성 함수
const getAudioPath = (audioName) => {
  return AUDIO_FILES[audioName] || null;
};

// 웹 환경에서 사용할 오디오 URL 생성
const getAudioURL = (audioName) => {
  // 현재 오디오 파일이 없으므로 기본 경로만 반환
  if (audioName === 'background') {
    return '/src/assets/audio/background.mp3';
  }
  
  const audioFile = AUDIO_FILES[audioName];
  if (!audioFile) return null;
  
  // 웹 환경에서는 파일 경로를 직접 사용
  return audioFile;
};

// Convert to CommonJS
export {
  AUDIO_FILES,
  getAudioPath,
  getAudioURL
};
