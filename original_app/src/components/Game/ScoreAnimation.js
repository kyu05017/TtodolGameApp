import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { platformStyle } from '../../utils/platform';

const ScoreAnimation = ({ score, position, onComplete }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // 점수 애니메이션 실행
    const animation = Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      })
    ])
    
    animation.start(() => {
      if (onComplete) {
        onComplete()
      }
    })
  }, [])
  
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  })
  
  const scale = animatedValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [1, 1.5, 1],
  })
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position.x - 30,
          top: position.y - 50,
          transform: [
            { translateY },
            { scale }
          ],
          opacity: opacityValue,
        }
      ]}
    >
      <Text style={styles.scoreText}>+{score}</Text>
    </Animated.View>
  )
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    ...platformStyle(
      { textShadow: '1px 1px 3px #000' },
      {
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      }
    ),
  },
})

export default ScoreAnimation;