import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors, buttonStyles, textStyles } from '../../../styles/common';
import { platformStyle, createTouchHandler } from '../../../utils/platform';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  children,
  ...props
}) => {
  // 버튼 스타일 계산
  const getButtonStyle = () => {
    const baseStyle = {
      ...buttonStyles.base,
      ...buttonStyles[variant],
    };

    if (size === 'small') {
      baseStyle.paddingHorizontal = 16;
      baseStyle.paddingVertical = 8;
      baseStyle.minHeight = 32;
    } else if (size === 'large') {
      baseStyle.paddingHorizontal = 32;
      baseStyle.paddingVertical = 20;
      baseStyle.minHeight = 56;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    // 플랫폼별 스타일 적용
    const platformSpecificStyle = platformStyle(
      {
        // 웹 전용 스타일
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        border: 'none',
        outline: 'none',
        transition: 'all 0.2s ease',
        ...(variant === 'outline' && {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderStyle: 'solid',
        }),
      },
      {
        // 모바일 전용 스타일
      }
    )

    return {
      ...baseStyle,
      ...platformSpecificStyle,
      ...style,
    };
  };

  // 텍스트 스타일 계산
  const getTextStyle = () => {
    const baseTextStyle = {
      ...textStyles.button,
      color: variant === 'outline' ? colors.primary : colors.textWhite,
    };

    if (size === 'small') {
      baseTextStyle.fontSize = 14;
    } else if (size === 'large') {
      baseTextStyle.fontSize = 18;
    }

    return {
      ...baseTextStyle,
      ...textStyle,
    };
  };

  // 터치 핸들러 생성
  const touchHandler = createTouchHandler(disabled || loading ? null : onPress)

  // 웹과 모바일에서 다른 컴포넌트 렌더링
  const ButtonComponent = platformStyle('button', TouchableOpacity)

  return (
    <ButtonComponent
      style={getButtonStyle()}
      disabled={disabled || loading}
      {...touchHandler}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.textWhite}
          size="small"
        />
      ) : (
        <>
          {children || <Text style={getTextStyle()}>{title}</Text>}
        </>
      )}
    </ButtonComponent>
  )
};

export default Button;