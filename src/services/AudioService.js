/**
 * ===================================================================
 * AUDIO SERVICE - 플랫폼별 오디오 서비스 엔트리 포인트
 * ===================================================================
 * 
 * 이 파일은 플랫폼에 따라 적절한 AudioService 구현체를 export합니다.
 * - 웹: AudioService.web.js (Web Audio API 사용)
 * - 네이티브: AudioService.native.js (react-native-sound 사용)
 */

import { Platform } from 'react-native';

// 플랫폼별 동적 import
let AudioServiceImplementation;
let getAudioService;
let disposeAudioService;

if (Platform.OS === 'web') {
  // 웹 환경
  const webModule = require('./AudioService.web');
  AudioServiceImplementation = webModule.default;
  getAudioService = webModule.getAudioService;
  disposeAudioService = webModule.disposeAudioService;
} else {
  // React Native 환경
  const nativeModule = require('./AudioService.native');
  AudioServiceImplementation = nativeModule.default;
  getAudioService = nativeModule.getAudioService;
  disposeAudioService = nativeModule.disposeAudioService;
}

export { getAudioService, disposeAudioService };
export default AudioServiceImplementation;