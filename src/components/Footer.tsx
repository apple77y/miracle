export default function Footer() {
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
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              성남시 분당구에서 정성스럽게 만든<br />
              꽃 작품으로 소중한 마음을 전해드립니다
            </p>
          </div>
          
          {/* Contact */}
          <div>
            <h6 className="text-sm font-medium text-gray-800 mb-4 tracking-wide">연락처</h6>
            <div className="space-y-2 text-sm text-gray-600 font-light">
              <p>경기도 성남시 분당구 황새울로12번길 11-2</p>
              <p>화-일 11:00-19:00 (월요일 휴무)</p>
            </div>
          </div>
          
          {/* Social */}
          <div>
            <h6 className="text-sm font-medium text-gray-800 mb-4 tracking-wide">팔로우</h6>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/miracle_flowerstudio/" 
                 target="_blank" rel="noopener noreferrer"
                 className="text-xs text-gray-500 hover:text-rose-500 transition-colors tracking-wide">
                Instagram
              </a>
              <a href="https://blog.naver.com/miracle_flower" 
                 target="_blank" rel="noopener noreferrer"
                 className="text-xs text-gray-500 hover:text-rose-500 transition-colors tracking-wide">
                Blog
              </a>
              <a href="https://www.youtube.com/@miracle_flowerstudio" 
                 target="_blank" rel="noopener noreferrer"
                 className="text-xs text-gray-500 hover:text-rose-500 transition-colors tracking-wide">
                YouTube
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <p className="text-xs text-gray-400 text-center font-light tracking-wide">
            © 2024 Miracle Flower. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}