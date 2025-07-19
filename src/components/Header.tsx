export default function Header() {
  return (
    <header className="relative bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-light text-gray-800 tracking-wide">
              <span className="font-medium">Miracle</span>
              <span className="text-rose-500 ml-1">Flower</span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">브랜드 스토리</a>
            <a href="#services" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">서비스</a>
            <a href="#gallery" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">포트폴리오</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium tracking-wide">문의</a>
          </nav>
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-rose-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}