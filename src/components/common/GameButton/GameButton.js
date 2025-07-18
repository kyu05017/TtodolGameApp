import React from 'react';
import { TouchableOpacity, Text, Platform } from 'react-native';
import { colors, sizes } from '../../../styles/common';

// 하나의 파일로 웹과 모바일 모두 처리!
const GameButton = ({ title, onPress, variant = 'primary', style, ...props }) => {
  const buttonStyle = {
    backgroundColor: variant === 'primary' ? colors.primary : colors.secondary,
    paddingHorizontal: sizes.paddingL,
    paddingVertical: sizes.paddingM,
    borderRadius: sizes.radiusM,
    alignItems: 'center',
    justifyContent: 'center',
    
    // 웹 전용 스타일을 조건부로 적용
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      transition: 'all 0.2s ease',
    }),
    
    // 모바일 전용 스타일을 조건부로 적용
    ...(Platform.OS !== 'web' && {
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }),
    
    ...style,
  };

  const textStyle = {
    color: colors.textWhite,
    fontSize: sizes.fontL,
    fontWeight: 'bold',
  };

  // 웹에서는 button 태그, 모바일에서는 TouchableOpacity 사용
  if (Platform.OS === 'web') {
    return (
      <button
        style={buttonStyle}
        onClick={onPress}
        {...props}
      >
        <span style={textStyle}>{title}</span>
      </button>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      {...props}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default GameButton;