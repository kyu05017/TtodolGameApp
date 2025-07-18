import { colors, sizes, shadows, animations } from './common';

// 웹 전용 스타일 확장
export const webStyles = {
  // 웹 전용 인터랙션
  hover: {
    transition: `all ${animations.timing.fast}ms ${animations.easing.easeInOut}`,
    cursor: 'pointer',
  },
  
  // 웹 전용 버튼 호버 효과
  buttonHover: {
    transform: 'translateY(-2px)',
    ...shadows.medium,
  },
  
  // 웹 전용 카드 호버 효과
  cardHover: {
    transform: 'translateY(-4px)',
    ...shadows.heavy,
  },
  
  // 웹 전용 입력 필드 스타일
  inputFocus: {
    outline: 'none',
    boxShadow: `0 0 0 2px ${colors.primary}20`,
  },
  
  // 웹 전용 스크롤바 스타일
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: colors.backgroundSecondary,
    },
    '&::-webkit-scrollbar-thumb': {
      background: colors.textLight,
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: colors.textSecondary,
    },
  },
  
  // 웹 전용 드래그 방지
  noDrag: {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitUserDrag: 'none',
    KhtmlUserDrag: 'none',
    MozUserDrag: 'none',
    OUserDrag: 'none',
    userDrag: 'none',
  },
  
  // 웹 전용 글꼴 렌더링
  fontSmoothing: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  
  // 웹 전용 백드롭 필터 (모던 브라우저)
  backdropBlur: {
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  
  // 웹 전용 그리드 레이아웃
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: sizes.marginL,
  },
  
  // 웹 전용 플렉스 레이아웃
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 웹 전용 풀스크린 컨테이너
  fullscreen: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  
  // 웹 전용 반응형 컨테이너
  responsive: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${sizes.paddingL}px`,
    '@media (max-width: 768px)': {
      padding: `0 ${sizes.paddingM}px`,
    },
  },
};

// 웹 전용 CSS-in-JS 유틸리티
export const createWebStyle = (baseStyle, webExtensions = {}) => {
  return {
    ...baseStyle,
    ...webExtensions,
    ...webStyles.fontSmoothing,
    ...webStyles.noDrag,
  };
};

// 웹 전용 호버 효과 생성기
export const createHoverEffect = (baseStyle, hoverStyle) => {
  return {
    ...baseStyle,
    ...webStyles.hover,
    '&:hover': {
      ...hoverStyle,
      ...webStyles.buttonHover,
    },
  };
};

// 웹 전용 미디어 쿼리
export const mediaQueries = {
  mobile: '@media (max-width: 768px)',
  tablet: '@media (max-width: 1024px)',
  desktop: '@media (min-width: 1025px)',
  
  // 게임 전용 미디어 쿼리
  gameSmall: '@media (max-width: 400px)',
  gameMedium: '@media (min-width: 401px) and (max-width: 800px)',
  gameLarge: '@media (min-width: 801px)',
};