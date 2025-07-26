const upstreamTransformer = require('metro-react-native-babel-transformer');

module.exports.transform = function({ src, filename, options }) {
  // expo-linear-gradient 모듈에서 React import 문제 해결
  if (filename.includes('expo-linear-gradient')) {
    // 이미 React import가 있으면 건드리지 않고, 없으면 추가
    if (!src.includes('import React') && !src.includes('var React')) {
      src = `import React from 'react';\n${src}`;
    }
  }
  
  return upstreamTransformer.transform({ src, filename, options });
};