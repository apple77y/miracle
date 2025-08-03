'use client';

import { useIsPWA } from '../hooks/useIsPWA';
import { usePWAInstall } from '../hooks/usePWAInstall';
import BottomNavigation from './ui/BottomNavigation';
import ToastNotification from './ui/ToastNotification';

interface PWALayoutProps {
  children: React.ReactNode;
}

export default function PWALayout({ children }: PWALayoutProps) {
  const isPWA = useIsPWA();
  
  // PWA 설치 및 노티피케이션 기능 초기화
  const { toastVisible, toastData, setToastVisible } = usePWAInstall();

  return (
    <>
      <div className={isPWA ? 'pb-16' : ''}>
        {children}
      </div>
      {isPWA && <BottomNavigation />}
      
      {/* iOS용 Toast 노티피케이션 */}
      <ToastNotification
        title={toastData.title}
        message={toastData.message}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        duration={4000}
      />
    </>
  );
}