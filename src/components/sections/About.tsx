'use client';

import { useIntl } from 'react-intl';

export default function About() {
  const intl = useIntl();
  return (
    <section id="about" className="py-20 bg-gray-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-light text-gray-800 mb-3 tracking-tight">
              {intl.formatMessage({ id: 'about.title' })}
            </h3>
            <div className="w-12 h-px bg-rose-300 mb-8"></div>
            
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed font-light">
                {intl.formatMessage({ id: 'about.description1' })}
              </p>
              <p className="text-gray-600 leading-relaxed font-light">
                {intl.formatMessage({ id: 'about.description2' })}
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <a href="https://blog.naver.com/miracle_flower" target="_blank" rel="noopener noreferrer" 
                 className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium text-sm tracking-wide group whitespace-nowrap">
                {intl.formatMessage({ id: 'about.moreStory' })}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 border border-gray-100/50">
              <div className="text-2xl font-light text-rose-500 mb-2">100%</div>
              <p className="text-sm text-gray-600 font-light">{intl.formatMessage({ id: 'about.freshFlowers' })}</p>
              <p className="text-xs text-gray-400 mt-1">{intl.formatMessage({ id: 'about.freshFlowersDesc' })}</p>
            </div>
            <div className="bg-white p-6 border border-gray-100/50">
              <div className="text-2xl font-light text-rose-500 mb-2">{intl.formatMessage({ id: 'about.experienceYears' })}</div>
              <p className="text-sm text-gray-600 font-light">{intl.formatMessage({ id: 'about.experience' })}</p>
              <p className="text-xs text-gray-400 mt-1">{intl.formatMessage({ id: 'about.experienceDesc' })}</p>
            </div>
            <div className="bg-white p-6 border border-gray-100/50">
              <div className="text-2xl font-light text-rose-500 mb-2">{intl.formatMessage({ id: 'about.serviceDays' })}</div>
              <p className="text-sm text-gray-600 font-light">{intl.formatMessage({ id: 'about.service' })}</p>
              <p className="text-xs text-gray-400 mt-1">{intl.formatMessage({ id: 'about.serviceDesc' })}</p>
            </div>
            <div className="bg-white p-6 border border-gray-100/50">
              <div className="text-2xl font-light text-rose-500 mb-2">500+</div>
              <p className="text-sm text-gray-600 font-light">{intl.formatMessage({ id: 'about.customers' })}</p>
              <p className="text-xs text-gray-400 mt-1">{intl.formatMessage({ id: 'about.customersDesc' })}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}