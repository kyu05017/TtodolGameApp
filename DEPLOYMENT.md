# 뜨돌 게임 - 앱 스토어 배포 가이드

## 📱 앱 정보
- **앱 이름**: 뜨돌 게임
- **설명**: 과일 합치기 퍼즐 게임
- **장르**: 퍼즐/캐주얼 게임
- **지원 플랫폼**: iOS, Android, Web
- **언어**: 한국어 (기본), 영어

## 🏗️ 빌드 준비사항

### 필수 요구사항
- Node.js 18+
- React Native CLI
- Android Studio (Android 빌드용)
- Xcode (iOS 빌드용)

### 환경 설정
```bash
# 의존성 설치
npm install

# iOS pod 설치 (iOS만)
cd ios && pod install && cd ..

# 네이티브 링크
npx react-native link
```

## 🤖 Android 배포

### 1. 릴리즈 키스토어 생성
```bash
cd android/app
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Gradle 설정 업데이트
`android/gradle.properties`에 키스토어 정보 추가:
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=***
MYAPP_RELEASE_KEY_PASSWORD=***
```

### 3. APK/AAB 빌드
```bash
# APK 빌드
cd android && ./gradlew assembleRelease

# AAB 빌드 (Play Store용)
cd android && ./gradlew bundleRelease
```

### 4. Google Play Console 정보
- **패키지명**: com.ttodolgameapp
- **버전코드**: 1
- **버전명**: 1.0
- **최소 SDK**: API 21 (Android 5.0)
- **타겟 SDK**: API 34 (Android 14)

## 🍎 iOS 배포

### 1. Apple Developer 계정 설정
- Bundle Identifier: com.ttodolgameapp
- App Store Connect에서 앱 등록

### 2. iOS 빌드
```bash
# 프로덕션 빌드
npx react-native run-ios --configuration Release

# Archive (Xcode에서)
# Product > Archive
```

### 3. App Store Connect 업로드
- Xcode에서 Organizer를 통해 업로드
- 또는 Application Loader 사용

### 4. iOS App Store 정보
- **Bundle ID**: com.ttodolgameapp
- **버전**: 1.0
- **최소 iOS**: 12.0
- **지원 기기**: iPhone, iPad

## 🌐 웹 배포

### 1. 웹 빌드
```bash
npm run build-web
```

### 2. 배포 옵션
- **Netlify**: `dist` 폴더 직접 업로드
- **Vercel**: GitHub 연동 자동 배포
- **GitHub Pages**: GitHub Actions 활용
- **Firebase Hosting**: Firebase CLI 사용

### 3. PWA 기능
- 오프라인 지원 (Service Worker)
- 홈스크린 추가 가능
- 푸시 알림 지원

## 📊 앱 스토어 최적화 (ASO)

### 키워드
- 과일 게임
- 퍼즐 게임
- 합치기 게임
- 캐주얼 게임
- 뜨돌 게임
- 수박 게임

### 스크린샷 가이드
1. **메인 화면**: 게임 로고와 시작 버튼
2. **게임플레이**: 과일 떨어뜨리는 모습
3. **합치기**: 과일이 합쳐지는 순간
4. **고득점**: 높은 점수 달성 화면
5. **모드 선택**: 다양한 게임 모드

### 앱 설명 (한국어)
```
🍎 뜨돌 게임 - 중독성 강한 과일 합치기 퍼즐!

같은 과일끼리 합쳐서 더 큰 과일을 만들어보세요!
체리부터 시작해서 최종 목표인 수박까지!

🎮 게임 특징:
• 간단하지만 중독성 강한 게임플레이
• 다양한 게임 모드 (일반, 시간제한, 목표점수 등)
• 아름다운 과일 그래픽과 부드러운 물리 엔진
• 오프라인에서도 플레이 가능
• 햅틱 피드백으로 생생한 게임 경험

🏆 도전 과제:
• 최고 점수 갱신하기
• 모든 과일 종류 수집하기
• 다양한 게임 모드 마스터하기

지금 다운로드하고 친구들과 점수를 겨뤄보세요!
```

### 앱 설명 (영어)
```
🍎 Ttodol Game - Addictive Fruit Merging Puzzle!

Merge same fruits to create bigger ones!
Start from cherry and reach the ultimate watermelon!

🎮 Features:
• Simple but addictive gameplay
• Multiple game modes (Normal, Time Attack, Target Score, etc.)
• Beautiful fruit graphics with smooth physics
• Offline play support
• Haptic feedback for immersive experience

🏆 Challenges:
• Beat your high score
• Collect all fruit types
• Master different game modes

Download now and compete with friends!
```

## 🔧 배포 전 체크리스트

### 기능 테스트
- [ ] 모든 게임 모드 정상 작동
- [ ] 오디오 재생/정지 기능
- [ ] 햅틱 피드백 작동 (모바일)
- [ ] 점수 저장/불러오기
- [ ] 설정 저장 기능
- [ ] 앱 아이콘 표시
- [ ] 스플래시 스크린 표시

### 성능 테스트
- [ ] 메모리 누수 확인
- [ ] CPU 사용률 최적화
- [ ] 배터리 소모량 확인
- [ ] 네트워크 연결 없이 작동

### 플랫폼별 테스트
- [ ] Android: 다양한 화면 크기 대응
- [ ] iOS: 노치/다이나믹 아일랜드 대응
- [ ] Web: 다양한 브라우저 호환성

## 📈 출시 후 관리

### 분석 도구
- Google Analytics (웹)
- Firebase Analytics (모바일)
- App Store Connect Analytics (iOS)
- Google Play Console (Android)

### 업데이트 계획
- 버그 수정 패치: 즉시
- 새로운 게임 모드: 월 1회
- 메이저 업데이트: 분기 1회

### 사용자 피드백 수집
- 앱 스토어 리뷰 모니터링
- 소셜 미디어 피드백 수집
- 사용자 설문조사 실시

## 🛡️ 보안 및 개인정보

### 데이터 처리
- 로컬 저장만 사용 (AsyncStorage/localStorage)
- 서버로 개인정보 전송 안함
- 광고 없음 (현재 버전)

### 권한 최소화
- Android: VIBRATE, WAKE_LOCK만 사용
- iOS: 추가 권한 없음
- 카메라, 마이크, 위치 등 불필요한 권한 요청 안함

---

**개발자**: 뜨돌 게임 팀
**문의**: [연락처 정보]
**버전**: 1.0.0
**최종 업데이트**: 2025-07-20