export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-light text-gray-800 mb-3 tracking-tight">브랜드 스토리</h3>
            <div className="w-12 h-px bg-rose-300 mb-8"></div>
            
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed font-light">
                미라클 플라워는 2019년 성남시 분당구에서 시작된 
                작은 꽃집입니다. 단순히 꽃을 파는 것이 아닌, 
                고객님의 소중한 마음을 전달하는 메신저가 되고자 합니다.
              </p>
              <p className="text-gray-600 leading-relaxed font-light">
                매일 새벽 시장에서 직접 엄선한 신선한 꽃들로 
                정성스럽게 만든 작품을 통해 특별한 순간을 
                더욱 아름답게 만들어드리고 있습니다.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <a href="https://blog.naver.com/miracle_flower" target="_blank" rel="noopener noreferrer" 
                 className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium text-sm tracking-wide group">
                더 자세한 이야기
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 border border-gray-100/50">
              <div className="text-2xl font-light text-rose-500 mb-2">100%</div>
              <p className="text-sm text-gray-600 font-light">신선한 꽃</p>
              <p className="text-xs text-gray-400 mt-1">매일 새벽 직접 선별</p>
            </div>
            <div className="bg-white p-6 border border-gray-100/50">
              <div className="text-2xl font-light text-rose-500 mb-2">5년+</div>
              <p className="text-sm text-gray-600 font-light">전문 경험</p>
              <p className="text-xs text-gray-400 mt-1">플로리스트 경력</p>
            </div>
            <div className="bg-white p-6 border border-gray-100/50">
              <div className="text-2xl font-light text-rose-500 mb-2">365일</div>
              <p className="text-sm text-gray-600 font-light">정성 서비스</p>
              <p className="text-xs text-gray-400 mt-1">연중무휴 준비</p>
            </div>
            <div className="bg-white p-6 border border-gray-100/50">
              <div className="text-2xl font-light text-rose-500 mb-2">500+</div>
              <p className="text-sm text-gray-600 font-light">주문 고객</p>
              <p className="text-xs text-gray-400 mt-1">누적 서비스 건수</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}