'use client';

import { useEffect } from 'react';
import { useI18n } from './I18nProvider';
import PWALayout from './PWALayout';
import { getJsonLd } from '../utils/metadata';

interface DynamicLayoutProps {
  children: React.ReactNode;
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
  const { locale } = useI18n();

  useEffect(() => {
    // 컴포넌트 렌더링 시간 측정 시작

    // Use requestAnimationFrame to avoid conflicts with React rendering
    const updateDOM = () => {
      try {
        // Update HTML lang attribute
        if (document.documentElement) {
          document.documentElement.lang = locale;
        }
        
        // Update page title
        const isKorean = locale === 'ko';
        const title = isKorean 
          ? "Miracle Flower - 미라클 플라워 | 성남 분당 꽃집"
          : "Miracle Flower | Premium Flower Shop in Bundang, Seongnam";
        document.title = title;

        // Update meta description
        const description = isKorean
          ? "성남시 분당구에 위치한 미라클 플라워입니다. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다."
          : "Miracle Flower is located in Bundang-gu, Seongnam-si. We create special moments with fresh and beautiful flowers.";
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', description);
        }

        // Update OG tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', title);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', description);
        }

        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) {
          ogLocale.setAttribute('content', isKorean ? 'ko_KR' : 'en_US');
        }

        // Update JSON-LD
        const existingJsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        const jsonLdData = getJsonLd(locale);
        
        // Remove existing JSON-LD scripts
        existingJsonLdScripts.forEach(script => script.remove());
        
        // Add new JSON-LD scripts
        jsonLdData.forEach((jsonLd) => {
          if (jsonLd && '@context' in jsonLd) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.innerHTML = JSON.stringify(jsonLd);
            document.head.appendChild(script);
          }
        });

        // Skip hreflang updates to avoid DOM conflicts during routing
        // These will be handled by Next.js Head component if needed
      } catch (error) {
        // 에러 레벨에 따른 적절한 처리
        console.error('DynamicLayout DOM update failed:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          locale,
          timestamp: new Date().toISOString()
        });

        // 프로덕션 환경에서는 에러 모니터링 서비스로 전송
        if (process.env.NODE_ENV === 'production' && error instanceof Error) {
          // 예: Sentry.captureException(error, { tags: { component: 'DynamicLayout' } });
        }

        // 크리티컬하지 않은 에러이므로 앱을 중단시키지 않음
        // 대신 기본값으로 폴백
        try {
          document.documentElement.lang = locale;
          document.title = locale === 'ko' 
            ? "Miracle Flower - 미라클 플라워"
            : "Miracle Flower";
        } catch (fallbackError) {
          console.error('DynamicLayout fallback failed:', fallbackError);
        }
      }
    };

    // Delay DOM updates to avoid conflicts with Next.js routing
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(updateDOM);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [locale]);

  return <PWALayout>{children}</PWALayout>;
}