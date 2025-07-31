'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const images = [
  '/images/seasonal-bouquet.jpg',
  '/images/rose-bouquet.jpg',
  '/images/vase-arrangement.jpg',
  '/images/flower-basket.jpg',
  '/images/event-decoration.jpg',
  '/images/flower-box.jpg'
];

export default function BackgroundCarousel() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/90 via-white/85 to-pink-50/90" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}