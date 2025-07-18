import { Animated, Easing } from 'react-native';

export class AnimationService {
  constructor() {
    this.animations = new Map();
    this.isInitialized = true;
    console.log('✅ AnimationService 초기화 완료');
  }

  // 페이드 인 애니메이션
  fadeIn(animatedValue, duration = 300, delay = 0) {
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  // 페이드 아웃 애니메이션
  fadeOut(animatedValue, duration = 300, delay = 0) {
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  // 스케일 애니메이션
  scale(animatedValue, toValue, duration = 300, delay = 0) {
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue,
        duration,
        delay,
        easing: Easing.back(1.5),
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  // 스프링 애니메이션
  spring(animatedValue, toValue, tension = 100, friction = 8) {
    return new Promise((resolve) => {
      Animated.spring(animatedValue, {
        toValue,
        tension,
        friction,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  // 회전 애니메이션
  rotate(animatedValue, duration = 1000, loops = -1) {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      { iterations: loops }
    );
    
    animation.start();
    return animation;
  }

  // 진동 애니메이션 (쉐이크 효과)
  shake(animatedValue, intensity = 10, duration = 500) {
    return new Promise((resolve) => {
      const shakeAnimation = Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: intensity,
          duration: duration / 8,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: -intensity,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: intensity / 2,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: -intensity / 2,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: duration / 8,
          useNativeDriver: true,
        }),
      ]);
      
      shakeAnimation.start(resolve);
    });
  }

  // 펄스 애니메이션
  pulse(animatedValue, minValue = 0.8, maxValue = 1.2, duration = 1000) {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: maxValue,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: minValue,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseAnimation.start();
    return pulseAnimation;
  }

  // 슬라이드 인 애니메이션
  slideIn(animatedValue, direction = 'left', distance = 300, duration = 400) {
    const initialValue = direction === 'left' ? -distance : 
                        direction === 'right' ? distance :
                        direction === 'up' ? -distance : distance;
    
    animatedValue.setValue(initialValue);
    
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  // 슬라이드 아웃 애니메이션
  slideOut(animatedValue, direction = 'left', distance = 300, duration = 400) {
    const finalValue = direction === 'left' ? -distance : 
                      direction === 'right' ? distance :
                      direction === 'up' ? -distance : distance;
    
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue: finalValue,
        duration,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  // 바운스 애니메이션
  bounce(animatedValue, intensity = 0.2, duration = 600) {
    return new Promise((resolve) => {
      const bounceAnimation = Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1 + intensity,
          duration: duration / 4,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1 - intensity / 2,
          duration: duration / 4,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1 + intensity / 4,
          duration: duration / 4,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration / 4,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
      
      bounceAnimation.start(resolve);
    });
  }

  // 복합 애니메이션 (페이드 + 스케일)
  fadeInScale(fadeValue, scaleValue, duration = 300, delay = 0) {
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.back(1.5),
          useNativeDriver: true,
        }),
      ]).start(resolve);
    });
  }

  // 복합 애니메이션 (페이드 + 스케일 아웃)
  fadeOutScale(fadeValue, scaleValue, duration = 300, delay = 0) {
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 0,
          duration,
          delay,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration,
          delay,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(resolve);
    });
  }

  // 연속 애니메이션 실행
  sequence(animations) {
    return new Promise((resolve) => {
      Animated.sequence(animations).start(resolve);
    });
  }

  // 병렬 애니메이션 실행
  parallel(animations) {
    return new Promise((resolve) => {
      Animated.parallel(animations).start(resolve);
    });
  }

  // 애니메이션 스태거 (순차적 실행)
  stagger(animations, delay = 100) {
    return new Promise((resolve) => {
      Animated.stagger(delay, animations).start(resolve);
    });
  }

  // 애니메이션 중단
  stopAnimation(animatedValue) {
    animatedValue.stopAnimation();
  }

  // 모든 애니메이션 중단
  stopAllAnimations() {
    this.animations.forEach((animation, key) => {
      if (animation && animation.stop) {
        animation.stop();
      }
    });
    this.animations.clear();
  }

  // 애니메이션 등록
  registerAnimation(key, animation) {
    this.animations.set(key, animation);
  }

  // 애니메이션 해제
  unregisterAnimation(key) {
    const animation = this.animations.get(key);
    if (animation && animation.stop) {
      animation.stop();
    }
    this.animations.delete(key);
  }

  // 리소스 정리
  dispose() {
    this.stopAllAnimations();
    this.animations.clear();
    this.isInitialized = false;
    console.log('🎭 AnimationService 리소스 해제');
  }
}

// 싱글톤 인스턴스
let animationServiceInstance = null;

export const getAnimationService = () => {
  if (!animationServiceInstance) {
    animationServiceInstance = new AnimationService();
  }
  return animationServiceInstance;
};

export const disposeAnimationService = () => {
  if (animationServiceInstance) {
    animationServiceInstance.dispose();
    animationServiceInstance = null;
  }
};