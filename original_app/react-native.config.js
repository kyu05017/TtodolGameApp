module.exports = {
  // Assets 설정 - 폰트, 이미지, 오디오 파일 자동 링크
  assets: ['./src/assets/fonts/', './src/assets/images/', './src/assets/audio/'],
  
  // 의존성 자동 링크 설정
  dependencies: {
    // 특정 라이브러리 제외 설정 (필요시)
    'react-native-vector-icons': {
      platforms: {
        android: null, // Android 자동 링크 비활성화
        ios: null, // iOS 자동 링크 비활성화
      },
    },
  },
};