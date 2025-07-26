import React from 'react';
import { View, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { isWeb, platformStyle } from '../../utils/platform';
import FixedBannerLayout from './FixedBannerLayout';

// 기본 화면 레이아웃 (스크롤 없음)
const ScreenLayout = ({
  children, 
  backgroundColor = '#f3f0c3',
  statusBarStyle = 'light-content',
  statusBarBackgroundColor = 'transparent',
  safe = true 
}) => {
  const Container = safe ? SafeAreaView : View;
  
  return (
    <Container style={[styles.container, { backgroundColor }]}>
      <StatusBar 
        barStyle={statusBarStyle} 
        backgroundColor={statusBarBackgroundColor} 
        translucent={!isWeb} 
      />
      {children}
    </Container>
  )
};

// 스크롤 가능한 화면 레이아웃 (메인스크린용) - 배너 광고 포함
const ScrollableScreenLayout = ({
  children, 
  backgroundColor = '#f3f0c3',
  statusBarStyle = 'light-content',
  statusBarBackgroundColor = 'transparent',
  safe = true,
  showBanner = true,
  bannerSize = 'standard'
}) => {
  const Container = safe ? SafeAreaView : View;
  
  return (
    <Container style={[styles.scrollableContainer, { backgroundColor }]}>
      <StatusBar 
        barStyle={statusBarStyle} 
        backgroundColor={statusBarBackgroundColor} 
        translucent={!isWeb} 
      />
      <FixedBannerLayout 
        showBanner={showBanner}
        bannerSize={bannerSize}
        bannerTestMode={true}
      >
        {children}
      </FixedBannerLayout>
    </Container>
  )
};

// 게임 화면 전용 레이아웃 (고정 크기, 스크롤 없음) - 배너 광고 없음
const GameScreenLayout = ({ children }) => {
  return (
    <SafeAreaView style={styles.gameContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#333" translucent={!isWeb} />
      {children}
    </SafeAreaView>
  )
};

// 모달 레이아웃
const ModalLayout = ({
  children, 
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
  centerContent = true 
}) => {
  return (
    <View style={[
      styles.modalContainer, 
      { backgroundColor },
      centerContent && styles.modalCenter
    ]}>
      {children}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...platformStyle(
      { 
        minHeight: '100vh',
        overflow: 'hidden' // 웹에서 스크롤 방지
      },
      {}
    ),
  },
  scrollableContainer: {
    flex: 1,
    ...platformStyle(
      { 
        minHeight: '100vh',
        overflow: 'auto' // 웹에서 스크롤 허용
      },
      {}
    ),
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#000',
    ...platformStyle(
      { 
        minHeight: '100vh',
        overflow: 'hidden',
        userSelect: 'none' // 웹에서 텍스트 선택 방지
      },
      {}
    ),
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...platformStyle(
      { 
        position: 'fixed',
        zIndex: 9999
      },
      {
        elevation: 1000
      }
    ),
  },
  modalCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

// Convert to CommonJS
export {
  ScreenLayout,
  ScrollableScreenLayout,
  GameScreenLayout,
  ModalLayout
};
