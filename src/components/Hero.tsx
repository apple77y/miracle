export default function Hero() {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 leading-tight tracking-tight">
            꽃으로 전하는 <br />
            <span className="font-medium text-rose-500">진심</span>
          </h2>
          <div className="w-16 h-px bg-rose-300 mx-auto mb-6"></div>
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
            <div className="text-xs text-gray-500 font-medium">고객 만족</div>
          </div>
          <div>
            <div className="text-2xl font-light text-rose-500 mb-2">5년</div>
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