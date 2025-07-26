module.exports = function(api) {
  api.cache.never();
  
  return {
    presets: [
      ['babel-preset-expo', {
        jsxRuntime: 'classic'
      }]
    ],
    plugins: [
      ['@babel/plugin-transform-react-jsx', {
        pragma: 'require("react").createElement',
        pragmaFrag: 'require("react").Fragment'
      }],
      'react-native-reanimated/plugin'
    ]
  };
};
