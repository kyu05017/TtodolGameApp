const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // 모듈 해결 시 필요한 설정
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'mp3', 'wav', 'mp4'],
    alias: {
      'matter-js': require.resolve('matter-js'),
    },
    resolverMainFields: ['react-native', 'android', 'native', 'main'],
    unstable_enablePackageExports: true,
    // Hermes 최적화: 불필요한 모듈 제외
    blockList: [
      // 웹 전용 모듈들을 네이티브 빌드에서 제외
      /.*\.web\.(js|ts|jsx|tsx)$/,
      // react-native-reanimated 웹 전체 폴더 제외
      /.*\/node_modules\/react-native-reanimated\/src\/layoutReanimation\/web\/.*/,
      /.*\/node_modules\/react-native-reanimated\/.*\.web\.(js|ts|jsx|tsx)$/,
    ],
    platforms: ['android', 'ios'], // 안드로이드와 iOS 플랫폼만 명시적으로 지정
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // Hermes에서 성능 향상
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
