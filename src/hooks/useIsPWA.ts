'use client';

import { useEffect, useState } from 'react';
import { checkPWAStatus, setupPWAChangeListener } from '../utils/pwa';

export const useIsPWA = () => {
  // 초기값을 서버사이드에서 안전하게 false로 설정
  const [isPWA, setIsPWA] = useState(() => {
    // 클라이언트에서만 실행
    if (typeof window === 'undefined') return false;

    // 공통 함수를 사용하여 PWA 상태 체크
    return checkPWAStatus();
  });

  useEffect(() => {
    // PWA 상태 변화 리스너 설정
    const cleanup = setupPWAChangeListener(() => {
      setIsPWA(checkPWAStatus());
    });

    // 초기 체크 (혹시 놓친 상태 변화 감지)
    setIsPWA(checkPWAStatus());

    return cleanup;
  }, []);

  return isPWA;
};
