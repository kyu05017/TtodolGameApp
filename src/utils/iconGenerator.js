/**
 * App Icon Generator Utility
 * 기존 과일 이미지를 사용해서 앱 아이콘 생성을 위한 유틸리티
 */

export const APP_ICON_SIZES = {
  android: {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
  },
  ios: {
    'AppIcon-20x20@1x': 20,
    'AppIcon-20x20@2x': 40,
    'AppIcon-20x20@3x': 60,
    'AppIcon-29x29@1x': 29,
    'AppIcon-29x29@2x': 58,
    'AppIcon-29x29@3x': 87,
    'AppIcon-40x40@1x': 40,
    'AppIcon-40x40@2x': 80,
    'AppIcon-40x40@3x': 120,
    'AppIcon-60x60@2x': 120,
    'AppIcon-60x60@3x': 180,
    'AppIcon-76x76@1x': 76,
    'AppIcon-76x76@2x': 152,
    'AppIcon-83.5x83.5@2x': 167,
    'AppIcon-1024x1024@1x': 1024,
  }
};

export const SPLASH_SCREEN_SIZES = {
  android: {
    'drawable-mdpi': { width: 320, height: 480 },
    'drawable-hdpi': { width: 480, height: 800 },
    'drawable-xhdpi': { width: 720, height: 1280 },
    'drawable-xxhdpi': { width: 1080, height: 1920 },
    'drawable-xxxhdpi': { width: 1440, height: 2560 },
  },
  ios: {
    'Default@1x': { width: 320, height: 480 },
    'Default@2x': { width: 640, height: 960 },
    'Default@3x': { width: 1242, height: 2208 },
    'Default-568h@2x': { width: 640, height: 1136 },
    'Default-667h@2x': { width: 750, height: 1334 },
    'Default-736h@3x': { width: 1242, height: 2208 },
    'Default-Portrait': { width: 768, height: 1024 },
    'Default-Portrait@2x': { width: 1536, height: 2048 },
  }
};

// 앱 아이콘 디자인 컨셉
export const ICON_DESIGN = {
  background: '#4CAF50', // 앱 테마 색상
  watermelon: '/src/assets/images/fruits/10_watermelon.png',
  cherry: '/src/assets/images/fruits/00_cherry.png',
  apple: '/src/assets/images/fruits/05_apple.png',
  layout: 'watermelon_center', // 수박을 중앙에 배치하는 디자인
};

// 스플래시 스크린 디자인 컨셉
export const SPLASH_DESIGN = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  logo: '/src/assets/images/fruits/10_watermelon.png',
  title: '뜨돌 게임',
  subtitle: '과일 합치기 퍼즐',
  titleColor: '#ffffff',
  subtitleColor: '#f0f0f0',
};