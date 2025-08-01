'use client';

import { useIntl } from 'react-intl';

export default function Footer() {
  const intl = useIntl();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100/50 py-12 border-t border-gray-200/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-light text-gray-800 tracking-wide mb-4">
              <span className="font-medium">Miracle</span>
              <span className="text-rose-500 ml-1">Flower</span>
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed whitespace-pre-line">
              {intl.formatMessage({ id: 'footer.description' })}
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <p className="text-xs text-gray-400 text-center font-light tracking-wide">
            © {currentYear} Miracle Flower. {intl.formatMessage({ id: 'footer.copyright' })}
          </p>
        </div>
      </div>
    </footer>
  );
}