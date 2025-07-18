import { Platform, Dimensions } from 'react-native';

// 공통 색상 팔레트
export const colors = {
  primary: '#4CAF50',
  secondary: '#FF9800',
  accent: '#2196F3',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // 게임 색상
  gameBackground: '#f3f0c3',
  gameWall: '#8B5A3C',
  gameLine: '#FFD700',
  
  // 텍스트 색상
  textPrimary: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  textWhite: '#FFFFFF',
  
  // 배경 색상
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundDark: '#000000',
  
  // 투명도 적용
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // 그림자
  shadow: 'rgba(0, 0, 0, 0.2)',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
};

// 공통 사이즈
export const sizes = {
  // 화면 크기
  screenWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('window').height,
  
  // 여백
  paddingXS: 4,
  paddingS: 8,
  paddingM: 16,
  paddingL: 24,
  paddingXL: 32,
  
  // 마진
  marginXS: 4,
  marginS: 8,
  marginM: 16,
  marginL: 24,
  marginXL: 32,
  
  // 글씨 크기
  fontXS: 10,
  fontS: 12,
  fontM: 14,
  fontL: 16,
  fontXL: 18,
  fontXXL: 24,
  fontTitle: 32,
  fontHeader: 48,
  
  // 아이콘 크기
  iconS: 16,
  iconM: 24,
  iconL: 32,
  iconXL: 48,
  
  // 버튼 크기
  buttonHeight: 48,
  buttonHeightS: 32,
  buttonHeightL: 56,
  
  // 테두리 둥글기
  radiusXS: 4,
  radiusS: 8,
  radiusM: 12,
  radiusL: 16,
  radiusXL: 24,
  radiusRound: 50,
  
  // 게임 관련 크기
  gameAreaWidth: 350,
  gameAreaHeight: 600,
  fruitSizeMin: 16,
  fruitSizeMax: 80,
};

// 공통 그림자 스타일
export const shadows = {
  light: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heavy: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

// 공통 애니메이션 타이밍
export const animations = {
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    easeInOut: 'ease-in-out',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
  },
};

// 플랫폼별 조건부 스타일
export const platformStyles = {
  web: {
    cursor: 'pointer',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  mobile: {
    // 모바일 전용 스타일
  },
};

// 공통 버튼 스타일
export const buttonStyles = {
  base: {
    paddingHorizontal: sizes.paddingL,
    paddingVertical: sizes.paddingM,
    borderRadius: sizes.radiusM,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: sizes.buttonHeight,
    flexDirection: 'row',
    ...shadows.light,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
    ...shadows.light,
  },
};

// 공통 텍스트 스타일
export const textStyles = {
  header: {
    fontSize: sizes.fontHeader,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  title: {
    fontSize: sizes.fontXXL,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: sizes.fontXL,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  body: {
    fontSize: sizes.fontM,
    color: colors.textPrimary,
    lineHeight: sizes.fontM * 1.5,
  },
  caption: {
    fontSize: sizes.fontS,
    color: colors.textSecondary,
  },
  button: {
    fontSize: sizes.fontL,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
};

// 공통 입력 필드 스타일
export const inputStyles = {
  base: {
    paddingHorizontal: sizes.paddingM,
    paddingVertical: sizes.paddingM,
    borderRadius: sizes.radiusS,
    borderWidth: 1,
    borderColor: colors.textLight,
    backgroundColor: colors.backgroundPrimary,
    fontSize: sizes.fontM,
    color: colors.textPrimary,
    minHeight: sizes.buttonHeight,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: colors.error,
    borderWidth: 2,
  },
};

// 공통 모달 스타일
export const modalStyles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: sizes.radiusL,
    padding: sizes.paddingXL,
    margin: sizes.marginL,
    maxWidth: 400,
    width: '90%',
    ...shadows.heavy,
  },
  title: {
    ...textStyles.title,
    marginBottom: sizes.marginL,
    textAlign: 'center',
  },
  content: {
    marginBottom: sizes.marginL,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: sizes.marginM,
  },
};