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

    // 모든 환경에서 테마 색상 적용
    if (isPWA) {
      // PWA 환경에서는 커스텀 색상 적용 - 꽃집을 위한 적절한 색상
      setThemeColor('#7c8c6e');
    } else {
      // 일반 웹에서도 동일한 색상 적용
      setThemeColor('#7c8c6e');
    }
  }, [isPWA]);

  return null;
}