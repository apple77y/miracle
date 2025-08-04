'use client';

import { useEffect } from 'react';
import { useIsPWA } from '../hooks/useIsPWA';

export default function PWAThemeColor() {
  const isPWA = useIsPWA();

  useEffect(() => {
    const setThemeColor = (color: string) => {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      
      metaThemeColor.setAttribute('content', color);
    };

    const removeThemeColor = () => {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.remove();
      }
    };

    if (isPWA) {
      // PWA 환경에서는 커스텀 색상 적용
      setThemeColor('#f43f5e');
    } else {
      // 일반 웹에서는 theme-color 제거 (브라우저 기본값 사용)
      removeThemeColor();
    }
  }, [isPWA]);

  return null;
}