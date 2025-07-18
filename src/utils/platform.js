import { Platform, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 플랫폼 감지 유틸리티
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

// 플랫폼별 조건부 실행
export const platformSelect = (config) => {
  if (config.web && isWeb) return config.web;
  if (config.ios && isIOS) return config.ios;
  if (config.android && isAndroid) return config.android;
  if (config.mobile && isMobile) return config.mobile;
  return config.default || null;
};

// 플랫폼별 스타일 적용
export const platformStyle = (webStyle = {}, mobileStyle = {}) => {
  return isWeb ? webStyle : mobileStyle;
};

// 플랫폼별 컴포넌트 로드 (동적 import 제거)
// 동적 import는 Metro에서 지원하지 않으므로 제거
// 필요한 경우 각 컴포넌트에서 직접 import 사용
export const loadPlatformComponent = (componentName) => {
  console.warn('loadPlatformComponent is deprecated. Use direct imports instead.');
  return null;
};

// 플랫폼별 서비스 로드 (동적 import 제거)
// 동적 import는 Metro에서 지원하지 않으므로 제거
// 필요한 경우 각 서비스에서 직접 import 사용
export const loadPlatformService = (serviceName) => {
  console.warn('loadPlatformService is deprecated. Use direct imports instead.');
  return null;
};

// 터치/클릭 이벤트 통합
export const createTouchHandler = (handler) => {
  return isWeb ? { onClick: handler } : { onPress: handler };
};

// 플랫폼별 스토리지 wrapper
export const createStorage = () => {
  if (isWeb) {
    return {
      async getItem(key) {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error('Storage getItem error:', error);
          return null;
        }
      },
      async setItem(key, value) {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (error) {
          console.error('Storage setItem error:', error);
          return false;
        }
      },
      async removeItem(key) {
        try {
          localStorage.removeItem(key);
          return true;
        } catch (error) {
          console.error('Storage removeItem error:', error);
          return false;
        }
      },
    };
  } else {
    // 모바일에서는 AsyncStorage 사용
    return AsyncStorage;
  }
};

// 플랫폼별 네비게이션 처리
export const createNavigation = (navigation) => {
  if (isWeb) {
    return {
      navigate: (screen, params) => {
        // 웹에서는 URL 기반 네비게이션 또는 상태 관리
        if (typeof navigation?.navigate === 'function') {
          navigation.navigate(screen, params);
        } else {
          console.log(`Navigate to ${screen}`, params);
        }
      },
      goBack: () => {
        if (typeof navigation?.goBack === 'function') {
          navigation.goBack();
        } else {
          window.history.back();
        }
      },
    };
  } else {
    return navigation;
  }
};

// 플랫폼별 알림 처리
export const showAlert = (title, message, buttons = []) => {
  if (isWeb) {
    if (buttons.length === 0) {
      alert(`${title}\n${message}`);
    } else if (buttons.length === 1) {
      alert(`${title}\n${message}`);
      if (buttons[0].onPress) buttons[0].onPress();
    } else {
      const result = confirm(`${title}\n${message}`);
      if (result && buttons[1]?.onPress) {
        buttons[1].onPress();
      } else if (!result && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};

// 플랫폼별 차원 정보
export const getDimensions = () => {
  if (isWeb) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  } else {
    return Dimensions.get('window');
  }
};

// 플랫폼별 상태 표시줄 높이
export const getStatusBarHeight = () => {
  if (isWeb) {
    return 0;
  } else {
    // react-native-status-bar-height는 설치되지 않았으므로 기본값 사용
    return Platform.OS === 'ios' ? 20 : 0;
  }
};

// 플랫폼별 안전 영역 여백
export const getSafeAreaInsets = () => {
  if (isWeb) {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  } else {
    // react-native-safe-area-context는 훅이므로 기본값 사용
    return { top: getStatusBarHeight(), bottom: 0, left: 0, right: 0 };
  }
};