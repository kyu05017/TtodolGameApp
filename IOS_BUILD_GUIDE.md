# iOS 빌드 가이드

## 🍎 환경 설정 (macOS 필수)

### 1. 필수 소프트웨어 설치
```bash
# Xcode 설치 (App Store에서)
# Command Line Tools 설치
xcode-select --install

# Homebrew 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 및 Watchman 설치
brew install node
brew install watchman

# CocoaPods 설치
sudo gem install cocoapods
```

### 2. iOS 프로젝트 설정
```bash
# 프로젝트 디렉토리로 이동
cd /home/kyu05017/ttodol_game_reactNative/TtodolGameApp

# Ruby 번들러 설치 (이미 설치됨)
bundle install

# CocoaPods 의존성 설치
cd ios
bundle exec pod install
cd ..
```

## 🏗️ 빌드 과정

### 1. Metro 번들러 시작
```bash
# 첫 번째 터미널에서 실행
cd /home/kyu05017/ttodol_game_reactNative/TtodolGameApp
npm start
```

### 2. iOS 빌드 및 실행
```bash
# 두 번째 터미널에서 실행
cd /home/kyu05017/ttodol_game_reactNative/TtodolGameApp
npm run ios
```

## 📱 디바이스 및 시뮬레이터 설정

### 1. iOS 시뮬레이터 실행
```bash
# 특정 디바이스 시뮬레이터 실행
npx react-native run-ios --simulator="iPhone 15"

# 사용 가능한 시뮬레이터 목록 확인
xcrun simctl list devices
```

### 2. 실제 디바이스 연결
```bash
# 실제 iPhone/iPad 연결
npx react-native run-ios --device="Your Device Name"

# 연결된 디바이스 확인
xcrun xctrace list devices
```

## 🔧 Xcode에서 빌드

### 1. Xcode 프로젝트 열기
```bash
# Xcode에서 프로젝트 열기
open ios/TtodolGameApp.xcworkspace
```

### 2. 빌드 설정
- **Team**: Apple Developer 계정 설정
- **Bundle Identifier**: 고유한 번들 ID 설정
- **Deployment Target**: iOS 최소 버전 설정

### 3. 빌드 및 실행
- `Cmd + R`: 빌드 및 실행
- `Cmd + Shift + K`: 클린 빌드
- `Cmd + .`: 빌드 중지

## 🔍 문제 해결

### 1. 일반적인 오류 해결

#### CocoaPods 오류
```bash
# Podfile.lock 삭제 후 재설치
cd ios
rm Podfile.lock
bundle exec pod install --repo-update
```

#### 캐시 관련 오류
```bash
# 다양한 캐시 삭제
npx react-native start --reset-cache
rm -rf ~/Library/Caches/com.apple.dt.Xcode
rm -rf ~/Library/Developer/Xcode/DerivedData
```

#### 시뮬레이터 문제
```bash
# 시뮬레이터 재설정
xcrun simctl erase all
```

### 2. 빌드 오류 해결
```bash
# 노드 모듈 재설치
rm -rf node_modules package-lock.json
npm install

# iOS 폴더 정리
cd ios
rm -rf build
bundle exec pod install
```

## 📦 릴리즈 빌드

### 1. Archive 생성
```bash
# Xcode에서 Archive 생성
# Product > Archive
```

### 2. 앱 서명 설정
- **Development**: 개발 및 테스트용
- **Distribution**: App Store 배포용
- **Ad Hoc**: 특정 디바이스 배포용

### 3. IPA 파일 생성
```bash
# 명령줄에서 Archive 생성
xcodebuild -workspace ios/TtodolGameApp.xcworkspace \
           -scheme TtodolGameApp \
           -configuration Release \
           -archivePath ios/build/TtodolGameApp.xcarchive \
           archive
```

## 🚀 App Store 배포

### 1. App Store Connect 설정
- Apple Developer 계정 필요
- App Store Connect에서 앱 등록
- 메타데이터 및 스크린샷 업로드

### 2. 앱 업로드
```bash
# Xcode에서 App Store Connect에 업로드
# Window > Organizer > Upload to App Store
```

### 3. TestFlight 배포
- 내부 테스터 초대
- 외부 테스터 베타 테스트
- 앱 리뷰 제출

## 📝 개발 팁

### 1. 디버깅
```bash
# Safari 웹 인스펙터 연결
# Safari > Develop > Simulator > JSContext

# Flipper 디버깅 도구 사용
npx flipper
```

### 2. 성능 최적화
- **Instruments** 사용하여 성능 프로파일링
- **Memory Leaks** 체크
- **Network** 요청 최적화

### 3. 테스트
```bash
# 단위 테스트 실행
npm test

# iOS 테스트 실행 (Xcode에서)
# Product > Test (Cmd + U)
```

## 🔒 보안 설정

### 1. 앱 서명 설정
- **Code Signing Identity**: 적절한 인증서 선택
- **Provisioning Profile**: 올바른 프로비저닝 프로필 설정

### 2. 앱 권한 설정
```xml
<!-- ios/TtodolGameApp/Info.plist -->
<key>NSCameraUsageDescription</key>
<string>카메라 권한이 필요합니다</string>
<key>NSMicrophoneUsageDescription</key>
<string>마이크 권한이 필요합니다</string>
```

## ⚠️ 주의사항

### 1. 시스템 요구사항
- **macOS**: 최신 버전 권장
- **Xcode**: 최신 안정 버전
- **iOS**: 최소 iOS 12.0 이상

### 2. 라이선스
- Apple Developer Program 멤버십 필요 (연간 $99)
- 실제 디바이스 테스트 시 필요

### 3. 성능 고려사항
- **메모리 사용량**: iOS는 메모리 제한이 엄격
- **배터리 사용량**: 백그라운드 처리 최적화
- **네트워크**: ATS(App Transport Security) 설정