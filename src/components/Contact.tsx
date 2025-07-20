export default function Contact() {
  const contactInfo = [
    {
      label: "전화번호",
      value: "0507-1456-0389",
      icon: "📞",
      link: "tel:0507-1456-0389"
    },
    {
      label: "이메일",
      value: "rmr0322@hanmail.net",
      icon: "✉️",
      link: "mailto:rmr0322@hanmail.net"
    },
    {
      label: "주소",
      value: "경기도 성남시 분당구 황새울로12번길 11-2",
      icon: "📍"
    },
    {
      label: "영업시간",
      value: "화-일 11:00-19:00 (월요일 휴무)",
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
          <h3 className="text-3xl font-light text-gray-800 mb-3 tracking-tight">문의</h3>
          <div className="w-12 h-px bg-rose-300 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">언제든지 편하게 연락해 주세요</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">매장 정보</h4>
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start space-x-4">
                <span className="text-lg">{info.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">{info.label}</p>
                  {info.link ? (
                    <a href={info.link} className="text-sm text-rose-500 hover:text-rose-600 transition-colors font-light">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-600 font-light">{info.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Social Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">소셜 미디어</h4>
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
            <h4 className="text-lg font-medium text-gray-800 mb-4">찾아오기</h4>
            <p className="text-sm text-gray-600 font-light mb-6 leading-relaxed">
              지하철 분당선 정자역에서 도보 10분 거리에 위치해 있습니다.
              정확한 길찾기는 지도를 이용해주세요.
            </p>
            <div className="space-y-3">
              <a href="https://naver.me/GTnuWfmH" 
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium text-sm tracking-wide group w-full">
                네이버 지도
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="https://place.map.kakao.com/86003378" 
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium text-sm tracking-wide group w-full">
                카카오 지도
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="https://maps.app.goo.gl/LBKyuJShj3owcW949" 
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium text-sm tracking-wide group w-full">
                구글 지도
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