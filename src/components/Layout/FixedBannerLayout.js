import React from 'react';
import { View, StyleSheet } from 'react-native';
import { isWeb, platformStyle } from '../../utils/platform';
import BannerAd from '../Ad/BannerAd';

// 하단 고정 배너 광고가 있는 레이아웃
const FixedBannerLayout = ({ 
  children, 
  showBanner = true,
  bannerSize = 'standard',
  bannerTestMode = true,
  onBannerAdLoaded,
  onBannerAdError,
  onBannerAdClicked 
}) => {
  
  const getBannerHeight = () => {
    switch (bannerSize) {
      case 'large':
        return 90;
      case 'medium':
        return 70;
      case 'standard':
      default:
        return 50;
    }
  };

  const bannerHeight = getBannerHeight();

  return (
    <View style={styles.container}>
      {/* 메인 콘텐츠 영역 */}
      <View style={[
        styles.contentContainer, 
        showBanner && { 
          ...platformStyle(
            { paddingBottom: bannerHeight },
            { marginBottom: bannerHeight }
          )
        }
      ]}>
        {children}
      </View>

      {/* 고정 배너 광고 */}
      {showBanner && (
        <View style={[
          styles.bannerContainer, 
          { height: bannerHeight }
        ]}>
          <BannerAd
            position="bottom"
            size={bannerSize}
            testMode={bannerTestMode}
            onAdLoaded={onBannerAdLoaded}
            onAdError={onBannerAdError}
            onAdClicked={onBannerAdClicked}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    ...platformStyle(
      {
        position: 'fixed',
        zIndex: 9998
      },
      {
        elevation: 1000
      }
    ),
  },
});

export default FixedBannerLayout;