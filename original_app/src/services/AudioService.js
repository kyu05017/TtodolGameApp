/**
 * ===================================================================
 * AUDIO SERVICE - 플랫폼별 오디오 서비스 엔트리 포인트
 * ===================================================================
 * 
 * React Native의 플랫폼별 파일 해상도를 사용합니다:
 * - AudioService.native.js: React Native 앱용
 * - AudioService.web.js: 웹용
 */

// React Native에서는 네이티브 구현을 사용
export * from './AudioService.native';