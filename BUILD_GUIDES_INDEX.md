# 뜨돌 게임 빌드 가이드 모음

## 📋 빌드 가이드 목록

### 1. 🌐 웹 빌드 가이드
- **파일**: [WEB_BUILD_GUIDE.md](./WEB_BUILD_GUIDE.md)
- **설명**: 웹 브라우저에서 실행할 수 있는 버전 빌드
- **장점**: 별도 설치 없이 브라우저에서 바로 테스트 가능
- **용도**: 빠른 프로토타입 테스트, 크로스 플랫폼 호환성 확인

### 2. 🤖 Android 빌드 가이드
- **파일**: [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md)
- **설명**: Android 스마트폰/태블릿용 APK 빌드
- **장점**: 네이티브 성능, 모바일 특화 기능 사용 가능
- **용도**: 실제 Android 디바이스에서 테스트 및 배포

### 3. 🍎 iOS 빌드 가이드
- **파일**: [IOS_BUILD_GUIDE.md](./IOS_BUILD_GUIDE.md)
- **설명**: iPhone/iPad용 앱 빌드
- **장점**: iOS 생태계 최적화, App Store 배포 가능
- **용도**: Apple 디바이스에서 테스트 및 App Store 출시

## 🚀 빠른 시작 가이드

### 웹 테스트 (가장 빠른 방법)
```bash
cd /home/kyu05017/ttodol_game_reactNative/TtodolGameApp
npm run web
# 브라우저에서 http://localhost:3000 접속
```

### 모바일 테스트
1. **Android**: Android Studio 설치 후 에뮬레이터 실행
2. **iOS**: macOS + Xcode 필요, 시뮬레이터 실행

## 🛠️ 개발 환경별 권장사항

### 초기 개발 및 테스트
- **권장**: 웹 빌드 사용
- **이유**: 빠른 개발 사이클, 브라우저 디버깅 도구 활용

### 모바일 기능 테스트
- **권장**: Android/iOS 빌드 사용
- **이유**: 터치 인터페이스, 센서, 네이티브 기능 테스트

### 배포 준비
- **웹**: 정적 파일 호스팅 (GitHub Pages, Netlify 등)
- **Android**: Google Play Store 또는 APK 직접 배포
- **iOS**: App Store 또는 TestFlight 배포

## 📊 플랫폼별 특징 비교

| 플랫폼 | 개발 편의성 | 배포 용이성 | 성능 | 네이티브 기능 |
|--------|-------------|-------------|------|---------------|
| 웹     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Android| ⭐⭐⭐     | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| iOS    | ⭐⭐       | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🔍 문제 해결 순서

1. **웹 빌드 먼저 테스트** - 기본 로직 검증
2. **React Native doctor 실행** - 환경 설정 확인
3. **플랫폼별 가이드 참조** - 상세 설정 방법
4. **커뮤니티 문서 참조** - React Native 공식 문서

## 📞 추가 도움이 필요한 경우

- **React Native 공식 문서**: https://reactnative.dev/docs/getting-started
- **Metro 번들러**: https://metrobundler.dev/
- **Webpack**: https://webpack.js.org/
- **Android 개발자**: https://developer.android.com/
- **iOS 개발자**: https://developer.apple.com/

---

**💡 팁**: 개발 초기에는 웹 빌드로 빠르게 프로토타입을 만들고, 나중에 모바일 플랫폼으로 확장하는 것이 효율적입니다!