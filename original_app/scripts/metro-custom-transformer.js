const upstreamTransformer = require('metro-react-native-babel-transformer');

const customTransformer = {
  transform: function(src, filename, options) {
    // 소스 코드 타입 확인 및 정규화
    let processedSrc;
    if (typeof src === 'string') {
      processedSrc = src;
    } else if (src && typeof src.code === 'string') {
      processedSrc = src.code;
    } else if (Buffer.isBuffer(src)) {
      processedSrc = src.toString('utf8');
    } else {
      // 기본 변환기로 바로 전달
      return upstreamTransformer.transform(src, filename, options);
    }
    
    try {
      // 1. @babel/runtime 헬퍼 임포트 차단
      processedSrc = processedSrc.replace(
        /import\s+[^;]+from\s+['"]@babel\/runtime\/helpers\/[^'"]+['"];?/g, 
        ''
      );
      
      // 2. require('@babel/runtime/helpers/*') 호출 차단
      processedSrc = processedSrc.replace(
        /require\(['"]@babel\/runtime\/helpers\/[^'"]+['"]\)/g,
        'function(){return arguments[0]}'
      );
      
      // 3. 비동기 함수의 regenerator 런타임 의존성 제거
      if (processedSrc.includes('regeneratorRuntime')) {
        processedSrc = processedSrc.replace(
          /regeneratorRuntime\./g,
          '(global.regeneratorRuntime || {}).'
        );
      }
      
      // 4. Symbol polyfill 관련 처리
      if (processedSrc.includes('Symbol') && processedSrc.includes('typeof')) {
        processedSrc = processedSrc.replace(
          /typeof Symbol === "function" && typeof Symbol\.iterator === "symbol"/g,
          'typeof Symbol === "function"'
        );
      }
    } catch (error) {
      console.warn('Metro custom transformer preprocessing error:', error.message);
      // 에러 발생시 원본 소스 사용
      processedSrc = typeof src === 'string' ? src : (src.code || src.toString());
    }
    
    // 업스트림 transformer로 전달
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
      // TypeScript 파일 처리
      return upstreamTransformer.transform(processedSrc, filename, {
        ...options,
        // TypeScript 변환 옵션
        babelTransformerOptions: {
          ...options.babelTransformerOptions,
          presets: [
            ['@babel/preset-typescript', { allowNamespaces: true }],
            ...(options.babelTransformerOptions?.presets || [])
          ]
        }
      });
    }
    
    // JavaScript 파일 처리
    return upstreamTransformer.transform(processedSrc, filename, {
      ...options,
      // 추가 Babel 옵션
      babelTransformerOptions: {
        ...options.babelTransformerOptions,
        plugins: [
          // 런타임 헬퍼 차단 플러그인
          require.resolve('./babel-plugin-block-runtime-helpers.js'),
          // 기존 플러그인들
          ...(options.babelTransformerOptions?.plugins || [])
        ]
      }
    });
  },
  
  // 캐시 키 생성 (변환 내용이 바뀔 때마다 새로 변환)
  getCacheKey: function() {
    return upstreamTransformer.getCacheKey() + '-custom-v2';
  }
};

module.exports = customTransformer;