# 📱 안드로이드 개발 환경 설정 가이드

## 🔍 현재 상태
- ✅ Node.js 설치됨
- ✅ npm 설치됨
- ✅ Gradle 설치됨
- ❌ Android Studio 미설치
- ❌ Android SDK 미설치
- ❌ Java 버전 호환성 문제 (21.0.7 → 17-20 필요)

## 🎯 해결 방법

### 옵션 1: 웹 개발 집중 (권장)
현재 웹에서 완벽하게 작동하는 환경이 구축되어 있습니다.

```bash
# 웹에서 개발 및 테스트
npm run web

# 웹 빌드
npm run build-web
```

**장점:**
- 즉시 사용 가능
- 빠른 개발 사이클
- 동일한 코드베이스로 웹과 모바일 지원

### 옵션 2: 안드로이드 환경 설정 (시간 소요)

#### 1. Java 17 설치
```bash
# OpenJDK 17 설치
sudo apt update
sudo apt install openjdk-17-jdk

# Java 17로 변경
sudo update-alternatives --config java
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

#### 2. Android Studio 설치
```bash
# Android Studio 다운로드
wget -O android-studio.tar.gz https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2024.1.1.12/android-studio-2024.1.1.12-linux.tar.gz

# 압축 해제
tar -xzf android-studio.tar.gz
sudo mv android-studio /opt/

# 실행
/opt/android-studio/bin/studio.sh
```

#### 3. Android SDK 설정
```bash
# 환경 변수 설정 (~/.bashrc 또는 ~/.zshrc에 추가)
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 변경사항 적용
source ~/.bashrc
```

#### 4. 에뮬레이터 생성
Android Studio에서:
1. Tools → AVD Manager
2. Create Virtual Device
3. Phone → Pixel 6 선택
4. System Image → API 34 다운로드
5. 에뮬레이터 생성 및 실행

#### 5. 빌드 테스트
```bash
# 에뮬레이터 실행 후
npm run android
```

### 옵션 3: 실제 안드로이드 디바이스 사용

#### 1. 디바이스 설정
1. 안드로이드 폰에서 "개발자 옵션" 활성화
2. "USB 디버깅" 활성화
3. USB로 컴퓨터 연결

#### 2. 빌드 실행
```bash
# 디바이스 연결 확인
adb devices

# 앱 설치 및 실행
npm run android
```

## 💡 추천 개발 워크플로우

1. **웹에서 개발 및 테스트**
   ```bash
   npm run web
   ```

2. **기능이 완성되면 모바일에서 테스트**
   ```bash
   npm run android
   npm run ios
   ```

3. **배포 전 모든 플랫폼 테스트**

## 🚀 빠른 시작 (웹 개발)

```bash
# 웹 개발 서버 시작
npm run web

# 브라우저에서 http://localhost:3000 접속
# 모바일 시뮬레이션: F12 → 모바일 뷰 선택
```

## 📞 문제 해결

### 자주 발생하는 문제들:

1. **Java 버전 문제**
   ```bash
   java -version  # 17-20 사이여야 함
   ```

2. **Android SDK 경로 문제**
   ```bash
   echo $ANDROID_HOME  # 경로가 표시되어야 함
   ```

3. **에뮬레이터 연결 문제**
   ```bash
   adb devices  # 연결된 디바이스 표시되어야 함
   ```

4. **권한 문제**
   ```bash
   chmod +x android/gradlew
   ```

## 🎯 결론

**웹 개발부터 시작하는 것을 강력히 권장합니다!**

- 즉시 사용 가능한 완벽한 환경
- 빠른 개발 및 테스트
- 나중에 모바일 환경 설정 가능