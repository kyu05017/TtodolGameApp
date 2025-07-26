const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Web-specific configuration
config.resolver.assetExts.push('mp3', 'wav', 'ogg', 'm4a');
config.resolver.sourceExts.push('ts', 'tsx', 'web.js', 'web.ts', 'web.tsx');

// Web 전용 alias 설정
config.resolver.alias = {
  'react-native': 'react-native-web',
  'react-native-linear-gradient': 'expo-linear-gradient',
  '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/web/async-storage-mock.js'),
  'react-native-gesture-handler': path.resolve(__dirname, 'src/web/gesture-handler-mock.js'),
  'react-native-reanimated': path.resolve(__dirname, 'src/web/reanimated-mock.js'),
  'react-native-responsive-dimensions': path.resolve(__dirname, 'src/web/responsive-dimensions-mock.js'),
  'react-native-safe-area-context': path.resolve(__dirname, 'src/web/safe-area-context-mock.js'),
  'react-native-screens': path.resolve(__dirname, 'src/web/react-native-screens-mock.js'),
  'react-native-orientation-locker': path.resolve(__dirname, 'src/web/react-native-orientation-locker-mock.js'),
  'react-native-keep-awake': path.resolve(__dirname, 'src/web/react-native-keep-awake-mock.js'),
  'react-native-haptic-feedback': path.resolve(__dirname, 'src/web/react-native-haptic-feedback-mock.js'),
  'react-native-sound': path.resolve(__dirname, 'src/web/sound-mock.js'),
  'react-native-status-bar-height': path.resolve(__dirname, 'src/web/status-bar-height-mock.js'),
  'react-native-modal': path.resolve(__dirname, 'src/web/modal-mock.js'),
  'react-native-game-engine': path.resolve(__dirname, 'src/web/game-engine-mock.js')
};

// Web용 트랜스포머
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  enableBabelRCLookup: true,
  enableBabelRuntime: true
};

// Web용 serializer - 모든 모듈 포함
config.serializer = {
  ...config.serializer,
  processModuleFilter: function(module) {
    return true;
  }
};

module.exports = config;