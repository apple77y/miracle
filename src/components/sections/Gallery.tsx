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
      gradient: "linear-gradient(to bottom right, #fdf2f8, #fce7f3)",
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
      gradient: "linear-gradient(to bottom right, #fef2f2, #fecaca)",
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
          <div className="w-12 h-px bg-rose-300 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">{intl.formatMessage({ id: 'gallery.subtitle' })}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden bg-gray-100 aspect-square">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105" 
                  style={{backgroundImage: `url('${item.image}'), ${item.gradient}`}}
                />
              </div>
              <div className="pt-4 pb-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                  {item.category}
                </p>
                <h4 className="text-lg font-light text-gray-800 hover:text-rose-500 transition-colors">
                  {intl.formatMessage({ id: item.titleKey })}
                </h4>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 font-light mb-6">{intl.formatMessage({ id: 'gallery.moreWorks' })}</p>
          <a href="https://www.instagram.com/miracle_flowerstudio/" 
             target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center text-rose-500 hover:text-rose-600 transition-colors font-medium text-sm tracking-wide group">
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