'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useIsPWA } from '../../hooks/useIsPWA';

export default function Header() {
  const intl = useIntl();
  const isPWA = useIsPWA();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // PWA 모드에서는 헤더를 숨김
  if (isPWA) {
    return null;
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 pwa-hide">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-light text-gray-800 tracking-wide hover:opacity-80 transition-opacity">
              <span className="font-medium">Miracle</span>
              <span className="text-rose-500 ml-1">Flower</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/#about" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">
              {intl.formatMessage({ id: 'header.brandStory' })}
            </Link>
            <Link href="/#services" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">
              {intl.formatMessage({ id: 'header.services' })}
            </Link>
            <Link href="/#gallery" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">
              {intl.formatMessage({ id: 'header.portfolio' })}
            </Link>
            <Link href="/guide" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">
              {intl.formatMessage({ id: 'header.flowerGuide' })}
            </Link>
            <Link href="/occasion" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">
              {intl.formatMessage({ id: 'header.eventGuide' })}
            </Link>
            <Link href="/#contact" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">
              {intl.formatMessage({ id: 'header.contact' })}
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-600 hover:text-rose-500 transition-colors"
              aria-label="메뉴 열기"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
      </div>
      
      {/* Mobile Navigation - Floating Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMenu}
          />
          
          {/* Floating Menu */}
          <div className="fixed top-20 right-4 bg-white rounded-xl shadow-xl border border-gray-100 z-50 md:hidden animate-in slide-in-from-top-2 duration-200">
            <nav className="py-4 px-6 space-y-3 min-w-[200px]">
              <Link 
                href="/#about"
                onClick={closeMenu}
                className="block text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide py-3 px-2 rounded-lg hover:bg-rose-50"
              >
                {intl.formatMessage({ id: 'header.brandStory' })}
              </Link>
              <Link 
                href="/#services"
                onClick={closeMenu}
                className="block text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide py-3 px-2 rounded-lg hover:bg-rose-50"
              >
                {intl.formatMessage({ id: 'header.services' })}
              </Link>
              <Link 
                href="/#gallery"
                onClick={closeMenu}
                className="block text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide py-3 px-2 rounded-lg hover:bg-rose-50"
              >
                {intl.formatMessage({ id: 'header.portfolio' })}
              </Link>
              <Link 
                href="/guide" 
                onClick={closeMenu}
                className="block text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide py-3 px-2 rounded-lg hover:bg-rose-50"
              >
                {intl.formatMessage({ id: 'header.flowerGuide' })}
              </Link>
              <Link 
                href="/occasion" 
                onClick={closeMenu}
                className="block text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide py-3 px-2 rounded-lg hover:bg-rose-50"
              >
                {intl.formatMessage({ id: 'header.eventGuide' })}
              </Link>
              <Link 
                href="/#contact"
                onClick={closeMenu}
                className="block text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide py-3 px-2 rounded-lg hover:bg-rose-50"
              >
                {intl.formatMessage({ id: 'header.contact' })}
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}