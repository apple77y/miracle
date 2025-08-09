'use client';

import { useEffect } from 'react';
import { useI18n } from './I18nProvider';
import { getJsonLd } from '../utils/metadata';
import PWALayout from './PWALayout';

interface DynamicLayoutProps {
  children: React.ReactNode;
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
  const { locale } = useI18n();

  useEffect(() => {
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
        console.log('DOM update error:', error);
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