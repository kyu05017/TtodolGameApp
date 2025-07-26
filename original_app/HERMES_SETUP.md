# 🚀 Hermes 엔진 설정 가이드

## 📋 설정 완료 사항

### 1. Babel 설정 최적화
- `babel.config.js`에 Hermes 호환 플러그인 추가
- Flow 타입 제거, 클래스 프로퍼티, 프라이빗 메서드 지원
- 프로덕션에서 console 제거 최적화

### 2. Hermes 활성화
- `android/gradle.properties`에서 `hermesEnabled=true` 설정

### 3. Metro 설정 최적화
- Hermes 파서 활성화
- 웹 전용 모듈 제외 설정
- 바이트코드 최적화 설정

### 4. Hermes 런타임 설정
- `.hermesrc` 파일로 컴파일러 최적화 옵션 설정

## 🔧 필요한 패키지 설치

다음 명령어로 새로운 Babel 플러그인들을 설치하세요:

\`\`\`bash
npm install --save-dev \
  @babel/plugin-proposal-class-properties \
  @babel/plugin-proposal-private-methods \
  @babel/plugin-transform-flow-strip-types \
  @babel/plugin-transform-remove-console \
  @babel/plugin-transform-runtime \
  babel-plugin-transform-remove-console
\`\`\`

## 🏗️ 빌드 과정

### 1. 캐시 클리어
\`\`\`bash
npx react-native start --reset-cache
\`\`\`

### 2. Android 빌드
\`\`\`bash
cd android
./gradlew clean
cd ..
npx react-native run-android
\`\`\`

## 📊 예상 성능 개선

### 앱 시작 시간
- **이전**: JSC 기반
- **개선**: 30-50% 빠른 시작 시간

### 메모리 사용량
- **이전**: 높은 메모리 사용
- **개선**: 20-30% 메모리 사용량 감소

### 게임 성능
- **Matter.js 물리엔진**: 더 부드러운 물리 시뮬레이션
- **애니메이션**: 더 매끄러운 60fps 유지
- **오디오**: 더 안정적인 오디오 재생

## 🐛 문제 해결

### 빌드 에러 시
1. **Metro 캐시 클리어**:
   \`\`\`bash
   npx react-native start --reset-cache
   \`\`\`

2. **Android 클린 빌드**:
   \`\`\`bash
   cd android && ./gradlew clean && cd ..
   \`\`\`

3. **node_modules 재설치**:
   \`\`\`bash
   rm -rf node_modules && npm install
   \`\`\`

### 런타임 에러 시
1. **콘솔 로그 확인**:
   \`\`\`bash
   npx react-native log-android
   \`\`\`

2. **Hermes 비활성화 테스트**:
   - `android/gradle.properties`에서 `hermesEnabled=false` 임시 설정

## ✅ 검증 방법

### 1. Hermes 활성화 확인
앱 실행 후 개발자 메뉴에서 "Dev Settings" → "Debug" → JS Engine 확인

### 2. 성능 측정
- 앱 시작 시간 측정
- 게임 플레이 시 프레임률 확인
- 메모리 사용량 모니터링

## 🔍 모니터링

### Android Studio Profiler 사용
1. CPU 사용률 모니터링
2. 메모리 힙 분석
3. 네트워크 사용량 확인

### Flipper 사용
1. JavaScript 성능 프로파일링
2. 네트워크 요청 모니터링
3. 로그 분석

## 📝 주의사항

1. **첫 번째 빌드**: Hermes 바이트코드 생성으로 시간이 오래 걸림
2. **디버깅**: 일부 디버깅 기능이 제한될 수 있음
3. **웹 빌드**: 웹 빌드는 여전히 별도 웹팩 설정 사용

## 🎯 최적화 팁

1. **번들 크기 최적화**: 사용하지 않는 라이브러리 제거
2. **이미지 최적화**: WebP 포맷 사용 검토
3. **코드 스플리팅**: 필요 시 동적 임포트 활용
4. **프로파일링**: 정기적인 성능 측정

---

**설정 완료 후 게임 성능이 크게 향상될 것으로 예상됩니다! 🎮**