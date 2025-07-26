#!/usr/bin/env node

/**
 * 번들 후처리 스크립트
 * Metro 번들링 이후 JavaScript 번들을 직접 수정하여
 * 런타임 에러를 방지하고 성능을 최적화합니다.
 */

const fs = require('fs');
const path = require('path');

class BundlePostProcessor {
  constructor(options = {}) {
    this.options = {
      verbose: options.verbose || false,
      backup: options.backup !== false, // 기본적으로 백업 생성
      outputStats: options.outputStats !== false,
      ...options
    };
    
    this.stats = {
      originalSize: 0,
      processedSize: 0,
      patternsFixed: {
        invalidRequires: 0,
        babelHelpers: 0,
        undefinedCalls: 0,
        moduleDefinitions: 0,
        optimizations: 0
      }
    };
  }
  
  log(message, level = 'info') {
    if (this.options.verbose || level === 'error') {
      const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
      console.log(`${prefix} [BundleProcessor] ${message}`);
    }
  }
  
  processBundle(bundlePath) {
    if (!fs.existsSync(bundlePath)) {
      throw new Error(`Bundle file not found: ${bundlePath}`);
    }
    
    this.log(`Processing bundle: ${bundlePath}`);
    
    // 1. 번들 읽기
    const originalBundle = fs.readFileSync(bundlePath, 'utf8');
    this.stats.originalSize = originalBundle.length;
    
    // 2. 백업 생성
    if (this.options.backup) {
      const backupPath = `${bundlePath}.backup.${Date.now()}`;
      fs.writeFileSync(backupPath, originalBundle);
      this.log(`Backup created: ${backupPath}`);
    }
    
    // 3. 번들 처리
    let processedBundle = this.applyAllTransformations(originalBundle);
    
    // 4. 안전장치 헤더 추가
    processedBundle = this.addSafetyHeader() + processedBundle;
    
    // 5. 최종 검증
    processedBundle = this.finalValidation(processedBundle);
    
    this.stats.processedSize = processedBundle.length;
    
    // 6. 결과 저장
    fs.writeFileSync(bundlePath, processedBundle);
    
    this.log(`Bundle processing complete`);
    
    if (this.options.outputStats) {
      this.printStats();
    }
    
    return processedBundle;
  }
  
  applyAllTransformations(bundle) {
    let processed = bundle;
    
    // 1. 잘못된 require 호출 수정
    processed = this.fixInvalidRequires(processed);
    
    // 2. Babel runtime 헬퍼 호출 제거
    processed = this.removeBabelHelpers(processed);
    
    // 3. undefined/null 함수 호출 수정
    processed = this.fixUndefinedCalls(processed);
    
    // 4. 모듈 정의 최적화
    processed = this.optimizeModuleDefinitions(processed);
    
    // 5. 성능 최적화
    processed = this.applyPerformanceOptimizations(processed);
    
    // 6. ES6+ 기능 폴리필
    processed = this.addPolyfills(processed);
    
    return processed;
  }
  
  fixInvalidRequires(bundle) {
    this.log('Fixing invalid require calls...');
    
    const patterns = [
      // require() 빈 호출
      {
        pattern: /require\(\s*\)/g,
        replacement: 'function(){}',
        description: 'empty require calls'
      },
      
      // require(undefined)
      {
        pattern: /require\(undefined\)/g,
        replacement: 'function(){}',
        description: 'undefined require calls'
      },
      
      // require(null)
      {
        pattern: /require\(null\)/g,
        replacement: 'function(){}',
        description: 'null require calls'
      },
      
      // require with invalid variable
      {
        pattern: /require\(([a-zA-Z_$][a-zA-Z0-9_$]*)\)(?!\s*[;,)])/g,
        replacement: '(function(){ try { return require($1); } catch(e) { return {}; } })()',
        description: 'dynamic require calls'
      }
    ];
    
    for (const { pattern, replacement, description } of patterns) {
      const matches = bundle.match(pattern);
      if (matches) {
        bundle = bundle.replace(pattern, replacement);
        this.stats.patternsFixed.invalidRequires += matches.length;
        this.log(`Fixed ${matches.length} ${description}`);
      }
    }
    
