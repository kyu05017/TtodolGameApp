import { Animated, Easing } from 'react-native';

class AnimationService {
  constructor() {
    console.log('✅ AnimationService Web 초기화 완료')
  }

  // 페이드 인 애니메이션
  fadeIn(animatedValue, duration = 300, delay = 0) {
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.ease,
        useNativeDriver: false, // 웹에서는 false
      }).start(resolve)
    })
  }

  // 페이드 아웃 애니메이션
  fadeOut(animatedValue, duration = 300, delay = 0) {
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.ease,
        useNativeDriver: false, // 웹에서는 false
      }).start(resolve)
    })
  }

  // 스케일 애니메이션
  scale(animatedValue, toValue, duration = 300, delay = 0) {
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue,
        duration,
        delay,
        easing: Easing.back(1.5),
        useNativeDriver: false, // 웹에서는 false
      }).start(resolve)
    })
  }

  // 스프링 애니메이션
  spring(animatedValue, toValue, duration = 500, bounciness = 10) {
    return new Promise((resolve) => {
      Animated.spring(animatedValue, {
        toValue,
        friction: 7,
        tension: 40,
        useNativeDriver: false, // 웹에서는 false
      }).start(resolve)
    })
  }

  // 바운스 애니메이션
  bounce(animatedValue, intensity = 0.1, duration = 200) {
    return new Promise((resolve) => {
      const originalValue = animatedValue._value;
      
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: originalValue - intensity,
          duration: duration / 2,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: originalValue,
          duration: duration / 2,
          useNativeDriver: false,
        })
      ]).start(resolve)
    })
  }

  // 펄스 애니메이션
  pulse(animatedValue, minValue = 0.8, maxValue = 1.2, duration = 200) {
    return new Promise((resolve) => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: maxValue,
          duration: duration / 2,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: minValue,
          duration: duration / 2,
          useNativeDriver: false,
        })
      ]).start(resolve)
    })
  }

  // 흔들기 애니메이션
  shake(animatedValue, intensity = 10, duration = 500) {
    return new Promise((resolve) => {
      const originalValue = animatedValue._value;
      
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: originalValue + intensity,
          duration: duration / 8,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: originalValue - intensity,
          duration: duration / 4,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: originalValue + intensity,
          duration: duration / 4,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: originalValue - intensity,
          duration: duration / 4,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: originalValue,
          duration: duration / 8,
          useNativeDriver: false,
        })
      ]).start(resolve)
    })
  }

  // 회전 애니메이션
  rotate(animatedValue, toValue, duration = 300) {
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: Easing.linear,
        useNativeDriver: false, // 웹에서는 false
      }).start(resolve)
    })
  }

  // 슬라이드 인 애니메이션
  slideIn(animatedValue, fromValue, toValue, duration = 300) {
    animatedValue.setValue(fromValue)
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // 웹에서는 false
      }).start(resolve)
    })
  }

  // 슬라이드 아웃 애니메이션
  slideOut(animatedValue, toValue, duration = 300) {
    return new Promise((resolve) => {
      Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false, // 웹에서는 false
      }).start(resolve)
    })
  }

  // 복합 애니메이션: 페이드인과 스케일 동시 실행
  fadeInScale(opacityValue, scaleValue, duration = 300, delay = 0) {
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.back(1.5),
          useNativeDriver: false,
        })
      ]).start(resolve)
    })
  }

  // 복합 애니메이션: 페이드아웃과 스케일 동시 실행
  fadeOutScale(opacityValue, scaleValue, duration = 300, delay = 0) {
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 0,
          duration,
          delay,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration,
          delay,
          easing: Easing.in(Easing.back(1.5)),
          useNativeDriver: false,
        })
      ]).start(resolve)
    })
  }

  // 루프 애니메이션 (무한 반복)
  loop(animatedValue, minValue = 0, maxValue = 1, duration = 1000) {
    const loopAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: maxValue,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: minValue,
          duration: duration / 2,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: false,
        })
      ])
    )

    loopAnimation.start()
    return loopAnimation;
  }

  // 애니메이션 정지
  stop(animation) {
    if (animation && animation.stop) {
      animation.stop()
    }
  }
}

// 싱글톤 인스턴스 생성
const animationService = new AnimationService()

const getAnimationService = () => animationService;

export default animationService;
export { getAnimationService };
