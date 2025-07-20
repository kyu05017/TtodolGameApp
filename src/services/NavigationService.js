import React from 'react';
import { createNavigation } from '../utils/platform';

class NavigationService {
  constructor() {
    this.currentScreen = 'MainScreen';
    this.history = ['MainScreen'];
    this.listeners = [];
    this.params = {};
  }

  // 네비게이션 상태 변경 리스너 등록
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // 상태 변경 알림
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        currentScreen: this.currentScreen,
        history: [...this.history],
        params: { ...this.params }
      });
    });
  }

  // 화면 이동
  navigate(screenName, params = {}) {
    console.log(`🧭 네비게이션: ${this.currentScreen} → ${screenName}`, params);
    
    this.currentScreen = screenName;
    this.params = params;
    
    // 히스토리 관리 (같은 화면 중복 방지)
    if (this.history[this.history.length - 1] !== screenName) {
      this.history.push(screenName);
    }
    
    this.notifyListeners();
  }

  // 뒤로 가기
  goBack() {
    if (this.history.length > 1) {
      this.history.pop(); // 현재 화면 제거
      const previousScreen = this.history[this.history.length - 1];
      
      console.log(`🔙 뒤로 가기: ${this.currentScreen} → ${previousScreen}`);
      
      this.currentScreen = previousScreen;
      this.params = {};
      
      this.notifyListeners();
    } else {
      console.log('🚫 뒤로 갈 화면이 없습니다');
    }
  }

  // 히스토리 초기화 후 이동 (홈으로 가기)
  reset(screenName = 'MainScreen') {
    console.log(`🏠 홈으로 이동: ${screenName}`);
    
    this.currentScreen = screenName;
    this.history = [screenName];
    this.params = {};
    
    this.notifyListeners();
  }

  // 현재 화면 정보 반환
  getCurrentScreen() {
    return {
      name: this.currentScreen,
      params: this.params
    };
  }

  // 뒤로 갈 수 있는지 확인
  canGoBack() {
    return this.history.length > 1;
  }

  // 특정 화면이 현재 활성 상태인지 확인
  isCurrentScreen(screenName) {
    return this.currentScreen === screenName;
  }

  // 네비게이션 객체 생성 (React Navigation API 호환)
  createNavigationObject() {
    return {
      navigate: (screenName, params) => this.navigate(screenName, params),
      goBack: () => this.goBack(),
      reset: (screenName) => this.reset(screenName),
      canGoBack: () => this.canGoBack(),
      isFocused: () => true,
      addListener: (eventName, callback) => {
        if (eventName === 'focus' || eventName === 'state') {
          return this.addListener(callback);
        }
        return () => {}; // 더미 제거 함수
      },
      getState: () => ({
        index: this.history.length - 1,
        routes: this.history.map(screen => ({ name: screen }))
      })
    };
  }
}

// 싱글톤 인스턴스
const navigationService = new NavigationService();

export default navigationService;

// 네비게이션 훅 (React 컴포넌트에서 사용)
export const useNavigation = () => {
  const [state, setState] = React.useState({
    currentScreen: navigationService.currentScreen,
    history: [...navigationService.history],
    params: { ...navigationService.params }
  });

  React.useEffect(() => {
    const unsubscribe = navigationService.addListener(setState);
    return unsubscribe;
  }, []);

  return {
    ...navigationService.createNavigationObject(),
    state
  };
};

// 컴포넌트에서 바로 사용할 수 있는 네비게이션 객체
export const getNavigation = () => navigationService.createNavigationObject();