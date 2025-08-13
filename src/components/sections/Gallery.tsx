'use client';

import { useIntl } from 'react-intl';

export default function Gallery() {
  const intl = useIntl();
  const galleryItems = [
    {
      image: "/images/seasonal-bouquet.jpg",
      gradient: "linear-gradient(to bottom right, #fefce8, #fef3c7)",
      titleKey: "gallery.seasonal.title",
      category: "Seasonal"
    },
    {
      image: "/images/vase-arrangement.jpg",
      gradient: "linear-gradient(to bottom right, #f0f9ff, #e0f2fe)",
      titleKey: "gallery.vase.title",
      category: "Vase"
    },
    {
      image: "/images/flower-basket.jpg",
      gradient: "linear-gradient(to bottom right, #f0fdf4, #dcfce7)",
      titleKey: "gallery.basket.title",
      category: "Basket"
    },
    {
      image: "/images/rose-bouquet.jpg",
      gradient: "linear-gradient(to bottom right, #eff6ff, #bfdbfe)",
      titleKey: "gallery.rose.title",
      category: "Rose"
    },
    {
      image: "/images/event-decoration.jpg",
      gradient: "linear-gradient(to bottom right, #faf5ff, #e9d5ff)",
      titleKey: "gallery.event.title",
      category: "Event"
    },
    {
      image: "/images/flower-box.jpg",
      gradient: "linear-gradient(to bottom right, #f0fdfa, #ccfbf1)",
      titleKey: "gallery.box.title",
      category: "Box"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-light text-gray-800 mb-3 tracking-tight">
            {intl.formatMessage({ id: 'gallery.title' })}
          </h3>
          <div className="w-12 h-px bg-sage mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">{intl.formatMessage({ id: 'gallery.subtitle' })}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <div key={index} className="group cursor-pointer hover-lift">
              <div className="relative overflow-hidden rounded-3xl shadow-botanical border border-white/50 aspect-[4/5] bg-gradient-to-br from-sage/5 to-navy/5">
                <div 
                  className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                  style={{backgroundImage: `url('${item.image}'), ${item.gradient}`}}
                />
                
                {/* Elegant overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Category badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-sage/10">
                  <p className="text-xs text-sage-dark uppercase tracking-widest font-elegant-medium">
                    {item.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 font-light mb-6">{intl.formatMessage({ id: 'gallery.moreWorks' })}</p>
          <a href="https://www.instagram.com/miracle_flowerstudio/" 
             target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center text-sage hover:text-sage-dark transition-colors font-medium text-sm tracking-wide group whitespace-nowrap">
            Instagram
            <svg className="w-4 h-4 ml-2 hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}