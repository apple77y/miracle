'use client';

import { IntlProvider } from 'react-intl';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Import messages
import koMessages from '../../messages/ko.json';
import enMessages from '../../messages/en.json';

const messages = {
  ko: koMessages,
  en: enMessages,
};

type Locale = 'ko' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

interface I18nProviderProps {
  children: ReactNode;
}

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'ko';

  try {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale === 'ko' || savedLocale === 'en') return savedLocale;
  } catch {
    // Ignore localStorage read errors and fall back to browser locale.
  }

  return navigator.language.startsWith('en') ? 'en' : 'ko';
};

export default function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    try {
      localStorage.setItem('locale', newLocale);
    } catch (error) {
      console.log('Locale update error:', error);
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      <IntlProvider 
        messages={messages[locale]} 
        locale={locale} 
        defaultLocale="ko"
      >
        <div className="opacity-100" style={{ transition: 'opacity 0.1s' }}>
          {children}
        </div>
      </IntlProvider>
    </I18nContext.Provider>
  );
}
