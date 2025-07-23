module.exports = {
  presets: [
    [
      'module:@react-native/babel-preset',
      {
        // Hermes 최적화를 위한 설정
        unstable_transformProfile: 'hermes-stable',
        // 플랫폼별 최적화
        enableBabelRuntime: false,
        // 더 나은 압축을 위해
        useTransformReactJSXExperimental: true,
      }
    ]
  ],
  plugins: [
    // React Native 최적화
    'react-native-reanimated/plugin', // 반드시 마지막에 위치
  ],
  env: {
    production: {
      plugins: [
        // 프로덕션 최적화 - console.log 제거
        'transform-remove-console',
      ],
    },
  },
};
