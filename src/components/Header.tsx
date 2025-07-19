'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-light text-gray-800 tracking-wide">
              <span className="font-medium">Miracle</span>
              <span className="text-rose-500 ml-1">Flower</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">브랜드 스토리</a>
            <a href="#services" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">서비스</a>
            <a href="#gallery" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">포트폴리오</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">문의</a>
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
              <a 
                href="#about" 
                onClick={closeMenu}
                className="block text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide py-3 px-2 rounded-lg hover:bg-rose-50"
              >
                브랜드 스토리
              </a>
              <a 
                href="#services" 
                onClick={closeMenu}
                className="block text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide py-3 px-2 rounded-lg hover:bg-rose-50"
              >
                서비스
              </a>
              <a 
                href="#gallery" 
                onClick={closeMenu}
                className="block text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide py-3 px-2 rounded-lg hover:bg-rose-50"
              >
                포트폴리오
              </a>
              <a 
                href="#contact" 
                onClick={closeMenu}
                className="block text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide py-3 px-2 rounded-lg hover:bg-rose-50"
              >
                문의
              </a>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}