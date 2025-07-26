/**
 * Mock DebuggingOverlayNativeComponent
 * React Native 0.79.5의 타입 에러를 우회하기 위한 Mock 컴포넌트
 * 개발용 디버깅 기능은 유지하되 $ReadOnlyArray 타입 에러만 해결
 */

// React Native의 requireNativeComponent 사용
let requireNativeComponent;
try {
  requireNativeComponent = require('react-native').requireNativeComponent;
} catch (e) {
  requireNativeComponent = () => null;
}

// Mock Commands 구현
const MockCommands = {
  highlightTraceUpdates: function(viewTag, updates) {
    // 타입 에러를 피하기 위해 updates를 일반 배열로 변환
    const safeUpdates = Array.isArray(updates) ? updates : [];
    
    if (__DEV__) {
      // 개발 모드에서만 실제 디버깅 로직 실행
      try {
        // 실제 네이티브 컴포넌트 호출 시도
        const RealComponent = requireNativeComponent('RCTDebuggingOverlay')
        if (RealComponent && RealComponent.Commands && RealComponent.Commands.highlightTraceUpdates) {
          RealComponent.Commands.highlightTraceUpdates(viewTag, safeUpdates)
        }
      } catch (error) {
        // 네이티브 컴포넌트가 없거나 에러 발생 시 무시
        console.log('[DebuggingOverlay] Native component not available, skipping highlight')
      }
    }
  },
  
  highlightElements: function(viewTag, elements) {
    const safeElements = Array.isArray(elements) ? elements : [];
    
    if (__DEV__) {
      try {
        const RealComponent = requireNativeComponent('RCTDebuggingOverlay')
        if (RealComponent && RealComponent.Commands && RealComponent.Commands.highlightElements) {
          RealComponent.Commands.highlightElements(viewTag, safeElements)
        }
      } catch (error) {
        console.log('[DebuggingOverlay] Native component not available, skipping highlight elements')
      }
    }
  },
  
  clearElementsHighlights: function(viewTag) {
    if (__DEV__) {
      try {
        const RealComponent = requireNativeComponent('RCTDebuggingOverlay')
        if (RealComponent && RealComponent.Commands && RealComponent.Commands.clearElementsHighlights) {
          RealComponent.Commands.clearElementsHighlights(viewTag)
        }
      } catch (error) {
        console.log('[DebuggingOverlay] Native component not available, skipping clear highlights')
      }
    }
  }
};

// Mock 네이티브 컴포넌트 생성
const MockNativeComponent = {
  Commands: MockCommands,
  displayName: 'RCTDebuggingOverlay',
  propTypes: {},
  defaultProps: {},
  render: function() { return null; }
};

// CommonJS export만 사용
export default MockNativeComponent;