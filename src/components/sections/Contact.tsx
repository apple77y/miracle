'use client';

import { useIntl } from 'react-intl';

interface ContactInfo {
  labelKey: string;
  value?: string;
  valueKey?: string;
  icon: string;
  link?: string;
}

export default function Contact() {
  const intl = useIntl();
  
  // 매장 위치 정보 (네이버 지도 링크에서 확인된 정보)
  const storeLocation = {
    lat: 37.36129117156036,
    lng: 127.11145035922377,
    address: '경기도 성남시 분당구 황새울로12번길 11-2',
    placeId: '1633873676'
  };
  
  // HTTP Referer 인증 방식으로 네이버 Static Map 사용
  
  const contactInfo: ContactInfo[] = [
    {
      labelKey: "contact.phone",
      value: "0507-1456-0389",
      icon: "📞",
      link: "tel:0507-1456-0389"
    },
    {
      labelKey: "contact.email",
      value: "rmr0322@hanmail.net",
      icon: "✉️",
      link: "mailto:rmr0322@hanmail.net"
    },
    {
      labelKey: "contact.address",
      valueKey: "contact.addressValue",
      icon: "📍"
    },
    {
      labelKey: "contact.hours",
      valueKey: "contact.hoursValue",
      icon: "🕒"
    }
  ];

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/miracle_flowerstudio/",
      handle: "@miracle_flowerstudio"
    },
    {
      name: "Blog",
      url: "https://blog.naver.com/miracle_flower",
      handle: "miracle_flower"
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@miracle_flowerstudio",
      handle: "@miracle_flowerstudio"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-light text-gray-800 mb-3 tracking-tight">
            {intl.formatMessage({ id: 'contact.title' })}
          </h3>
          <div className="w-12 h-px bg-rose-300 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">{intl.formatMessage({ id: 'contact.subtitle' })}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="bg-gray-50 p-6 border border-gray-100">
            <h4 className="text-lg font-medium text-gray-800 mb-4">{intl.formatMessage({ id: 'contact.storeInfo' })}</h4>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <span className="text-lg">{info.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{intl.formatMessage({ id: info.labelKey })}</p>
                    {info.link ? (
                      <a href={info.link} className="text-sm text-rose-500 hover:text-rose-600 transition-colors font-light">
                        {info.valueKey ? intl.formatMessage({ id: info.valueKey }) : info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-600 font-light">{info.valueKey ? intl.formatMessage({ id: info.valueKey }) : info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Social Links */}
          <div className="bg-gray-50 p-6 border border-gray-100">
            <h4 className="text-lg font-medium text-gray-800 mb-4">{intl.formatMessage({ id: 'contact.socialMedia' })}</h4>
            <div className="space-y-4">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.url} 
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-between p-3 border border-gray-100 hover:border-rose-200 transition-colors group cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{social.name}</p>
                    <p className="text-xs text-gray-500">{social.handle}</p>
                  </div>
                  <span className="text-rose-500 hover:text-rose-600 transition-colors">
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Map */}
          <div className="bg-gray-50 p-6 border border-gray-100">
            <h4 className="text-lg font-medium text-gray-800 mb-4">{intl.formatMessage({ id: 'contact.directions' })}</h4>
            
            {/* 네이버 Static Map - HTTP Referer 인증 */}
            <div className="mb-6">
              <img 
                src={`https://maps.apigw.ntruss.com/map-static/v2/raster-cors?w=400&h=200&center=${storeLocation.lng},${storeLocation.lat}&level=15&maptype=basic&format=png&markers=type:t|size:mid|color:red|pos:${storeLocation.lng} ${storeLocation.lat}&X-NCP-APIGW-API-KEY-ID=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
                alt={intl.formatMessage({ id: 'contact.mapAlt' })}
                className="w-full h-48 object-cover border border-gray-200 rounded"
                onError={(e) => {
                  // 지도 로딩 실패 시 매장 위치 정보 표시
                  const target = e.target as HTMLImageElement;
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = 'w-full h-48 bg-rose-50 border border-rose-100 rounded flex flex-col justify-center items-center p-6';
                  fallbackDiv.innerHTML = `
                    <div class="flex items-center space-x-2 mb-3">
                      <span class="text-rose-500 text-3xl">📍</span>
                      <span class="font-medium text-gray-800 text-lg">미라클 플라워</span>
                    </div>
                    <p class="text-sm text-gray-600 text-center font-light mb-2">${storeLocation.address}</p>
                    <div class="text-xs text-gray-500 space-y-1">
                      <p>위도: ${storeLocation.lat}</p>
                      <p>경도: ${storeLocation.lng}</p>
                    </div>
                  `;
                  target.parentNode?.replaceChild(fallbackDiv, target);
                }}
              />
            </div>
            
            
            <p className="text-sm text-gray-600 font-light mb-6 leading-relaxed">
              {intl.formatMessage({ id: 'contact.directionsDesc' })}
            </p>
            <div className="space-y-3">
              <a href="https://naver.me/GTnuWfmH" 
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium text-sm tracking-wide group w-full whitespace-nowrap">
                {intl.formatMessage({ id: 'contact.naverMap' })}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="https://place.map.kakao.com/86003378" 
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium text-sm tracking-wide group w-full whitespace-nowrap">
                {intl.formatMessage({ id: 'contact.kakaoMap' })}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="https://maps.app.goo.gl/LBKyuJShj3owcW949" 
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium text-sm tracking-wide group w-full whitespace-nowrap">
                {intl.formatMessage({ id: 'contact.googleMap' })}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}