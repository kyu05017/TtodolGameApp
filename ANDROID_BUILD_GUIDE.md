# Android 빌드 가이드

## 🔧 환경 설정

### 1. 필수 소프트웨어 설치
```bash
# Java JDK 17 설치 (권장)
sudo apt update
sudo apt install -y openjdk-17-jdk

# Android Studio 설치
sudo snap install android-studio --classic
```

### 2. Android SDK 설정
```bash
# Android SDK 명령줄 도구 설치
cd ~
wget https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip
unzip commandlinetools-linux-10406996_latest.zip
mkdir -p Android/Sdk/cmdline-tools
mv cmdline-tools Android/Sdk/cmdline-tools/latest

# 환경 변수 설정
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

### 3. Android SDK 패키지 설치
```bash
# SDK 라이선스 동의
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses

# 필수 패키지 설치
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

## 🏗️ 빌드 과정

### 1. Metro 번들러 시작
```bash
# 첫 번째 터미널에서 실행
cd /home/kyu05017/ttodol_game_reactNative/TtodolGameApp
npm start
```

### 2. Android 빌드 및 실행
```bash
# 두 번째 터미널에서 실행
cd /home/kyu05017/ttodol_game_reactNative/TtodolGameApp
npm run android
```

## 📱 디바이스 설정

### 1. Android 에뮬레이터 설정
```bash
# Android Studio 실행
android-studio

# AVD Manager에서 가상 디바이스 생성
# Tools > AVD Manager > Create Virtual Device
```

### 2. 실제 디바이스 연결
```bash
# USB 디버깅 활성화 (개발자 옵션)
# 설정 > 개발자 옵션 > USB 디버깅 활성화

# 디바이스 연결 확인
adb devices
```

## 🔍 문제 해결

### 1. 환경 진단
```bash
# React Native 환경 확인
npx react-native doctor
```

### 2. 일반적인 오류 해결

#### Gradle 오류
```bash
# Gradle 캐시 삭제
cd android
./gradlew clean
```

#### Metro 캐시 삭제
```bash
# Metro 캐시 초기화
npx react-native start --reset-cache
```

#### 포트 충돌 해결
```bash
# 8081 포트 사용 중인 프로세스 종료
sudo lsof -ti:8081 | xargs kill -9
```

### 3. 빌드 오류 해결
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# Android 폴더 정리
cd android
./gradlew clean
cd ..
```

## 📦 릴리즈 빌드

### 1. 키스토어 생성
```bash
# 릴리즈 키 생성
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 릴리즈 빌드 실행
```bash
# 릴리즈 APK 생성
cd android
./gradlew assembleRelease
```

### 3. APK 위치
```
android/app/build/outputs/apk/release/app-release.apk
```

## 🚀 배포 준비

### 1. APK 서명 확인
```bash
# APK 서명 정보 확인
keytool -printcert -jarfile app-release.apk
```

### 2. Google Play Console 업로드
- AAB 형식으로 빌드: `./gradlew bundleRelease`
- Play Console에서 앱 업로드

## 📝 개발 팁

### 1. 디버깅
- Chrome DevTools 연결: `chrome://inspect`
- React Native Debugger 사용
- Flipper 디버깅 도구 활용

### 2. 성능 최적화
- Hermes 엔진 활성화 (기본값)
- 번들 크기 최적화
- 네이티브 모듈 최적화

### 3. 테스트
```bash
# 단위 테스트 실행
npm test

# Android 테스트 실행
cd android
./gradlew test
```