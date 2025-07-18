#!/bin/bash

# 또돌 수박게임 테스트 스크립트

echo "🍉 또돌 수박게임 테스트 시작"
echo "================================"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수 정의
show_menu() {
    echo ""
    echo "${BLUE}테스트 옵션을 선택하세요:${NC}"
    echo "1) 웹 테스트 (포트 3000)"
    echo "2) 모바일 테스트 (Metro 서버)"
    echo "3) 웹 + 모바일 동시 테스트"
    echo "4) 웹 빌드 테스트"
    echo "5) 종료"
    echo ""
}

# 포트 체크 함수
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "${YELLOW}포트 $port 이미 사용중입니다.${NC}"
        return 1
    else
        return 0
    fi
}

# 웹 테스트 함수
test_web() {
    echo "${GREEN}🌐 웹 테스트 시작...${NC}"
    
    if check_port 3000; then
        echo "웹 서버를 http://localhost:3000 에서 시작합니다..."
        echo "브라우저에서 자동으로 열립니다."
        echo ""
        echo "${YELLOW}테스트 포인트:${NC}"
        echo "✅ 게임 시작 모달 표시"
        echo "✅ 과일 미리보기 (반투명)"
        echo "✅ 마우스로 과일 드래그"
        echo "✅ 과일 합치기 애니메이션"
        echo "✅ 점수 증가 효과"
        echo ""
        npm run web
    else
        echo "${RED}포트 3000이 사용중입니다. 다른 포트를 사용합니다.${NC}"
        npx webpack serve --config webpack.config.js --mode development --port 3001 --open
    fi
}

# 모바일 테스트 함수
test_mobile() {
    echo "${GREEN}📱 모바일 테스트 시작...${NC}"
    
    if check_port 8081; then
        echo "Metro 서버를 http://localhost:8081 에서 시작합니다..."
        echo ""
        echo "${YELLOW}다음 단계:${NC}"
        echo "1. Android: 'npm run android' 실행"
        echo "2. iOS: 'npm run ios' 실행"
        echo "3. 또는 React Native 앱에서 개발 서버 연결"
        echo ""
        npm run start
    else
        echo "${RED}포트 8081이 사용중입니다. 캐시를 초기화하고 다시 시도합니다.${NC}"
        npm run reset-cache
    fi
}

# 동시 테스트 함수
test_both() {
    echo "${GREEN}🚀 웹 + 모바일 동시 테스트 시작...${NC}"
    
    echo "웹 서버: http://localhost:3000"
    echo "모바일 서버: http://localhost:8081"
    echo ""
    echo "${YELLOW}Ctrl+C 로 종료하세요.${NC}"
    echo ""
    npm run start-both
}

# 빌드 테스트 함수
test_build() {
    echo "${GREEN}🔨 웹 빌드 테스트 시작...${NC}"
    
    echo "프로덕션 빌드를 생성합니다..."
    npm run build-web
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "${GREEN}✅ 빌드 성공!${NC}"
        echo "빌드된 파일: dist/ 폴더"
        echo ""
        echo "빌드된 파일을 로컬 서버에서 테스트하시겠습니까? (y/n)"
        read -r answer
        if [[ $answer =~ ^[Yy]$ ]]; then
            echo "로컬 서버 시작 중..."
            cd dist && python3 -m http.server 8080
        fi
    else
        echo "${RED}❌ 빌드 실패!${NC}"
    fi
}

# 메인 로직
main() {
    # 패키지 설치 확인
    if [ ! -d "node_modules" ]; then
        echo "${YELLOW}패키지를 설치합니다...${NC}"
        npm install
    fi
    
    while true; do
        show_menu
        read -p "선택하세요 (1-5): " choice
        
        case $choice in
            1)
                test_web
                break
                ;;
            2)
                test_mobile
                break
                ;;
            3)
                test_both
                break
                ;;
            4)
                test_build
                break
                ;;
            5)
                echo "${GREEN}테스트를 종료합니다. 안녕히 가세요! 👋${NC}"
                exit 0
                ;;
            *)
                echo "${RED}잘못된 선택입니다. 1-5 중에서 선택하세요.${NC}"
                ;;
        esac
    done
}

# 스크립트 실행
main