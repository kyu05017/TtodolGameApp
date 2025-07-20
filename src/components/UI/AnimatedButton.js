import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
} from 'react-native';
import { getAnimationService } from '../../services/AnimationService';
import { platformStyle, isWeb } from '../../utils/platform';

const AnimatedButton = ({ 
  onPress, 
  children, 
  style, 
  textStyle,
  animationType = 'bounce',
  disabled = false,
  ...props 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const animationService = getAnimationService();

  useEffect(() => {
    // 컴포넌트가 마운트될 때 페이드 인
    opacityAnim.setValue(0);
    scaleAnim.setValue(0.8);
    
    // 웹에서는 애니메이션 서비스 대신 간단한 애니메이션 사용
    if (isWeb) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();
    } else {
      animationService.fadeInScale(opacityAnim, scaleAnim, 300, 0);
    }
  }, []);

  const handlePressIn = () => {
    if (disabled) return;
    
    switch (animationType) {
      case 'scale':
        animationService.scale(scaleAnim, 0.95, 100);
        break;
      case 'bounce':
        animationService.bounce(scaleAnim, 0.1, 200);
        break;
      case 'pulse':
        animationService.pulse(scaleAnim, 0.9, 1.1, 200);
        break;
      default:
        animationService.scale(scaleAnim, 0.95, 100);
    }
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    animationService.spring(scaleAnim, 1, 300, 10);
  };

  const handlePress = () => {
    if (disabled) return;
    
    // 터치 피드백 애니메이션
    animationService.bounce(scaleAnim, 0.2, 300);
    
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.9}
      {...props}
    >
      <Animated.View
        style={[
          styles.button,
          style,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim }
            ]
          },
          disabled && styles.disabled
        ]}
      >
        {typeof children === 'string' ? (
          <Text style={[styles.buttonText, textStyle, disabled && styles.disabledText]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    ...platformStyle(
      { boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)' },
      {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }
    ),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#ccc',
    ...platformStyle(
      { boxShadow: 'none' },
      {
        elevation: 0,
        shadowOpacity: 0,
      }
    ),
  },
  disabledText: {
    color: '#666',
  },
});

export default AnimatedButton;