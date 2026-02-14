'use client';

import { useSyncExternalStore } from 'react';
import { checkPWAStatus, setupPWAChangeListener } from '../utils/pwa';

export const useIsPWA = () => {
  return useSyncExternalStore(
    setupPWAChangeListener,
    checkPWAStatus,
    () => false
  );
};
