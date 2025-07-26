# 🚀 통합 개발 가이드라인

## 📋 목표
React Native 앱과 웹 앱을 동일한 코드베이스에서 개발하여 일관된 사용자 경험과 개발 효율성을 제공합니다.

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── common/                 # 공통 컴포넌트
│   │   ├── Button/
│   │   │   ├── Button.js       # 공통 로직 & 기본 구현
│   │   │   ├── Button.web.js   # 웹 전용 구현
│   │   │   └── Button.native.js # 모바일 전용 구현
│   │   └── Modal/
│   │       ├── Modal.js
│   │       ├── Modal.web.js
│   │       └── Modal.native.js
│   ├── game/                   # 게임 전용 컴포넌트
│   └── ui/                     # UI 컴포넌트
├── services/
│   ├── GameService.js          # 공통 서비스
│   ├── GameService.web.js      # 웹 전용 서비스
│   └── GameService.native.js   # 모바일 전용 서비스
├── styles/
│   ├── common.js               # 공통 스타일
│   ├── web.js                  # 웹 전용 스타일
│   └── native.js               # 모바일 전용 스타일
├── utils/
│   ├── platform.js             # 플랫폼 유틸리티
│   └── helpers.js              # 공통 헬퍼
└── constants/
    ├── index.js                # 공통 상수
    └── platform.js             # 플랫폼별 상수
```

## 🔧 개발 규칙

### 1. 파일 네이밍 규칙 (우선순위)
- **1순위**: `Component.js` - 하나의 파일로 웹과 모바일 모두 처리 (권장)
- **2순위**: 플랫폼별 분리 (정말 필요한 경우에만)
  - `Component.web.js` - 웹 브라우저 전용
  - `Component.native.js` - iOS/Android 전용

### 2. 컴포넌트 개발 순서
1. **공통 파일로 시작** (`Component.js`)
2. **Platform.OS 조건부 처리** 활용
3. **정말 다른 부분만 분리** 고려
4. **테스트 작성**

### 3. 스타일링 방식
```javascript
// 공통 스타일 사용
import { colors, sizes, buttonStyles } from '../../styles/common';
import { platformStyle } from '../../utils/platform';

// 플랫폼별 스타일 적용
const style = platformStyle(
  {
    // 웹 전용 스타일
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  {
    // 모바일 전용 스타일
    elevation: 2,
  }
);
```

### 4. 이벤트 처리
```javascript
import { createTouchHandler } from '../../utils/platform';

// 터치/클릭 이벤트 통합
const touchHandler = createTouchHandler(onPress);
```

### 5. 스토리지 사용
```javascript
import { createStorage } from '../../utils/platform';

const storage = createStorage();
await storage.setItem('key', 'value');
const value = await storage.getItem('key');
```

### 6. 알림 처리
```javascript
import { showAlert } from '../../utils/platform';

showAlert('제목', '메시지', [
  { text: '취소', onPress: () => {} },
  { text: '확인', onPress: () => {} }
]);
```

## 🎨 스타일링 시스템

### 색상 사용
```javascript
import { colors } from '../styles/common';

const style = {
  backgroundColor: colors.primary,
  color: colors.textWhite,
  borderColor: colors.secondary,
};
```

### 크기 사용
```javascript
import { sizes } from '../styles/common';

const style = {
  padding: sizes.paddingM,
  fontSize: sizes.fontL,
  borderRadius: sizes.radiusM,
};
```

### 그림자 사용
```javascript
import { shadows } from '../styles/common';

const style = {
  ...shadows.light,
  // 또는
  ...shadows.medium,
  // 또는
  ...shadows.heavy,
};
```

## 🔄 개발 워크플로우

### 새 컴포넌트 추가
1. **공통 컴포넌트 작성**
```javascript
// src/components/common/NewComponent/NewComponent.js
import React from 'react';
import { platformStyle, createTouchHandler } from '../../../utils/platform';
import { colors, sizes } from '../../../styles/common';

const NewComponent = ({ onPress, children, ...props }) => {
  const style = platformStyle(
    { /* 웹 스타일 */ },
    { /* 모바일 스타일 */ }
  );
  
  return (
    <div style={style} {...createTouchHandler(onPress)}>
      {children}
    </div>
  );
};

export default NewComponent;
```

2. **플랫폼별 확장** (필요시)
```javascript
// src/components/common/NewComponent/NewComponent.web.js
import React from 'react';
import BaseComponent from './NewComponent';

const NewComponentWeb = (props) => {
  return <BaseComponent {...props} />;
};

export default NewComponentWeb;
```

### 새 서비스 추가
1. **공통 서비스 작성**
```javascript
// src/services/NewService.js
import { createStorage } from '../utils/platform';

export class NewService {
  constructor() {
    this.storage = createStorage();
  }
  
  async getData() {
    // 공통 로직
  }
}

export default new NewService();
```

2. **플랫폼별 확장** (필요시)
```javascript
// src/services/NewService.web.js
import { NewService } from './NewService';

class NewServiceWeb extends NewService {
  async getData() {
    // 웹 전용 로직
    return super.getData();
  }
}

export default new NewServiceWeb();
```

## 🧪 테스트 전략

### 공통 테스트
- 비즈니스 로직 테스트
- 데이터 변환 테스트
- 유틸리티 함수 테스트

### 플랫폼별 테스트
- 웹: Jest + React Testing Library
- 모바일: Jest + React Native Testing Library

## 🚀 빌드 및 배포

### 웹 빌드
```bash
npm run web          # 개발 서버
npm run build-web    # 프로덕션 빌드
```

### 모바일 빌드
```bash
npm run android      # 안드로이드 개발
npm run ios          # iOS 개발
```

## 📝 코드 스타일 가이드

### 1. 컴포넌트 작성
```javascript
// ✅ 좋은 예
import React from 'react';
import { colors, sizes } from '../styles/common';
import { platformStyle } from '../utils/platform';

const MyComponent = ({ title, onPress, variant = 'primary' }) => {
  const style = platformStyle(webStyle, mobileStyle);
  
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default MyComponent;
```

### 2. 스타일 정의
```javascript
// ✅ 좋은 예
const webStyle = {
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const mobileStyle = {
  elevation: 2,
};
```

### 3. 플랫폼 분기
```javascript
// ✅ 좋은 예
import { platformSelect } from '../utils/platform';

const config = platformSelect({
  web: { /* 웹 설정 */ },
  mobile: { /* 모바일 설정 */ },
  default: { /* 기본 설정 */ }
});
```

## 🎯 성능 최적화

### 1. 번들 크기 최적화
- 플랫폼별 코드 분리
- 동적 임포트 사용
- 불필요한 의존성 제거

### 2. 렌더링 최적화
- React.memo 사용
- useMemo, useCallback 활용
- 가상화 적용 (긴 리스트)

### 3. 네트워크 최적화
- 이미지 최적화
- 캐싱 전략
- 압축 적용

## 📊 모니터링 및 분석

### 1. 에러 추적
- 웹: Sentry, LogRocket
- 모바일: Crashlytics

### 2. 성능 모니터링
- 웹: Web Vitals
- 모바일: Flipper

### 3. 사용자 분석
- 웹: Google Analytics
- 모바일: Firebase Analytics

---

이 가이드라인을 따라 개발하면 웹과 모바일 앱 모두에서 일관된 사용자 경험을 제공할 수 있습니다. 🎉