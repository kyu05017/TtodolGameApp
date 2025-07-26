# 웹 테스트 빌드 가이드

## 🚀 웹 개발 서버 실행

### 1. 개발 서버 시작
```bash
# 프로젝트 디렉토리로 이동
cd /home/kyu05017/ttodol_game_reactNative/TtodolGameApp

# 웹 개발 서버 실행
npm run web
```

### 2. 접속 URL
- **로컬 접속**: http://localhost:3000
- **네트워크 접속**: http://172.25.83.213:3000

## 📦 프로덕션 빌드

### 1. 빌드 실행
```bash
# 프로덕션 웹 빌드
npm run build-web
```

### 2. 빌드 결과
- 빌드 파일 위치: `dist/` 폴더
- 배포 가능한 정적 파일들이 생성됨

### 3. dist 폴더 웹 배포 방법

#### 정적 호스팅 서비스 배포
```bash
# Netlify 배포
# 1. dist 폴더를 Netlify에 드래그 앤 드롭
# 2. 또는 Netlify CLI 사용
npx netlify deploy --dir=dist --prod

# Vercel 배포
npx vercel --prod dist/

# GitHub Pages 배포
# 1. dist 폴더 내용을 gh-pages 브랜치에 푸시
# 2. 또는 GitHub Actions 사용
```

#### 로컬 웹 서버로 테스트
```bash
# Python을 이용한 간단한 웹 서버
cd dist
python -m http.server 8000

# Node.js serve 패키지 사용
npx serve dist -p 8000

# PHP 내장 서버 (PHP 설치 시)
cd dist
php -S localhost:8000
```

#### 웹 서버 설정 (Apache/Nginx)
```apache
# Apache .htaccess 파일 예시 (dist 폴더에 생성)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

```nginx
# Nginx 설정 예시
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔧 설정 파일

### 주요 설정 파일들
- `webpack.config.js` - 웹팩 설정
- `index.web.js` - 웹 진입점
- `App.web.tsx` - 웹 전용 컴포넌트
- `public/index.html` - HTML 템플릿

### 웹 전용 Mock 파일들
- `src/web/sound-mock.js` - 사운드 모듈 웹 버전
- `src/web/async-storage-mock.js` - 로컬 스토리지 모듈
- `src/web/gesture-handler-mock.js` - 제스처 핸들러 모듈

## 🐛 문제 해결

### 포트 충돌 시
```bash
# 다른 포트로 실행
npx webpack serve --port 3001
```

### 캐시 문제 시
```bash
# 노드 모듈 재설치
rm -rf node_modules package-lock.json
npm install
```

### 브라우저 호환성
- **지원 브라우저**: Chrome, Firefox, Safari, Edge (최신 버전)
- **모바일 브라우저**: iOS Safari, Android Chrome

## 📝 개발 팁

### 1. 실시간 코드 변경
- `App.web.tsx` 파일을 수정하면 자동으로 반영됨
- 브라우저 개발자 도구로 디버깅 가능

### 2. 성능 최적화
- 웹팩 번들 분석: `npm run build-web -- --analyze`
- 개발 시 소스맵 활용

### 3. 테스트 방법
- 브라우저 개발자 도구 콘솔 확인
- 네트워크 탭으로 리소스 로딩 확인
- 모바일 화면 시뮬레이션 테스트

## 🔍 디버깅

### 콘솔 에러 확인
```javascript
// 브라우저 개발자 도구 > Console 탭
// 에러 메시지 확인 및 디버깅
```

### 네트워크 요청 확인
```javascript
// 브라우저 개발자 도구 > Network 탭
// 리소스 로딩 상태 확인
```