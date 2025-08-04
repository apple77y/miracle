'use client';

import { useIsPWA } from '../hooks/useIsPWA';
import BottomNavigation from './ui/BottomNavigation';

interface PWALayoutProps {
  children: React.ReactNode;
}

export default function PWALayout({ children }: PWALayoutProps) {
  const isPWA = useIsPWA();
  
  return (
    <>
      <div className={isPWA ? 'pb-16' : ''}>
        {children}
      </div>
      {isPWA && <BottomNavigation />}
    </>
  );
}