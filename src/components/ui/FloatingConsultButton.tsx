'use client';

import { useIntl } from 'react-intl';

export default function FloatingConsultButton() {
  const intl = useIntl();
  const handleClick = () => {
    window.open('https://talk.naver.com/ct/w4s149', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      aria-label={intl.formatMessage({ id: 'ui.consultation' })}
    >
      <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <span className="absolute right-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {intl.formatMessage({ id: 'ui.consultation' })}
      </span>
    </button>
  );
}