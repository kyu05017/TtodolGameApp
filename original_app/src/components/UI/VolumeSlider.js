import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { isWeb, platformStyle } from '../../utils/platform';
import { getAudioService } from '../../services/AudioService';

const { width: screenWidth } = Dimensions.get('window')

const VolumeSlider = ({ 
  value = 0.5, 
  onValueChange, 
  disabled = false, 
  volumeType = 'music' // 'music' 또는 'effect'
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [webDragging, setWebDragging] = useState(false)
  const sliderWidth = Math.min(screenWidth * 0.6, 240)
  const audioService = getAudioService()

  const handleValueChange = (newValue) => {
    const clampedValue = Math.max(0, Math.min(1, newValue))
    
    console.log(`🎛️ VolumeSlider (${volumeType}) - 값 변경:`, clampedValue)
    
    // 콜백 호출 (부모 컴포넌트에서 AudioService 처리)
    console.log(`🔄 VolumeSlider (${volumeType}) - 콜백 호출:`, !!onValueChange)
    onValueChange && onValueChange(clampedValue)
  };

  const toggleMute = () => {
    if (disabled) return;
    const newValue = value > 0 ? 0 : 0.5;
    handleValueChange(newValue)
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !disabled,
    onStartShouldSetPanResponder: () => !disabled,
    
    onPanResponderGrant: (evt) => {
      if (disabled) return;
      setIsDragging(true)
      const locationX = evt.nativeEvent.locationX;
      const percentage = Math.max(0, Math.min(1, locationX / sliderWidth))
      handleValueChange(percentage)
    },
    
    onPanResponderMove: (evt) => {
      if (disabled) return;
      const locationX = evt.nativeEvent.locationX;
      const percentage = Math.max(0, Math.min(1, locationX / sliderWidth))
      handleValueChange(percentage)
    },
    
    onPanResponderRelease: () => {
      setIsDragging(false)
    }
  })

  // 웹용 마우스/터치 이벤트 핸들러
  const handleWebStart = (evt) => {
    if (disabled) return;
    
    // passive event listener 문제 해결: try-catch로 감싸기
    try {
      evt.preventDefault()
      evt.stopPropagation()
    } catch (e) {
      // passive event listener에서는 preventDefault가 작동하지 않음
    }
    
    setWebDragging(true)
    setIsDragging(true)
    
    const sliderElement = evt.currentTarget;
    const rect = sliderElement.getBoundingClientRect()
    const offsetX = evt.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / sliderWidth))
    handleValueChange(percentage)
    
    // 전역 이벤트 리스너 추가
    if (isWeb) {
      const handleGlobalMove = (e) => {
        // getBoundingClientRect 오류 방지: null 체크
        if (!sliderElement || !sliderElement.getBoundingClientRect) {
          return;
        }
        
        const rect = sliderElement.getBoundingClientRect()
        const offsetX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, offsetX / sliderWidth))
        handleValueChange(percentage)
      };
      
      const handleGlobalEnd = () => {
        setWebDragging(false)
        setIsDragging(false)
        document.removeEventListener('pointermove', handleGlobalMove)
        document.removeEventListener('pointerup', handleGlobalEnd)
        document.removeEventListener('pointercancel', handleGlobalEnd)
      };
      
      // Pointer 이벤트 사용 (더 현대적이고 안전함)
      document.addEventListener('pointermove', handleGlobalMove)
      document.addEventListener('pointerup', handleGlobalEnd)
      document.addEventListener('pointercancel', handleGlobalEnd)
    }
  };

  const getMuteIcon = () => {
    if (value === 0) return '🔇';
    if (value < 0.3) return '🔈';
    if (value < 0.7) return '🔉';
    return '🔊';
  };

  const getVolumePercentage = () => {
    return Math.round(value * 100)
  };

  // AudioService 초기화
  React.useEffect(() => {
    audioService.initialize?.()
  }, [])

  return (
    <View style={styles.container}>
      {/* 음소거 버튼 */}
      <TouchableOpacity 
        style={[styles.muteButton, disabled && styles.disabled]} 
        onPress={toggleMute}
        disabled={disabled}
      >
        <Text style={styles.muteIcon}>{getMuteIcon()}</Text>
      </TouchableOpacity>

      {/* 슬라이더와 퍼센테이지 컨테이너 */}
      <View style={styles.sliderSection}>
        {/* 슬라이더 */}
        <View 
          style={[styles.sliderContainer, { width: sliderWidth }]}
        {...(isWeb ? {
          onPointerDown: handleWebStart,
          style: { touchAction: 'none' } // 터치 스크롤 방지
        } : panResponder.panHandlers)}
      >
        {/* 슬라이더 트랙 - 완전히 새로운 접근 방식 */}
        <View style={styles.trackContainer}>
          {/* 배경 트랙 - 웹 호환성을 위해 View 사용 */}
          <View style={[styles.backgroundTrack, disabled && styles.disabledTrack]} />
          
          {/* 활성 트랙 - 웹 호환성을 위해 조건부 렌더링 */}
          {isWeb ? (
            <View 
              style={[
                styles.foregroundTrack,
                {
                  width: Math.max(4, value * sliderWidth),
                  backgroundColor: disabled ? '#ccc' : '#8b5cf6',
                }
              ]}
            />
          ) : (
            <View
              colors={disabled ? ['#ccc', '#aaa'] : ['#667eea', '#764ba2', '#8b5cf6']}
              style={[
                styles.foregroundTrack,
                {
                  width: Math.max(4, value * sliderWidth),
                }
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}
        </View>

        {/* 슬라이더 썸 버튼 - 게이지바 끝에 위치 */}
        {isWeb ? (
          <TouchableOpacity
            style={[
              styles.thumbButton, 
              { 
                left: Math.max(0, Math.min(sliderWidth - 24, value * sliderWidth - 12))
              },
              (isDragging || webDragging) && styles.thumbActive,
              disabled && styles.disabledThumb
            ]}
            disabled={disabled}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.thumb,
                {
                  backgroundColor: disabled ? '#ccc' : 
                                 (isDragging || webDragging) ? '#6d28d9' : '#8b5cf6'
                }
              ]}
            >
              {/* 썸 내부 하이라이트와 그립 표시 */}
              <View style={styles.thumbInner} />
              <View style={styles.thumbGrip} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.thumbButton, 
              { 
                left: Math.max(0, Math.min(sliderWidth - 24, value * sliderWidth - 12))
              },
              (isDragging || webDragging) && styles.thumbActive,
              disabled && styles.disabledThumb
            ]}
            disabled={disabled}
            activeOpacity={0.8}
          >
            <View
              colors={disabled ? ['#ccc', '#aaa'] : 
                      (isDragging || webDragging) ? ['#8b5cf6', '#7c3aed', '#6d28d9'] : 
                      ['#a855f7', '#8b5cf6', '#7c3aed']}
              style={styles.thumb}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* 썸 내부 하이라이트와 그립 표시 */}
              <View style={styles.thumbInner} />
              <View style={styles.thumbGrip} />
            </View>
          </TouchableOpacity>
        )}
        </View>

        {/* 볼륨 퍼센티지 - 슬라이더 오른쪽 끝에 위치 */}
        <View style={styles.percentageContainer}>
          <Text style={[styles.percentage, disabled && styles.disabledText]}>
            {getVolumePercentage()}%
          </Text>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  muteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    ...platformStyle(
      { cursor: 'pointer' },
      {
        elevation: 2,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      }
    ),
  },
  muteIcon: {
    fontSize: 18,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 8, // 터치 영역 확대
    ...platformStyle(
      { 
        cursor: 'pointer',
        borderRadius: 8,
        transition: 'background-color 0.2s ease',
        touchAction: 'none', // 터치 스크롤 방지
        userSelect: 'none', // 텍스트 선택 방지
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
      },
      {}
    ),
  },
  trackContainer: {
    height: 8,
    position: 'relative',
    justifyContent: 'center',
  },
  backgroundTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    ...platformStyle(
      { 
        border: '1px solid rgba(0, 0, 0, 0.1)',
      },
      {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }
    ),
  },
  foregroundTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 8,
    borderRadius: 4,
    ...platformStyle(
      { 
        transition: 'width 0.2s ease',
        boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)',
      },
      {
        elevation: 3,
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
      }
    ),
  },
  thumbButton: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: -8, // 게이지바와 평행하게 위치 (trackContainer height: 8, thumb height: 24이므로 -8)
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    ...platformStyle(
      { 
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
        cursor: 'grab',
        transition: 'all 0.3s ease',
        userSelect: 'none',
      },
      {
        elevation: 6,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      }
    ),
  },
  thumbActive: {
    transform: [{ scale: 1.4 }],
    ...platformStyle(
      { 
        cursor: 'grabbing',
        boxShadow: '0 6px 20px rgba(139, 92, 246, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4)',
      },
      {
        elevation: 10,
        shadowOpacity: 0.6,
        shadowRadius: 10,
      }
    ),
  },
  thumbInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute',
    ...platformStyle(
      {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
      },
      {
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      }
    ),
  },
  thumbGrip: {
    width: 3,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1.5,
    position: 'absolute',
    ...platformStyle(
      {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      },
      {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
      }
    ),
  },
  percentageContainer: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledTrack: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  disabledActiveTrack: {
    backgroundColor: '#ccc',
  },
  disabledThumb: {
    backgroundColor: '#ccc',
  },
  disabledText: {
    color: '#ccc',
  },
})

export default VolumeSlider;