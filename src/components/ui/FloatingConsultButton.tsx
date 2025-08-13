'use client';

import { useIntl } from 'react-intl';
import { useIsPWA } from '../../hooks/useIsPWA';

export default function FloatingConsultButton() {
  const intl = useIntl();
  const isPWA = useIsPWA();
  const handleClick = () => {
    // Detect if user is on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try Instagram app deep link first, fallback to web version
      const instagramAppUrl = 'instagram://user?username=miracle_flowerstudio';
      const instagramWebUrl = 'https://www.instagram.com/miracle_flowerstudio/';
      
      // Attempt to open Instagram app
      window.location.href = instagramAppUrl;
      
      // Fallback to web version after a short delay if app doesn't open
      setTimeout(() => {
        window.open(instagramWebUrl, '_blank');
      }, 1500);
    } else {
      // Desktop: Use direct message link
      window.open('https://www.instagram.com/direct/t/100858424646856/', '_blank');
    }
  };

  if (isPWA) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-sage hover:bg-sage-dark text-white rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
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