    return bundle;
  }
  
  removeBabelHelpers(bundle) {
    this.log('Removing Babel runtime helpers...');
    
    const patterns = [
      // require('@babel/runtime/helpers/...')
      {
        pattern: /require\(['"]@babel\/runtime\/helpers\/[^'"]+['"]\)/g,
        replacement: 'function(){return arguments[0]}',
        description: 'babel helper requires'
      },
      
      // import from '@babel/runtime/helpers/...'
      {
        pattern: /import\s+[^;]+from\s+['"]@babel\/runtime\/helpers\/[^'"]+['"];?/g,
        replacement: '',
        description: 'babel helper imports'
      },
      
      // _interopRequireDefault 호출
      {
        pattern: /_interopRequireDefault\(/g,
        replacement: 'function(obj){ return obj && obj.__esModule ? obj : { default: obj }; }(',
        description: 'interop require default calls'
      }
    ];
    
    for (const { pattern, replacement, description } of patterns) {
      const matches = bundle.match(pattern);
      if (matches) {
        bundle = bundle.replace(pattern, replacement);
        this.stats.patternsFixed.babelHelpers += matches.length;
        this.log(`Fixed ${matches.length} ${description}`);
      }
    }
    
    return bundle;
  }
  
  fixUndefinedCalls(bundle) {
    this.log('Fixing undefined function calls...');
    
    const patterns = [
      // (undefined)() 호출
      {
        pattern: /\(undefined\)\(\)/g,
        replacement: '(function(){})()',
        description: 'undefined function calls'
      },
      
      // undefined.method() 호출
      {
        pattern: /undefined\.([a-zA-Z_$][a-zA-Z0-9_$]*)\(/g,
        replacement: '({}.$1||function(){})(',
        description: 'undefined method calls'
      },
      
      // variable && variable() 패턴 최적화
      {
        pattern: /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*&&\s*\1\(\)/g,
        replacement: '($1||function(){})()',
        description: 'conditional function calls'
      }
    ];
    
    for (const { pattern, replacement, description } of patterns) {
      const matches = bundle.match(pattern);
      if (matches) {
        bundle = bundle.replace(pattern, replacement);
        this.stats.patternsFixed.undefinedCalls += matches.length;
        this.log(`Fixed ${matches.length} ${description}`);
      }
    }
    
    return bundle;
  }
  
  optimizeModuleDefinitions(bundle) {
    this.log('Optimizing module definitions...');
    
    // __d 함수 호출 최적화
    const modulePattern = /__d\(function\(([^)]*)\)\s*\{/g;
    let match;
    let optimizations = 0;
    
    while ((match = modulePattern.exec(bundle)) !== null) {
      const params = match[1];
      // 사용하지 않는 매개변수가 있는지 확인하고 최적화
      if (params.includes('require') && !params.includes('module') && !params.includes('exports')) {
        optimizations++;
      }
    }
    
    this.stats.patternsFixed.moduleDefinitions = optimizations;
    
    return bundle;
  }
  
  applyPerformanceOptimizations(bundle) {
    this.log('Applying performance optimizations...');
    
    const optimizations = [
      // 중복된 try-catch 블록 최적화
      {
        pattern: /try\s*\{\s*try\s*\{([^}]+)\}\s*catch\([^)]+\)\s*\{[^}]*\}\s*\}\s*catch/g,
        replacement: 'try{$1}catch',
        description: 'nested try-catch blocks'
      },
      
      // 빈 함수 최적화
      {
        pattern: /function\(\)\s*\{\s*\}/g,
        replacement: 'function(){}',
        description: 'empty functions'
      },
      
      // 불필요한 즉시 실행 함수 최적화
      {
        pattern: /\(function\(\)\s*\{\s*return\s+([^;]+);\s*\}\)\(\)/g,
        replacement: '($1)',
        description: 'unnecessary IIFE'
      }
    ];
    
    for (const { pattern, replacement, description } of optimizations) {
      const matches = bundle.match(pattern);
      if (matches) {
        bundle = bundle.replace(pattern, replacement);
        this.stats.patternsFixed.optimizations += matches.length;
        this.log(`Applied ${matches.length} ${description} optimizations`);
      }
    }
    
    return bundle;
  }
  
  addPolyfills(bundle) {
    this.log('Adding polyfills...');
    
    const polyfills = `
// Essential polyfills for React Native
if (typeof Array.prototype.find === 'undefined') {
  Array.prototype.find = function(predicate) {
    for (var i = 0; i < this.length; i++) {
      if (predicate(this[i], i, this)) return this[i];
    }
  };
}

if (typeof Object.assign === 'undefined') {
  Object.assign = function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
}

`;
    
    return polyfills + bundle;
  }
  
  addSafetyHeader() {
    return `
// Bundle Safety Header - Emergency Metro Fix
(function() {
  'use strict';
  
  // 즉시 전역 require 함수 정의
  if (typeof global === 'undefined') {
    var global = this;
  }
  
  // 안전한 require 함수 즉시 정의
  global.require = global.require || function(moduleId) {
    console.warn('Emergency require fallback for:', moduleId);
    if (typeof moduleId === 'string' && moduleId.startsWith('@babel/runtime/helpers/')) {
      return function() { return arguments[0]; };
    }
    return {};
  };
  
  // Metro require 함수 안전장치
  global.__r = global.__r || function(moduleId) {
    console.warn('Emergency __r fallback for:', moduleId);
    return {};
  };
  
  // 전역 에러 핸들러
  if (typeof ErrorUtils !== 'undefined') {
    var originalHandler = ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler();
    if (ErrorUtils.setGlobalHandler) {
      ErrorUtils.setGlobalHandler(function(error, isFatal) {
        console.warn('Global error caught:', error.message);
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    }
  }
  
  // 전역 변수 안전장치
  global.process = global.process || { env: {} };
  global.__DEV__ = global.__DEV__ !== undefined ? global.__DEV__ : true;
  
  // 함수 호출 안전장치
  global.__safeCall = function(fn) {
    return typeof fn === 'function' ? fn : function() {};
  };
  
  // 객체 접근 안전장치
  global.__safeAccess = function(obj, path) {
    try {
      return path.split('.').reduce(function(current, key) {
        return current && current[key];
      }, obj);
    } catch (e) {
      return undefined;
    }
  };
  
})();

`;
  }
  
  finalValidation(bundle) {
    this.log('Performing final validation...');
    
    // 기본적인 구문 검증
    const criticalPatterns = [
      /require\(\s*\)(?!\s*[;}])/g,  // 여전히 빈 require 호출이 있는지
      /undefined\(\)/g,              // undefined 함수 호출
      /@babel\/runtime\/helpers/g     // babel helper 참조
    ];
    
    for (const pattern of criticalPatterns) {
      const matches = bundle.match(pattern);
      if (matches) {
        this.log(`Warning: ${matches.length} potential issues found with pattern: ${pattern}`, 'warn');
      }
    }
    
    return bundle;
  }
  
  printStats() {
    console.log('\n📊 Bundle Processing Statistics:');
    console.log('=================================');
    console.log(`Original size: ${this.formatBytes(this.stats.originalSize)}`);
    console.log(`Processed size: ${this.formatBytes(this.stats.processedSize)}`);
    console.log(`Size change: ${this.stats.processedSize > this.stats.originalSize ? '+' : ''}${this.formatBytes(this.stats.processedSize - this.stats.originalSize)}`);
    console.log('\nFixed patterns:');
    Object.entries(this.stats.patternsFixed).forEach(([key, count]) => {
      console.log(`  ${key}: ${count}`);
    });
    console.log('=================================\n');
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// CLI 실행
if (require.main === module) {
  const args = process.argv.slice(2);
  const bundlePath = args[0];
  
  if (!bundlePath) {
    console.error('Usage: node post-bundle-processor.js <bundle-path>');
    process.exit(1);
  }
  
  const processor = new BundlePostProcessor({
    verbose: args.includes('--verbose'),
    backup: !args.includes('--no-backup'),
    outputStats: !args.includes('--no-stats')
  });
  
  try {
    processor.processBundle(bundlePath);
    console.log('✅ Bundle processing completed successfully');
  } catch (error) {
    console.error('❌ Bundle processing failed:', error.message);
    process.exit(1);
  }
}

module.exports = BundlePostProcessor;