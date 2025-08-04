import type { Metadata, Viewport } from "next";

type Locale = 'ko' | 'en';

export const getMetadata = (locale: Locale = 'ko'): Metadata => {
  const isKorean = locale === 'ko';
  
  const title = isKorean 
    ? "Miracle Flower - 미라클 플라워 | 성남 분당 꽃집"
    : "Miracle Flower | Premium Flower Shop in Bundang, Seongnam";
    
  const description = isKorean
    ? "성남시 분당구에 위치한 미라클 플라워입니다. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다. 꽃다발, 화분, 이벤트 장식 등 다양한 서비스를 제공합니다."
    : "Miracle Flower is located in Bundang-gu, Seongnam-si. We create special moments with fresh and beautiful flowers. We provide various services including bouquets, plants, and event decorations.";

  const keywords = isKorean 
    ? [
        "꽃집", "분당 꽃집", "성남 꽃집", "미라클 플라워", "꽃다발", 
        "화분", "플라워 샵", "꽃배달", "이벤트 꽃", "결혼식 꽃",
        "생일 꽃", "정자역 꽃집", "분당구 꽃집", "꽃바구니",
        "로즈 부케", "플라워 박스", "꽃 선물"
      ]
    : [
        "flower shop", "bundang flower shop", "seongnam flower shop", "miracle flower", "bouquet",
        "plants", "flower delivery", "event flowers", "wedding flowers",
        "birthday flowers", "jeongja station flower shop", "bundang-gu flower shop", "flower basket",
        "rose bouquet", "flower box", "flower gift"
      ];

  const ogImageAlt = isKorean
    ? "미라클 플라워의 아름다운 시즌 부케"
    : "Beautiful seasonal bouquet from Miracle Flower";

  return {
    metadataBase: new URL('https://miracle-flower.vercel.app'),
    title,
    description,
    keywords,
    authors: [{ name: "Miracle Flower" }],
    creator: "Miracle Flower",
    publisher: "Miracle Flower",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title,
      description,
      url: "https://miracle-flower.vercel.app",
      siteName: "Miracle Flower",
      locale: isKorean ? "ko_KR" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/seasonal-bouquet.jpg",
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/seasonal-bouquet.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "5WJhnp4naOYiJ_MQwKh6s2QwLM9GpHnhgYP1lcd83Fc",
      yandex: "yandex-verification-code",
      yahoo: "yahoo-verification-code",
    },
    other: {
      "naver-site-verification": "4b6679762238a11e4b68367323ceb6a21e184e8f",
      "msapplication-TileImage": "/ms-icon-144x144.png",
      "msapplication-TileColor": "#ffffff",
    },
    alternates: {
      canonical: "https://miracle-flower.vercel.app",
      languages: {
        'ko': 'https://miracle-flower.vercel.app',
        'en': 'https://miracle-flower.vercel.app',
        'x-default': 'https://miracle-flower.vercel.app'
      }
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/android-icon-192x192.png", sizes: "192x192", type: "image/png" }
      ],
      apple: [
        { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
        { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
        { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
        { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
        { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
        { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
        { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
        { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
        { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }
      ],
      other: [
        { rel: "icon", url: "/favicon.ico" },
        { rel: "icon", url: "/icon.svg", type: "image/svg+xml" }
      ]
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Miracle",
    },
  };
};

export const getViewport = (): Viewport => {
  return {
    userScalable: false,
  };
};

export const getJsonLd = (locale: Locale = 'ko') => {
  const isKorean = locale === 'ko';
  
  const name = isKorean ? "미라클 플라워 (Miracle Flower)" : "Miracle Flower (미라클 플라워)";
  const description = isKorean
    ? "성남시 분당구에 위치한 프리미엄 꽃집. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다."
    : "Premium flower shop located in Bundang-gu, Seongnam-si. We create special moments with fresh and beautiful flowers.";

  const offers = isKorean ? [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "시즌 부케",
        "description": "계절별 신선한 꽃으로 제작되는 특별한 부케"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "화병 꽂이",
        "description": "고급 화병에 정성스럽게 꽂은 꽃 어레인지먼트"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "꽃바구니",
        "description": "특별한 날을 위한 우아한 꽃바구니"
      }
    }
  ] : [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "Seasonal Bouquet",
        "description": "Special bouquets made with seasonal fresh flowers"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "Vase Arrangement",
        "description": "Carefully arranged flowers in premium vases"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "Flower Basket",
        "description": "Elegant flower baskets for special occasions"
      }
    }
  ];

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://miracle-flower.vercel.app",
    "name": name,
    "description": description,
    "url": "https://miracle-flower.vercel.app",
    "telephone": "+82-507-1456-0389",
    "email": "rmr0322@hanmail.net",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "황새울로12번길 11-2",
      "addressLocality": "분당구",
      "addressRegion": "성남시",
      "addressCountry": "KR",
      "postalCode": "13561"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "37.3595704",
      "longitude": "127.105399"
    },
    "openingHours": [
      "Tu-Su 11:00-19:00"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card"],
    "currenciesAccepted": "KRW",
    "image": [
      "https://miracle-flower.vercel.app/images/seasonal-bouquet.jpg",
      "https://miracle-flower.vercel.app/images/vase-arrangement.jpg",
      "https://miracle-flower.vercel.app/images/flower-basket.jpg"
    ],
    "sameAs": [
      "https://www.instagram.com/miracle_flowerstudio/",
      "https://blog.naver.com/miracle_flower",
      "https://www.youtube.com/@miracle_flowerstudio"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": isKorean ? "꽃 상품" : "Flower Products",
      "itemListElement": offers
    }
  };
};