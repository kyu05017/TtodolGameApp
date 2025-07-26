import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ImageBackground,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Temporarily disabled
import { getAnimationService } from '../../services/AnimationService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const BackgroundImageSystem = ({ 
  children, 
  images = [], 
  interval = 5000, 
  enableTransition = true,
  overlayColors = ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)'],
  fallbackColor = '#f3f0c3'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const currentOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;
  const animationService = getAnimationService()

  // 배경 이미지 순환
  useEffect(() => {
    if (!enableTransition || images.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      if (!isTransitioning) {
        transitionToNext()
      }
    }, interval)

    return () => clearInterval(intervalId)
  }, [currentIndex, isTransitioning, images.length, interval, enableTransition])

  // 다음 이미지로 전환
  const transitionToNext = async () => {
    if (isTransitioning || images.length <= 1) return;

    setIsTransitioning(true)
    
    // 다음 이미지 인덱스 계산
    const nextIdx = (currentIndex + 1) % images.length;
    setNextIndex(nextIdx)
    
    // 페이드 아웃/인 애니메이션
    await Promise.all([
      animationService.fadeOut(currentOpacity, 1000),
      animationService.fadeIn(nextOpacity, 1000)
    ])
    
    // 인덱스 업데이트
    setCurrentIndex(nextIdx)
    setNextIndex((nextIdx + 1) % images.length)
    
    // 불투명도 값 리셋
    currentOpacity.setValue(1)
    nextOpacity.setValue(0)
    
    setIsTransitioning(false)
  };

  // 특정 이미지로 전환
  const transitionToImage = async (index) => {
    if (isTransitioning || index === currentIndex || index >= images.length) return;

    setIsTransitioning(true)
    setNextIndex(index)
    
    await Promise.all([
      animationService.fadeOut(currentOpacity, 500),
      animationService.fadeIn(nextOpacity, 500)
    ])
    
    setCurrentIndex(index)
    setNextIndex((index + 1) % images.length)
    
    currentOpacity.setValue(1)
    nextOpacity.setValue(0)
    
    setIsTransitioning(false)
  };

  // 이미지가 없을 때 폴백 배경
  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: fallbackColor }]}>
        {overlayColors && (
          <View
            style={[styles.overlay, { backgroundColor: overlayColors[0] || 'rgba(0,0,0,0.2)' }]}
          />
        )}
        {children}
      </View>
    )
  }

  // 단일 이미지일 때
  if (images.length === 1) {
    return (
      <ImageBackground
        source={images[0]}
        style={styles.container}
        resizeMode="cover"
      >
        {overlayColors && (
          <View
            style={[styles.overlay, { backgroundColor: overlayColors[0] || 'rgba(0,0,0,0.2)' }]}
          />
        )}
        {children}
      </ImageBackground>
    )
  }

  // 다중 이미지 전환 시스템
  return (
    <View style={styles.container}>
      {/* 현재 배경 이미지 */}
      <Animated.View style={[styles.imageContainer, { opacity: currentOpacity }]}>
        <ImageBackground
          source={images[currentIndex]}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* 다음 배경 이미지 */}
      <Animated.View style={[styles.imageContainer, { opacity: nextOpacity }]}>
        <ImageBackground
          source={images[nextIndex]}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* 오버레이 */}
      {overlayColors && (
        <View
          style={[styles.overlay, { backgroundColor: overlayColors[0] || 'rgba(0,0,0,0.2)' }]}
        />
      )}

      {/* 자식 컴포넌트 */}
      {children}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default BackgroundImageSystem;