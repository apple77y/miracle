interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

/**
 * PWA(Progressive Web App) 상태를 확인하는 공통 함수
 * iOS, Android, 일반 브라우저에서의 standalone 모드를 감지
 */
export const checkPWAStatus = (): boolean => {
  if (typeof window === 'undefined') return false;

  // 일반적인 standalone 모드 체크
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // iOS Safari standalone 모드 체크
  const isIOSStandalone = (window.navigator as IOSNavigator).standalone;

  // Android Chrome standalone 모드 체크
  const isAndroidStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches;

  return isStandalone || isIOSStandalone || isAndroidStandalone;
};

/**
 * PWA 상태 변화를 감지하는 리스너 설정
 */
export const setupPWAChangeListener = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(display-mode: standalone)');
  mediaQuery.addEventListener('change', callback);

  return () => {
    mediaQuery.removeEventListener('change', callback);
  };
};
