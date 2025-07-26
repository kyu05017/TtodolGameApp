module.exports = function(api) {
  api.cache.never();
  
  return {
    presets: [
      ['@babel/preset-env', {
        targets: {
          browsers: ['last 2 versions', 'ie >= 11']
        },
        modules: false,
        useBuiltIns: 'entry',
        corejs: 3
      }],
      ['@babel/preset-react', {
        runtime: 'automatic'
      }],
      '@babel/preset-typescript'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-runtime',
      'react-native-reanimated/plugin'
    ]
  };
};