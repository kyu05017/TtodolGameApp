# 또돌 수박게임 테스트 가이드 🍉

이 프로젝트는 React Native로 개발된 수박게임으로, **웹과 모바일 모두에서 테스트**할 수 있습니다.

## 🚀 빠른 시작

### 1. 패키지 설치
```bash
npm install
```

### 2. 웹 버전 테스트
```bash
# 웹 개발 서버 실행
npm run web-dev

# 또는 자동으로 브라우저 열기
npm run web
```
- 브라우저에서 `http://localhost:3000` 접속
- 크롬 개발자 도구에서 모바일 뷰 테스트 가능

### 3. 모바일 버전 테스트 (Android/iOS)

#### Metro 서버 시작
```bash
npm run start
```

#### Android 테스트
```bash
# Android 에뮬레이터 또는 실제 기기에서
npm run android
```

#### iOS 테스트 (macOS만 가능)
```bash
# iOS 시뮬레이터에서
npm run ios
```

### 4. 동시 개발 환경
```bash
# 웹과 모바일 서버를 동시에 실행
npm run start-both
```

## 🎮 게임 기능 테스트

### 웹 버전에서 테스트할 수 있는 기능:
✅ 게임 시작 모달  
✅ 과일 미리보기 (반투명)  
✅ 마우스로 과일 드래그 & 드롭  
✅ 과일 합치기  
✅ 점수 애니메이션  
✅ 플레이타임 표시  
✅ 게임 일시정지/재시작  

### 모바일 버전에서 테스트할 수 있는 기능:
✅ 모든 웹 기능 + 터치 제스처  
✅ 기기 회전 지원  
✅ 햅틱 피드백 (실제 기기)  
✅ 사운드 재생  

## 🌐 접속 URL

### 로컬 테스트
- **웹**: http://localhost:3000
- **모바일 Metro**: http://localhost:8081

### 네트워크 테스트
웹 서버는 네트워크에서도 접근 가능합니다:
- 같은 Wi-Fi의 다른 기기에서 `http://[IP주소]:3000` 접속

## 🛠️ 개발 도구

### 웹 디버깅
- Chrome DevTools 사용
- React Developer Tools 확장 프로그램 추천

### 모바일 디버깅
- **Android**: Chrome DevTools 원격 디버깅
- **iOS**: Safari Web Inspector
- **React Native**: Flipper 또는 React Native Debugger

## 📱 반응형 테스트

### 웹에서 모바일 시뮬레이션
1. Chrome DevTools 열기 (F12)
2. Device Toolbar 클릭 (Ctrl+Shift+M)
3. 다양한 기기 크기로 테스트:
   - iPhone 12/13/14
   - Galaxy S21
   - iPad
   - Custom 크기

## 🔧 문제 해결

### 포트 충돌 시
```bash
# 다른 포트로 웹 서버 실행
npx webpack serve --config webpack.config.js --mode development --port 3001
```

### 모바일 연결 안 될 때
```bash
# Metro 서버 재시작
npx react-native start --reset-cache
```

### 빌드 오류 시
```bash
# 캐시 클리어 후 재설치
rm -rf node_modules
npm install
```

## 📋 테스트 체크리스트

### 🌐 웹 테스트
- [ ] 페이지 로딩
- [ ] 게임 시작 모달 표시
- [ ] 과일 미리보기 기능
- [ ] 마우스 드래그로 과일 이동
- [ ] 클릭으로 과일 드롭
- [ ] 과일 합치기 애니메이션
- [ ] 점수 증가 효과
- [ ] 게임 오버 처리
- [ ] 반응형 디자인

### 📱 모바일 테스트
- [ ] 앱 설치 및 실행
- [ ] 터치 제스처 반응
- [ ] 기기 회전 대응
- [ ] 사운드 재생
- [ ] 성능 최적화
- [ ] 메모리 사용량

## 🚀 배포 테스트

### 웹 빌드
```bash
npm run build-web
```
빌드된 파일: `dist/` 폴더

### 모바일 릴리스 빌드
```bash
# Android
cd android && ./gradlew assembleRelease

# iOS (macOS만 가능)
cd ios && xcodebuild -configuration Release
```

---

**즐거운 게임 테스트하세요!** 🎮✨