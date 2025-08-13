'use client';

import BackgroundCarousel from '../ui/BackgroundCarousel';
import Link from 'next/link';
import { useIntl } from 'react-intl';

export default function Hero() {
  const intl = useIntl();
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <BackgroundCarousel />
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-sage-light rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-sage-light/50 rounded-full opacity-40"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-sage rounded-full opacity-25"></div>
      <div className="absolute bottom-40 right-12 w-24 h-24 bg-sage-light/50 rounded-full opacity-35"></div>
      
      {/* Floating SVG Icons */}
      <div className="absolute top-20 right-1/4 opacity-10 animate-bounce">
        <svg className="w-8 h-8 text-sage-light" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="absolute bottom-32 left-1/3 opacity-8 animate-pulse">
        <svg className="w-6 h-6 text-sage-light" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
        </svg>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sage text-sm font-medium mb-6 shadow-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {intl.formatMessage({ id: 'hero.location' })}
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 leading-tight tracking-tight">
            {intl.formatMessage({ id: 'hero.title' })}
            <br />
            <span className="font-medium text-sage relative">
              {intl.formatMessage({ id: 'hero.titleHighlight' })}
              <div className="absolute -inset-1 bg-sage-light/30 opacity-30 rounded-lg -z-10"></div>
            </span>
          </h2>
        </div>
        
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light whitespace-pre-line break-words">
          {intl.formatMessage({ id: 'hero.subtitle' })}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/#contact" className="bg-sage text-white px-8 py-3 hover:bg-sage-dark transition-all duration-300 font-medium tracking-wide text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap">
            {intl.formatMessage({ id: 'hero.contactUs' })}
          </Link>
          <Link href="/#gallery" className="border border-sage-light text-sage px-8 py-3 hover:bg-sage-light/10 transition-all duration-300 font-medium tracking-wide text-sm whitespace-nowrap">
            {intl.formatMessage({ id: 'hero.viewPortfolio' })}
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto text-center">
          <div>
            <div className="text-2xl font-light text-sage mb-2">{intl.formatMessage({ id: 'hero.reviewsCount' })}</div>
            <div className="text-xs text-gray-500 font-medium">{intl.formatMessage({ id: 'hero.reviews' })}</div>
          </div>
          <div>
            <div className="text-2xl font-light text-sage mb-2">{intl.formatMessage({ id: 'hero.experienceCount' })}</div>
            <div className="text-xs text-gray-500 font-medium">{intl.formatMessage({ id: 'hero.experience' })}</div>
          </div>
          <div>
            <div className="text-2xl font-light text-sage mb-2">{intl.formatMessage({ id: 'hero.freshFlowersCount' })}</div>
            <div className="text-xs text-gray-500 font-medium">{intl.formatMessage({ id: 'hero.freshFlowers' })}</div>
          </div>
        </div>
      </div>
    </section>
  );
}