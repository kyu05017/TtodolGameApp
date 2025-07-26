# 안드로이드 스튜디오 설치부터 Expo 빌드까지 완전 가이드

## 📋 목차
1. [개발 환경 준비](#1-개발-환경-준비)
2. [안드로이드 스튜디오 설치 및 설정](#2-안드로이드-스튜디오-설치-및-설정)
3. [안드로이드 에뮬레이터 설정](#3-안드로이드-에뮬레이터-설정)
4. [Expo 프로젝트 설정](#4-expo-프로젝트-설정)
5. [Expo 안드로이드 빌드](#5-expo-안드로이드-빌드)
6. [일반적인 문제 해결](#6-일반적인-문제-해결)

---

## 1. 개발 환경 준비

### 1.1 시스템 요구사항
- **OS**: Windows 10/11, macOS 10.14+, Ubuntu 18.04+
- **RAM**: 최소 8GB (16GB 권장)
- **저장공간**: 최소 10GB 여유 공간
- **CPU**: Intel i5 이상 또는 동급

### 1.2 필수 소프트웨어
```bash
# Node.js 설치 (NVM 사용 권장)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
node --version  # v18.x.x 확인

# Java 11 설치 (Ubuntu/Debian)
sudo apt update
sudo apt install openjdk-11-jdk
java -version  # Java 11 확인

# Java 11 설치 (macOS)
brew install openjdk@11
sudo ln -sfn $(brew --prefix)/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk
java -version
```

---

## 2. 안드로이드 스튜디오 설치 및 설정

### 2.1 안드로이드 스튜디오 다운로드 및 설치

#### Ubuntu/Debian:
```bash
# Snap으로 설치 (권장)
sudo snap install android-studio --classic

# 또는 수동 설치
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2024.3.1.19/android-studio-2024.3.1.19-linux.tar.gz
sudo tar -xzf android-studio-*.tar.gz -C /opt/
sudo ln -s /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio
```

#### macOS:
```bash
# Homebrew로 설치
brew install --cask android-studio

# 또는 공식 웹사이트에서 다운로드
# https://developer.android.com/studio
```

#### Windows:
- [공식 웹사이트](https://developer.android.com/studio)에서 설치 파일 다운로드
- 설치 마법사 실행 및 기본 설정으로 설치

### 2.2 안드로이드 스튜디오 초기 설정

1. **안드로이드 스튜디오 실행**
   ```bash
   android-studio  # Linux
   # macOS/Windows: 앱 아이콘 클릭
   ```

2. **초기 설정 마법사**
   - "Do not import settings" 선택
   - "Standard" 설치 유형 선택
   - UI 테마 선택 (개인 취향)
   - SDK Components 확인:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device (AVD)
   - "Finish" 클릭 및 다운로드 대기

3. **SDK Manager 설정** (중요!)
   - Welcome 화면에서 "More Actions" → "SDK Manager"
   - 또는 Settings → Appearance & Behavior → System Settings → Android SDK

   **SDK Platforms 탭:**
   - ✅ Android 14.0 (API 34)
   - ✅ Android 13.0 (API 33)
   - ✅ Android 12.0 (API 31)
   
   **SDK Tools 탭:**
   - ✅ Android SDK Build-Tools 35.0.0
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Command-line Tools (latest)
   - ✅ Intel x86 Emulator Accelerator (HAXM) - Intel CPU
   - ✅ Google Play services
   - ✅ Google Play Instant Development SDK

4. **환경 변수 설정**

   #### Linux/macOS (~/.bashrc 또는 ~/.zshrc):
   ```bash
   # Android SDK 경로 설정
   export ANDROID_HOME=$HOME/Android/Sdk
   export ANDROID_SDK_ROOT=$ANDROID_HOME
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   
   # 설정 적용
   source ~/.bashrc  # 또는 source ~/.zshrc
   ```

   #### Windows (시스템 환경 변수):
   ```
   ANDROID_HOME = C:\Users\%USERNAME%\AppData\Local\Android\Sdk
   ANDROID_SDK_ROOT = %ANDROID_HOME%
   
   Path에 추가:
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

5. **설치 확인**
   ```bash
   adb --version
   # Android Debug Bridge version 1.0.41
   
   emulator -version
   # Android emulator version ...
   ```

---

## 3. 안드로이드 에뮬레이터 설정

### 3.1 AVD (Android Virtual Device) 생성

1. **AVD Manager 열기**
   - Welcome 화면: "More Actions" → "Virtual Device Manager"
   - 프로젝트 열린 후: Tools → AVD Manager

2. **새 가상 디바이스 생성**
   - "Create Virtual Device" 클릭
   - 디바이스 선택:
     - **권장**: Pixel 6 Pro
     - **대안**: Pixel 7, Pixel 8
   - "Next" 클릭

3. **시스템 이미지 선택**
   - **권장**: API 34 (Android 14) - Google Play 포함
   - x86_64 아키텍처 선택 (더 빠름)
   - "Download" 클릭하여 이미지 다운로드
   - "Next" 클릭

4. **AVD 설정**
   - AVD Name: `Pixel_6_Pro_API_34`
   - Graphics: **Hardware - GLES 2.0** (권장)
   - Advanced Settings:
     - RAM: 2048 MB 이상
     - VM Heap: 256 MB
     - Internal Storage: 2048 MB 이상
     - SD Card: 512 MB
   - "Finish" 클릭

### 3.2 에뮬레이터 성능 최적화

#### Intel CPU (HAXM):
```bash
# Linux
sudo apt-get install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
sudo adduser $USER kvm

# macOS
# HAXM은 Android Studio와 함께 설치됨

# Windows
# Android Studio SDK Manager에서 Intel x86 Emulator Accelerator 설치
```

#### AMD CPU:
- Windows: Windows Hypervisor Platform 활성화
- Linux: KVM 설치 및 설정

### 3.3 에뮬레이터 실행
```bash
# 명령줄에서 실행
emulator -avd Pixel_6_Pro_API_34

# 또는 AVD Manager에서 ▶️ 버튼 클릭
```

---

## 4. Expo 프로젝트 설정

### 4.1 Expo CLI 설치
```bash
# Expo CLI 설치
npm install -g expo-cli @expo/cli

# EAS CLI 설치 (빌드용)
npm install -g eas-cli

# 버전 확인
npx expo --version
eas --version
```

### 4.2 프로젝트 의존성 설치
```bash
# 프로젝트 디렉토리로 이동
cd /path/to/TtodolGameApp

# Node.js 18 사용
nvm use 18

# 기존 모듈 삭제 및 재설치
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 4.3 프로젝트 설정 확인

#### app.json 확인:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./src/assets/images/icon.png",
    "platforms": ["ios", "android", "web"],
    "android": {
      "package": "com.yourcompany.yourapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./src/assets/images/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "splash": {
      "image": "./src/assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    }
  }
}
```

#### metro.config.js 확인:
```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 추가 파일 확장자 지원
config.resolver.assetExts.push('mp3', 'wav');

module.exports = config;
```

---

## 5. Expo 안드로이드 빌드

### 5.1 개발 빌드 (로컬)

#### 첫 빌드 전 준비:
```bash
# 에뮬레이터 실행 확인
adb devices
# List of devices attached
# emulator-5554	device

# Expo 개발 서버 시작
npx expo start

# 새 터미널에서 안드로이드 빌드
npx expo run:android
```

### 5.2 일반적인 빌드 에러 해결

#### 1. splashscreen_logo not found 에러:
```bash
# 스플래시 이미지 복사
cp src/assets/images/splash.png android/app/src/main/res/drawable/splashscreen_logo.png

# colors.xml에 색상 추가
echo '<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <color name="splashscreen_background">#FFFFFF</color>
  <color name="iconBackground">#FFFFFF</color>
</resources>' > android/app/src/main/res/values/colors.xml
```

#### 2. R class not found 에러:
```bash
# Gradle clean
cd android && ./gradlew clean && cd ..

# 패키지명 확인 (app.json과 build.gradle 일치)
# android/app/build.gradle:
# namespace "com.yourcompany.yourapp"
# applicationId "com.yourcompany.yourapp"
```

#### 3. 빌드 캐시 문제:
```bash
# 전체 캐시 초기화
cd android
./gradlew clean
rm -rf .gradle
cd ..
rm -rf node_modules
npm install --legacy-peer-deps
npx expo prebuild --clear
npx expo run:android
```

### 5.3 빌드 성공 후

빌드가 성공하면:
1. 에뮬레이터에 앱이 자동으로 설치됨
2. Metro 번들러가 자동으로 시작됨
3. 앱이 자동으로 실행됨

개발 중 변경사항:
- JavaScript 코드: 자동으로 Hot Reload
- Native 코드 변경: `npx expo run:android` 재실행 필요

---

## 6. 일반적인 문제 해결

### 6.1 에뮬레이터 문제

#### 에뮬레이터가 시작되지 않음:
```bash
# HAXM 확인 (Intel)
emulator -accel-check

# KVM 확인 (Linux)
kvm-ok

# 수동으로 에뮬레이터 시작
emulator -avd Pixel_6_Pro_API_34 -no-snapshot-load
```

#### 에뮬레이터가 느림:
- Graphics를 "Hardware - GLES 2.0"로 변경
- RAM 증가 (4096 MB)
- CPU 코어 수 증가
- Snapshot 비활성화

### 6.2 빌드 문제

#### Gradle 데몬 문제:
```bash
cd android
./gradlew --stop
./gradlew clean
cd ..
```

#### 의존성 문제:
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
rm -rf android/app/build
npm cache clean --force
npm install --legacy-peer-deps
```

#### Java 버전 문제:
```bash
# Java 11 확인
java -version
javac -version

# JAVA_HOME 설정
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

### 6.3 Metro 번들러 문제

#### 포트 충돌:
```bash
# 8081 포트 사용 중인 프로세스 확인
lsof -i :8081  # macOS/Linux
netstat -ano | findstr :8081  # Windows

# 프로세스 종료
kill -9 <PID>  # macOS/Linux
```

#### 캐시 문제:
```bash
npx expo start --clear
# 또는
npx react-native start --reset-cache
```

### 6.4 성능 팁

1. **개발 중 성능 향상:**
   - 불필요한 console.log 제거
   - 개발자 메뉴에서 "Disable Fast Refresh" 해제
   - Chrome DevTools 연결 해제

2. **빌드 속도 향상:**
   - Gradle 데몬 메모리 증가: `org.gradle.jvmargs=-Xmx4096m`
   - 병렬 빌드 활성화: `org.gradle.parallel=true`

3. **에뮬레이터 성능:**
   - x86_64 이미지 사용
   - Hardware acceleration 활성화
   - Snapshot 사용

---

## 🎯 빠른 시작 체크리스트

1. ✅ Node.js 18 설치 및 사용
2. ✅ Java 11 설치
3. ✅ Android Studio 설치
4. ✅ SDK 및 Build Tools 설치
5. ✅ 환경 변수 설정 (ANDROID_HOME)
6. ✅ AVD 생성 (Pixel 6 Pro API 34)
7. ✅ 에뮬레이터 실행
8. ✅ Expo CLI 설치
9. ✅ 프로젝트 의존성 설치 (--legacy-peer-deps)
10. ✅ `npx expo run:android` 실행

---

## 📚 추가 참고 자료

- [Expo 공식 문서](https://docs.expo.dev/)
- [React Native 환경 설정](https://reactnative.dev/docs/environment-setup)
- [Android Studio 사용자 가이드](https://developer.android.com/studio/intro)
- [Android Emulator 문서](https://developer.android.com/studio/run/emulator)

---

이 가이드를 따라하면 안드로이드 스튜디오 설치부터 Expo 앱 빌드까지 성공적으로 완료할 수 있습니다. 문제가 발생하면 [문제 해결](#6-일반적인-문제-해결) 섹션을 참조하세요.