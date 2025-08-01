'use client';

import { useI18n } from '../I18nProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'ko' ? 'en' : 'ko');
  };

  return (
    <button
      onClick={toggleLocale}
      className="fixed bottom-24 right-6 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-sm font-medium w-14 h-14 z-50 bg-rose-500 text-white hover:bg-rose-600"
      aria-label={locale === 'ko' ? 'Change to English' : '한국어로 변경'}
    >
      {locale === 'ko' ? '한' : 'EN'}
    </button>
  );
}