/**
 * ===================================================================
 * AUDIO ASSETS - 오디오 리소스 관리
 * ===================================================================
 */

type AudioKey = "background" | string;

const AUDIO_FILES: Record<AudioKey, string | null> = {
  background: null,
};

// 오디오 경로 생성 함수
const getAudioPath = (audioName: AudioKey): string | null => {
  return AUDIO_FILES[audioName] || null;
};

// 웹 환경에서 사용할 오디오 URL 생성
const getAudioURL = (audioName: AudioKey): string | null => {
  if (audioName === "background") {
    return "/src/assets/audio/background.mp3";
  }

  const audioFile = AUDIO_FILES[audioName];
  if (!audioFile) return null;

  return audioFile;
};

export { AUDIO_FILES, getAudioPath, getAudioURL };