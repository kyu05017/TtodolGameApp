#!/usr/bin/env node

/**
 * 최적화된 Android 빌드 스크립트
 * Metro 번들링부터 후처리까지 전체 빌드 파이프라인을 관리합니다.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const BundlePostProcessor = require('./post-bundle-processor');

class OptimizedAndroidBuilder {
  constructor(options = {}) {
    this.options = {
      verbose: options.verbose || false,
      skipCache: options.skipCache || false,
      production: options.production !== false,
      postProcess: options.postProcess !== false,
      ...options
    };
    
    this.projectRoot = process.cwd();
    this.buildDir = path.join(this.projectRoot, 'dist-android');
    this.bundlePath = path.join(this.buildDir, 'index.android.bundle');
  }
  
  log(message, level = 'info') {
    if (this.options.verbose || level === 'error') {
      const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅';
      console.log(`${prefix} [AndroidBuilder] ${message}`);
    }
  }
  
  async build() {
    console.log('🚀 Starting optimized Android build...\n');
    
    try {
      // 1. 환경 준비
      await this.prepareEnvironment();
      
      // 2. 의존성 설치 및 캐시 정리
      await this.prepareDependencies();
      
      // 3. React Native 번들 생성
      await this.createBundle();
      
      // 4. 번들 후처리
      if (this.options.postProcess) {
        await this.postProcessBundle();
      }
      
      // 5. Android 앱 빌드
      await this.buildAndroidApp();
      
      // 6. 빌드 검증
      await this.validateBuild();
      
      console.log('\n✅ Optimized Android build completed successfully!');
      
    } catch (error) {
      console.error('\n❌ Build failed:', error.message);
      if (this.options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
  
  async prepareEnvironment() {
    this.log('Preparing build environment...');
    
    // 빌드 디렉토리 생성
    if (!fs.existsSync(this.buildDir)) {
      fs.mkdirSync(this.buildDir, { recursive: true });
    }
    
    // 환경 변수 설정
    process.env.NODE_ENV = this.options.production ? 'production' : 'development';
    process.env.PLATFORM = 'android';
    process.env.BUNDLE_COMMAND = 'bundle';
    
    this.log('Environment prepared');
  }
  
  async prepareDependencies() {
    this.log('Preparing dependencies...');
    
    if (this.options.skipCache) {
      this.log('Clearing Metro cache...');
      try {
        execSync('npx expo start --clear', { stdio: 'pipe' });
        this.log('Metro cache cleared');
      } catch (error) {
        this.log('Could not clear Metro cache, continuing...', 'warn');
      }
    }
    
    // node_modules 확인
    if (!fs.existsSync(path.join(this.projectRoot, 'node_modules'))) {
      this.log('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    }
    
    this.log('Dependencies ready');
  }
  
  async createBundle() {
    this.log('Creating React Native bundle...');
    
    const bundleCommand = [
      'npx', 'expo', 'export:embed',
      '--platform', 'android',
      '--entry-file', 'index.js',
      '--bundle-output', this.bundlePath,
      '--assets-dest', this.buildDir,
      '--dev', this.options.production ? 'false' : 'true',
      '--minify', this.options.production ? 'true' : 'false',
      '--reset-cache'
    ];
    
    if (this.options.verbose) {
      this.log(`Running: ${bundleCommand.join(' ')}`);
    }
    
    try {
      execSync(bundleCommand.join(' '), { 
        stdio: this.options.verbose ? 'inherit' : 'pipe',
        cwd: this.projectRoot 
      });
      this.log('Bundle created successfully');
    } catch (error) {
      // Expo 명령이 실패하면 Metro CLI로 대체
      this.log('Expo bundle failed, trying Metro CLI...', 'warn');
      
      const metroCommand = [
        'npx', 'metro', 'build',
        '--entry-file', 'index.js',
        '--platform', 'android',
        '--dev', this.options.production ? 'false' : 'true',
        '--minify', this.options.production ? 'true' : 'false',
        '--bundle-output', this.bundlePath,
        '--assets-dest', this.buildDir,
        '--reset-cache'
      ];
      
      execSync(metroCommand.join(' '), { 
        stdio: this.options.verbose ? 'inherit' : 'pipe',
        cwd: this.projectRoot 
      });
      this.log('Bundle created with Metro CLI');
    }
    
    // 번들 파일 존재 확인
    if (!fs.existsSync(this.bundlePath)) {
      throw new Error(`Bundle file not created: ${this.bundlePath}`);
    }
    
    const bundleSize = fs.statSync(this.bundlePath).size;
    this.log(`Bundle size: ${this.formatBytes(bundleSize)}`);
  }
  
  async postProcessBundle() {
    this.log('Post-processing bundle...');
    
    const processor = new BundlePostProcessor({
      verbose: this.options.verbose,
      backup: true,
      outputStats: true
    });
    
    try {
      processor.processBundle(this.bundlePath);
      this.log('Bundle post-processing completed');
    } catch (error) {
      this.log(`Bundle post-processing failed: ${error.message}`, 'warn');
      this.log('Continuing with original bundle...', 'warn');
    }
  }
  
  async buildAndroidApp() {
    this.log('Building Android app...');
    
    // Android 디렉토리 확인
    const androidDir = path.join(this.projectRoot, 'android');
    if (!fs.existsSync(androidDir)) {
      throw new Error('Android directory not found. Run expo prebuild first.');
    }
    
    // 번들을 Android assets 디렉토리로 복사
    const androidAssetsDir = path.join(androidDir, 'app/src/main/assets');
    if (!fs.existsSync(androidAssetsDir)) {
      fs.mkdirSync(androidAssetsDir, { recursive: true });
    }
    
    const androidBundlePath = path.join(androidAssetsDir, 'index.android.bundle');
    fs.copyFileSync(this.bundlePath, androidBundlePath);
    this.log('Bundle copied to Android assets');
    
    // Gradle 빌드 실행
    const gradleCommand = this.options.production 
      ? './gradlew assembleRelease'
      : './gradlew assembleDebug';
    
    this.log(`Running: ${gradleCommand}`);
    
    try {
      execSync(gradleCommand, {
        stdio: this.options.verbose ? 'inherit' : 'pipe',
        cwd: androidDir
      });
      
      this.log('Android app built successfully');
    } catch (error) {
      throw new Error(`Android build failed: ${error.message}`);
    }
  }
  
  async validateBuild() {
    this.log('Validating build...');
    
    const androidDir = path.join(this.projectRoot, 'android');
    const buildType = this.options.production ? 'release' : 'debug';
    const apkPath = path.join(androidDir, `app/build/outputs/apk/${buildType}/app-${buildType}.apk`);
    
    if (fs.existsSync(apkPath)) {
      const apkSize = fs.statSync(apkPath).size;
      this.log(`APK created: ${apkPath}`);
      this.log(`APK size: ${this.formatBytes(apkSize)}`);
    } else {
      this.log('APK file not found, but build may have succeeded', 'warn');
    }
    
    // 번들 품질 검사
    const bundleContent = fs.readFileSync(this.bundlePath, 'utf8');
    
    const issues = [];
    if (bundleContent.includes('require()')) {
      issues.push('Empty require() calls found');
    }
    if (bundleContent.includes('@babel/runtime/helpers')) {
      issues.push('Babel runtime helpers still present');
    }
    if (bundleContent.includes('undefined()')) {
      issues.push('Undefined function calls found');
    }
    
    if (issues.length > 0) {
      this.log('Bundle validation warnings:', 'warn');
      issues.forEach(issue => this.log(`  - ${issue}`, 'warn'));
    } else {
      this.log('Bundle validation passed');
    }
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
  
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    skipCache: args.includes('--skip-cache'),
    production: !args.includes('--dev'),
    postProcess: !args.includes('--no-post-process')
  };
  
  const builder = new OptimizedAndroidBuilder(options);
  builder.build();
}

module.exports = OptimizedAndroidBuilder;