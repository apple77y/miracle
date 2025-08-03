'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '../I18nProvider';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  labelKo: string;
  labelEn: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    labelKo: '홈',
    labelEn: 'Home'
  },
  {
    href: '/guide',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    labelKo: '꽃 관리',
    labelEn: 'Flower Care'
  },
  {
    href: '/occasion',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    labelKo: '이벤트',
    labelEn: 'Events'
  },
  {
    href: '/#contact',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    labelKo: '문의',
    labelEn: 'Contact'
  }
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const { locale } = useI18n();
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };
    
    // 초기 해시 설정
    updateHash();
    
    // 해시 변경 감지
    window.addEventListener('hashchange', updateHash);
    
    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  const getIsActive = (href: string) => {
    // 해시 링크 처리 (/#contact 등)
    if (href.startsWith('/#')) {
      const hash = href.substring(1); // '#contact'
      return pathname === '/' && currentHash === hash;
    }
    // 일반 경로 처리 (홈은 해시가 없을 때만 활성화)
    if (href === '/') {
      return pathname === '/' && !currentHash;
    }
    // trailing slash 지원 (trailingSlash: true 설정 때문에)
    return pathname === href || pathname === href + '/' || pathname + '/' === href;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = getIsActive(item.href);
          const label = locale === 'ko' ? item.labelKo : item.labelEn;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-2 transition-colors ${
                isActive 
                  ? 'text-rose-600' 
                  : 'text-gray-600 hover:text-rose-500'
              }`}
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}