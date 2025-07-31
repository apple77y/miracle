import BackgroundCarousel from './BackgroundCarousel';

export default function Hero() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <BackgroundCarousel />
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-rose-100 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-pink-100 rounded-full opacity-40"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-rose-200 rounded-full opacity-25"></div>
      <div className="absolute bottom-40 right-12 w-24 h-24 bg-pink-50 rounded-full opacity-35"></div>
      
      {/* Floating SVG Icons */}
      <div className="absolute top-20 right-1/4 opacity-10 animate-bounce">
        <svg className="w-8 h-8 text-rose-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="absolute bottom-32 left-1/3 opacity-8 animate-pulse">
        <svg className="w-6 h-6 text-pink-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
        </svg>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-rose-600 text-sm font-medium mb-6 shadow-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            성남 분당구 플라워 스튜디오
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 leading-tight tracking-tight">
            꽃으로 전하는 <br />
            <span className="font-medium text-rose-500 relative">
              진심
              <div className="absolute -bottom-1 left-0 w-full h-3 bg-rose-100 opacity-30 -z-10"></div>
            </span>
          </h2>
        </div>
        
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          성남시 분당구에서 정성스럽게 만든 꽃 작품으로<br />
          소중한 마음을 아름답게 전해드립니다
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" className="bg-rose-500 text-white px-8 py-3 hover:bg-rose-600 transition-all duration-300 font-medium tracking-wide text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            문의하기
          </a>
          <a href="#gallery" className="border border-rose-300 text-rose-600 px-8 py-3 hover:bg-rose-50 transition-all duration-300 font-medium tracking-wide text-sm">
            포트폴리오 보기
          </a>
        </div>
        
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto text-center">
          <div>
            <div className="text-2xl font-light text-rose-500 mb-2">100+</div>
            <div className="text-xs text-gray-500 font-medium">고객 만족 리뷰</div>
          </div>
          <div>
            <div className="text-2xl font-light text-rose-500 mb-2">5년+</div>
            <div className="text-xs text-gray-500 font-medium">운영 경험</div>
          </div>
          <div>
            <div className="text-2xl font-light text-rose-500 mb-2">365일</div>
            <div className="text-xs text-gray-500 font-medium">신선한 꽃</div>
          </div>
        </div>
      </div>
    </section>
  );
}