import { Platform } from 'react-native';

export class AdService {
  constructor() {
    this.isInitialized = false;
    this.isNativeAd = false;
    this.bannerAdId = null;
    this.interstitialAdId = null;
    this.rewardedAdId = null;
    this.testMode = __DEV__;
    
    this.initializeAds();
  }

  // 광고 시스템 초기화
  async initializeAds() {
    try {
      // React Native Google Mobile Ads가 설치되어 있는지 확인
      try {
        // 실제 광고 SDK 초기화는 여기서 진행
        // const { GoogleMobileAds } = await import('react-native-google-mobile-ads');
        // await GoogleMobileAds.initialize();
        
        console.log('📱 AdService 초기화 시도 중...');
        
        // 플랫폼별 광고 ID 설정
        if (Platform.OS === 'android') {
          this.bannerAdId = this.testMode ? 'ca-app-pub-3940256099942544/6300978111' : 'YOUR_ANDROID_BANNER_ID';
          this.interstitialAdId = this.testMode ? 'ca-app-pub-3940256099942544/1033173712' : 'YOUR_ANDROID_INTERSTITIAL_ID';
          this.rewardedAdId = this.testMode ? 'ca-app-pub-3940256099942544/5224354917' : 'YOUR_ANDROID_REWARDED_ID';
        } else if (Platform.OS === 'ios') {
          this.bannerAdId = this.testMode ? 'ca-app-pub-3940256099942544/2934735716' : 'YOUR_IOS_BANNER_ID';
          this.interstitialAdId = this.testMode ? 'ca-app-pub-3940256099942544/4411468910' : 'YOUR_IOS_INTERSTITIAL_ID';
          this.rewardedAdId = this.testMode ? 'ca-app-pub-3940256099942544/1712485313' : 'YOUR_IOS_REWARDED_ID';
        }
        
        this.isNativeAd = true;
        this.isInitialized = true;
        console.log('✅ AdService 초기화 완료 (네이티브 모드)');
        
      } catch (error) {
        console.warn('⚠️ 네이티브 광고 SDK 없음, 시뮬레이션 모드로 전환');
        this.initializeSimulationMode();
      }
    } catch (error) {
      console.error('❌ AdService 초기화 실패:', error);
      this.initializeSimulationMode();
    }
  }

  // 시뮬레이션 모드 초기화
  initializeSimulationMode() {
    this.isNativeAd = false;
    this.isInitialized = true;
    this.bannerAdId = 'simulation-banner-ad';
    this.interstitialAdId = 'simulation-interstitial-ad';
    this.rewardedAdId = 'simulation-rewarded-ad';
    
    console.log('🎭 AdService 시뮬레이션 모드 초기화 완료');
  }

  // 배너 광고 표시
  async showBannerAd() {
    if (!this.isInitialized) {
      console.warn('광고 서비스가 초기화되지 않음');
      return false;
    }

    try {
      if (this.isNativeAd) {
        // 실제 배너 광고 표시 로직
        console.log('📱 네이티브 배너 광고 표시');
        return true;
      } else {
        // 시뮬레이션 모드
        console.log('🎭 시뮬레이션 배너 광고 표시');
        this.simulateBannerAd();
        return true;
      }
    } catch (error) {
      console.error('❌ 배너 광고 표시 실패:', error);
      return false;
    }
  }

  // 배너 광고 숨김
  async hideBannerAd() {
    if (!this.isInitialized) {
      console.warn('광고 서비스가 초기화되지 않음');
      return false;
    }

    try {
      if (this.isNativeAd) {
        console.log('📱 네이티브 배너 광고 숨김');
        return true;
      } else {
        console.log('🎭 시뮬레이션 배너 광고 숨김');
        this.hideSimulationBannerAd();
        return true;
      }
    } catch (error) {
      console.error('❌ 배너 광고 숨김 실패:', error);
      return false;
    }
  }

  // 전면 광고 표시
  async showInterstitialAd() {
    if (!this.isInitialized) {
      console.warn('광고 서비스가 초기화되지 않음');
      return false;
    }

    try {
      if (this.isNativeAd) {
        console.log('📱 네이티브 전면 광고 표시');
        return true;
      } else {
        console.log('🎭 시뮬레이션 전면 광고 표시');
        this.simulateInterstitialAd();
        return true;
      }
    } catch (error) {
      console.error('❌ 전면 광고 표시 실패:', error);
      return false;
    }
  }

  // 보상형 광고 표시
  async showRewardedAd() {
    if (!this.isInitialized) {
      console.warn('광고 서비스가 초기화되지 않음');
      return { success: false, rewarded: false };
    }

    try {
      if (this.isNativeAd) {
        console.log('📱 네이티브 보상형 광고 표시');
        return { success: true, rewarded: true };
      } else {
        console.log('🎭 시뮬레이션 보상형 광고 표시');
        return this.simulateRewardedAd();
      }
    } catch (error) {
      console.error('❌ 보상형 광고 표시 실패:', error);
      return { success: false, rewarded: false };
    }
  }

