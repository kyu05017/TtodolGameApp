import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const MergeEffect = ({ position, size, color, onComplete }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // 합치기 이펙트 애니메이션 실행
    const animation = Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        })
      ]),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      })
    ])
    
    animation.start(() => {
      if (onComplete) {
        onComplete()
      }
    })
  }, [])
  
  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })
  
  // 색상이 제공된 경우 동적 스타일 생성
  const effectStyle = color ? {
    backgroundColor: `${color}B3`, // 70% 투명도 추가
    borderColor: color,
  } : {};
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position.x - size / 2,
          top: position.y - size / 2,
          width: size,
          height: size,
          transform: [
            { scale: scaleValue },
            { rotate: rotation }
          ],
          opacity: opacityValue,
        }
      ]}
    >
      <View style={[styles.effect, { borderRadius: size / 2 }, effectStyle]} />
      <View style={[styles.innerEffect, { borderRadius: size / 4 }]} />
    </Animated.View>
  )
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  effect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 215, 0, 0.7)',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  innerEffect: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
})

export default MergeEffect;