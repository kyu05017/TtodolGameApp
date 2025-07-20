/**
 * ===================================================================
 * AUDIO SERVICE - 웹용 오디오 서비스 엔트리 포인트
 * ===================================================================
 * 
 * 웹 환경에서만 사용되는 오디오 서비스입니다.
 */

// 웹 환경에서는 웹 전용 모듈을 직접 import
export { getAudioService, disposeAudioService } from './AudioService.web.js';
export { default } from './AudioService.web.js';