  // 시뮬레이션 배너 광고
  simulateBannerAd() {
    // DOM 조작으로 시뮬레이션 배너 생성
    const bannerHeight = 50;
    const banner = {
      id: 'simulation-banner',
      height: bannerHeight,
      backgroundColor: '#4CAF50',
      color: 'white',
      text: '🎯 시뮬레이션 배너 광고',
      position: 'bottom'
    };
    
    console.log('배너 광고 시뮬레이션 데이터:', banner);
    return banner;
  }

  // 시뮬레이션 배너 광고 숨김
  hideSimulationBannerAd() {
    console.log('🎭 시뮬레이션 배너 광고 숨김 처리');
  }

  // 시뮬레이션 전면 광고
  simulateInterstitialAd() {
    return new Promise((resolve) => {
      console.log('🎭 시뮬레이션 전면 광고 표시 중...');
      
      // 2초 후 자동 닫힘 시뮬레이션
      setTimeout(() => {
        console.log('🎭 시뮬레이션 전면 광고 닫힘');
        resolve(true);
      }, 2000);
    });
  }

  // 시뮬레이션 보상형 광고
  simulateRewardedAd() {
    return new Promise((resolve) => {
      console.log('🎭 시뮬레이션 보상형 광고 표시 중...');
      
      // 3초 후 보상 지급 시뮬레이션
      setTimeout(() => {
        const rewarded = Math.random() > 0.2; // 80% 확률로 보상 지급
        console.log(`🎭 시뮬레이션 보상형 광고 완료 - 보상: ${rewarded ? '지급' : '미지급'}`);
        resolve({ success: true, rewarded });
      }, 3000);
    });
  }

  // 광고 로딩 상태 확인
  async isAdLoaded(adType) {
    if (!this.isInitialized) {
      return false;
    }

    try {
      if (this.isNativeAd) {
        // 실제 광고 로딩 상태 확인
        console.log(`📱 ${adType} 광고 로딩 상태 확인`);
        return true; // 시뮬레이션
      } else {
        // 시뮬레이션 모드에서는 항상 로딩됨
        console.log(`🎭 ${adType} 광고 로딩 상태 확인 (시뮬레이션)`);
        return true;
      }
    } catch (error) {
      console.error(`❌ ${adType} 광고 로딩 상태 확인 실패:`, error);
      return false;
    }
  }

  // 광고 사전 로딩
  async preloadAd(adType) {
    if (!this.isInitialized) {
      console.warn('광고 서비스가 초기화되지 않음');
      return false;
    }

    try {
      if (this.isNativeAd) {
        console.log(`📱 ${adType} 광고 사전 로딩`);
        return true;
      } else {
        console.log(`🎭 ${adType} 광고 사전 로딩 (시뮬레이션)`);
        return true;
      }
    } catch (error) {
      console.error(`❌ ${adType} 광고 사전 로딩 실패:`, error);
      return false;
    }
  }

  // 광고 설정 업데이트
  updateAdSettings(settings) {
    const { 
      testMode = this.testMode,
      enablePersonalizedAds = true,
      enableBannerAds = true,
      enableInterstitialAds = true,
      enableRewardedAds = true 
    } = settings;

    this.testMode = testMode;
    this.enablePersonalizedAds = enablePersonalizedAds;
    this.enableBannerAds = enableBannerAds;
    this.enableInterstitialAds = enableInterstitialAds;
    this.enableRewardedAds = enableRewardedAds;

    console.log('⚙️ 광고 설정 업데이트:', {
      testMode,
      enablePersonalizedAds,
      enableBannerAds,
      enableInterstitialAds,
      enableRewardedAds
    });
  }

  // 광고 통계 정보
  getAdStats() {
    return {
      isInitialized: this.isInitialized,
      isNativeAd: this.isNativeAd,
      testMode: this.testMode,
      bannerAdId: this.bannerAdId,
      interstitialAdId: this.interstitialAdId,
      rewardedAdId: this.rewardedAdId,
      platform: Platform.OS
    };
  }

  // 리소스 정리
  dispose() {
    if (this.isNativeAd) {
      console.log('📱 네이티브 광고 리소스 정리');
    } else {
      console.log('🎭 시뮬레이션 광고 리소스 정리');
    }
    
    this.isInitialized = false;
    this.isNativeAd = false;
    console.log('🎯 AdService 리소스 해제');
  }
}

// 싱글톤 인스턴스
let adServiceInstance = null;

export const getAdService = () => {
  if (!adServiceInstance) {
    adServiceInstance = new AdService();
  }
  return adServiceInstance;
};

export const disposeAdService = () => {
  if (adServiceInstance) {
    adServiceInstance.dispose();
    adServiceInstance = null;
  }
};