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
      className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-sm font-medium w-14 h-14 z-50 bg-rose-500 text-white hover:bg-rose-600 group"
      aria-label={locale === 'ko' ? 'Change to English' : '한국어로 변경'}
    >
      {locale === 'ko' ? '한' : 'EN'}
      <span className="absolute right-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {locale === 'ko' ? 'English' : '한국어'}
      </span>
    </button>
  );
}