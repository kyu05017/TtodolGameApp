import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { FRUITS_BASE } from '../../constants/fruits';
import { getFruitImageById } from '../../constants/imageAssets';
import { platformStyle } from '../../utils/platform';

const FruitCollectionStatus = ({ currentGameCollection = {}, style }) => {
  // 체리(0번)를 제외한 과일들 (1번부터 10번까지)
  const fruitsToShow = FRUITS_BASE.slice(1); // 인덱스 1부터 시작
  
  // 반응형 크기 계산 - 화면 너비에 따라 동적으로 요소 크기 조절
  const { width: screenWidth } = Dimensions.get('window');
  const containerPadding = 32; // 컨테이너 패딩 고려
  const availableWidth = screenWidth - containerPadding; // 좌우 마진 및 패딩 제외
  const itemCount = fruitsToShow.length; // 10개 과일
  
  // 더 보수적인 기본 크기 설정
  const baseCircleSize = 40;
  const baseGap = 4;
  const totalNeededWidth = (baseCircleSize * itemCount) + (baseGap * (itemCount - 1));
  
  // 화면에 맞게 스케일 팩터 계산 (더 보수적인 범위)
  const scaleFactor = Math.min(1.0, Math.max(0.5, availableWidth / totalNeededWidth));
  
  // 동적 크기 계산 (더 작은 기본값으로 시작)
  const dynamicCircleSize = Math.round(baseCircleSize * scaleFactor);
  const dynamicImageSize = Math.round(dynamicCircleSize * 0.7); // 원형 박스의 70% 크기
  const dynamicPadding = Math.max(8, Math.round(12 * scaleFactor)); // 최소 8px 보장
  const dynamicGap = Math.max(2, Math.round(baseGap * scaleFactor)); // 최소 2px 보장

  return (
    <View style={[
      styles.horizontalContainer, 
      { 
        paddingHorizontal: dynamicPadding,
        paddingVertical: dynamicPadding * 0.75 
      },
      style
    ]}>
      <View style={[
        styles.horizontalFruitList,
        { gap: dynamicGap }
      ]}>
        {fruitsToShow.map((fruit, index) => {
          const fruitId = index + 1; // 실제 과일 ID (1부터 시작)
          const isCollected = currentGameCollection[fruitId] && currentGameCollection[fruitId] > 0;
          
          return (
            <View key={fruitId} style={styles.horizontalFruitItem}>
              <View style={[
                styles.fruitCircle,
                { 
                  width: dynamicCircleSize,
                  height: dynamicCircleSize,
                  borderRadius: dynamicCircleSize / 2,
                  backgroundColor: isCollected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(148, 163, 184, 0.08)',
                  borderColor: isCollected ? '#8b5cf6' : '#cbd5e1',
                }
              ]}>
                <Image
                  source={getFruitImageById(fruitId)}
                  style={[
                    styles.fruitImage,
                    {
                      width: dynamicImageSize,
                      height: dynamicImageSize,
                      opacity: isCollected ? 1 : 0.4
                    }
                  ]}
                  resizeMode="contain"
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 16,
    minWidth: 140,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
    ...platformStyle(
      { boxShadow: '0 4px 8px rgba(139, 92, 246, 0.15)' },
      {
        elevation: 8,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      }
    ),
  },
  horizontalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    ...platformStyle(
      { boxShadow: '0 4px 8px rgba(139, 92, 246, 0.15)' },
      {
        elevation: 8,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      }
    ),
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4c1d95',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  fruitList: {
    flexDirection: 'column',
    gap: 6,
  },
  horizontalFruitList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    paddingHorizontal: 4,
  },
  fruitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  horizontalFruitItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 50,
    minWidth: 25,
  },
  fruitCircle: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...platformStyle(
      { boxShadow: '0 2px 4px rgba(139, 92, 246, 0.15)' },
      {
        elevation: 4,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      }
    ),
  },
  fruitImage: {
    borderRadius: 4,
  },
});

export default FruitCollectionStatus;