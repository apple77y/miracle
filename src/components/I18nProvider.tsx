'use client';

import { IntlProvider } from 'react-intl';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export default function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>('ko');
  const [isInitialized, setIsInitialized] = useState(false);

  // Hydration-safe client detection
  useEffect(() => {
    setIsInitialized(true);
    const savedLocale = localStorage.getItem('locale') as Locale;
    const browserLocale = navigator.language.startsWith('en') ? 'en' : 'ko';
    const clientLocale = savedLocale || browserLocale;
    
    if (clientLocale !== 'ko') {
      setLocale(clientLocale);
      document.documentElement.lang = clientLocale;
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Update HTML lang attribute
    document.documentElement.lang = newLocale;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      <IntlProvider 
        messages={messages[locale]} 
        locale={locale} 
        defaultLocale="ko"
      >
        <div className={!isInitialized ? 'opacity-0' : 'opacity-100'} style={{ transition: 'opacity 0.1s' }}>
          {children}
        </div>
      </IntlProvider>
    </I18nContext.Provider>
  );
}