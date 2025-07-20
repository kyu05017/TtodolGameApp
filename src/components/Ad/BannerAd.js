import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { isWeb, platformStyle, createTouchHandler } from '../../utils/platform';
import { getAdService } from '../../services/AdService';

const BannerAd = ({ 
  position = 'bottom',
  size = 'standard',
  testMode = true,
  onAdLoaded,
  onAdError,
  onAdClicked 
}) => {
  const [adService] = useState(() => getAdService());
  const [adData, setAdData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 광고 크기 설정
  const getAdSize = () => {
    switch (size) {
      case 'large':
        return { width: '100%', height: 90 };
      case 'medium':
        return { width: '100%', height: 70 };
      case 'standard':
      default:
        return { width: '100%', height: 50 };
    }
  };

  // 광고 로드
  useEffect(() => {
    loadAd();
  }, []);

  const loadAd = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 실제 광고 서비스에서 광고 로드
      const result = await adService.loadBannerAd();
      
      if (result.success) {
        // 테스트 모드일 때 가짜 광고 데이터 생성
        if (testMode) {
          const mockAds = [
            {
              id: 'test_ad_1',
              title: '🎮 신규 게임 출시!',
              description: '지금 다운로드하고 특별 아이템 받으세요',
              clickUrl: 'https://naver.com',
              imageUrl: null,
              backgroundColor: '#4CAF50'
            },
            {
              id: 'test_ad_2', 
              title: '📱 앱스토어 1위 앱',
              description: '전 세계가 인정한 최고의 앱을 만나보세요',
              clickUrl: 'https://naver.com',
              imageUrl: null,
              backgroundColor: '#2196F3'
            },
            {
              id: 'test_ad_3',
              title: '🛒 온라인 쇼핑몰',
              description: '최대 70% 할인! 지금 바로 확인하세요',
              clickUrl: 'https://naver.com',
              imageUrl: null,
              backgroundColor: '#FF9800'
            }
          ];
          
          // 랜덤 광고 선택
          const randomAd = mockAds[Math.floor(Math.random() * mockAds.length)];
          setAdData(randomAd);
        } else {
          setAdData(result.adData);
        }
        
        setIsLoading(false);
        onAdLoaded && onAdLoaded();
      } else {
        throw new Error(result.error || '광고 로드 실패');
      }
    } catch (err) {
      console.error('배너 광고 로드 실패:', err);
      setError(err.message);
      setIsLoading(false);
      onAdError && onAdError(err);
    }
  };

  // 광고 클릭 처리
  const handleAdClick = async () => {
    if (!adData) return;

    try {
      // 클릭 이벤트 추적
      await adService.trackAdClick(adData.id);
      
      onAdClicked && onAdClicked(adData);

      // URL 열기
      if (adData.clickUrl) {
        if (isWeb) {
          window.open(adData.clickUrl, '_blank');
        } else {
          Linking.openURL(adData.clickUrl);
        }
      }
    } catch (err) {
      console.error('광고 클릭 처리 실패:', err);
    }
  };

  // 광고 새로고침
  const refreshAd = () => {
    loadAd();
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <View style={[styles.container, getAdSize()]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>광고 로딩중...</Text>
        </View>
      </View>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <View style={[styles.container, getAdSize()]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>광고 로드 실패</Text>
          <TouchableOpacity style={styles.retryButton} {...createTouchHandler(refreshAd)}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 광고 표시
  if (!adData) {
    return (
      <View style={[styles.container, getAdSize()]}>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>📢 광고 영역</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, getAdSize()]}>
      <TouchableOpacity 
        style={[styles.adContainer, { backgroundColor: adData.backgroundColor || '#f0f0f0' }]}
        {...createTouchHandler(handleAdClick)}
        activeOpacity={0.8}
      >
        <View style={styles.adContent}>
          <View style={styles.adTextContainer}>
            <Text style={styles.adTitle} numberOfLines={1}>
              {adData.title}
            </Text>
            <Text style={styles.adDescription} numberOfLines={1}>
              {adData.description}
            </Text>
          </View>
          
          <View style={styles.adMeta}>
            <Text style={styles.adLabel}>광고</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    ...platformStyle(
      {
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)'
      },
      {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    ),
  },
  adContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...platformStyle(
      { cursor: 'pointer' },
      {}
    ),
  },
  adContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  adTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  adDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  adMeta: {
    alignItems: 'center',
  },
  adLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    marginRight: 8,
  },
  retryButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  retryText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold',
  },
});

export default BannerAd;