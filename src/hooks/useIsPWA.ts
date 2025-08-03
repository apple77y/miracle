'use client';

import { useEffect, useState } from 'react';

// iOS Safari Navigator 타입 확장
interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

export const useIsPWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      // Check if running in standalone mode (PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      // Check if launched from home screen on iOS
      const isIOSStandalone = (window.navigator as IOSNavigator).standalone;
      
      // Check if launched from home screen on Android
      const isAndroidStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                                  window.matchMedia('(display-mode: fullscreen)').matches ||
                                  window.matchMedia('(display-mode: minimal-ui)').matches;

      setIsPWA(isStandalone || isIOSStandalone || isAndroidStandalone);
    };

    checkPWA();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkPWA);

    return () => {
      mediaQuery.removeEventListener('change', checkPWA);
    };
  }, []);

  return isPWA;
};