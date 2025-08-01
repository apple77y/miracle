'use client';

import { useEffect } from 'react';
import { useI18n } from './I18nProvider';
import { getJsonLd } from '../utils/metadata';

interface DynamicLayoutProps {
  children: React.ReactNode;
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
  const { locale } = useI18n();

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = locale;
    
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
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
      jsonLdScript.innerHTML = JSON.stringify(getJsonLd(locale));
    }

    // Add/Update hreflang tags
    const existingHreflangs = document.querySelectorAll('link[hreflang]');
    existingHreflangs.forEach(link => link.remove());

    const hreflangs = [
      { lang: 'ko', url: 'https://miracle-pi.vercel.app' },
      { lang: 'en', url: 'https://miracle-pi.vercel.app' },
      { lang: 'x-default', url: 'https://miracle-pi.vercel.app' }
    ];

    hreflangs.forEach(({ lang, url }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = url;
      document.head.appendChild(link);
    });
  }, [locale]);

  return <>{children}</>;
}