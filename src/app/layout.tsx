import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FloatingConsultButton from "../components/FloatingConsultButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miracle Flower - 미라클 플라워 | 성남 분당 꽃집",
  description: "성남시 분당구에 위치한 미라클 플라워입니다. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다. 꽃다발, 화분, 이벤트 장식 등 다양한 서비스를 제공합니다.",
  keywords: [
    "꽃집", "분당 꽃집", "성남 꽃집", "미라클 플라워", "꽃다발", 
    "화분", "플라워 샵", "꽃배달", "이벤트 꽃", "결혼식 꽃",
    "생일 꽃", "정자역 꽃집", "분당구 꽃집", "꽃바구니",
    "로즈 부케", "플라워 박스", "꽃 선물"
  ],
  authors: [{ name: "Miracle Flower" }],
  creator: "Miracle Flower",
  publisher: "Miracle Flower",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Miracle Flower - 미라클 플라워 | 성남 분당 꽃집",
    description: "성남시 분당구에 위치한 미라클 플라워입니다. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다.",
    url: "https://miracle-flower.com",
    siteName: "Miracle Flower",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/seasonal-bouquet.jpg",
        width: 1200,
        height: 630,
        alt: "미라클 플라워의 아름다운 시즌 부케",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Miracle Flower - 미라클 플라워 | 성남 분당 꽃집",
    description: "성남시 분당구에 위치한 미라클 플라워입니다. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다.",
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
    google: "A4xHV18BHb5ywdVvsnUk5C9Bac2XGY6Jmux9MKtNePg",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
  alternates: {
    canonical: "https://miracle-flower.com",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://miracle-flower.com",
              "name": "미라클 플라워 (Miracle Flower)",
              "description": "성남시 분당구에 위치한 프리미엄 꽃집. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다.",
              "url": "https://miracle-flower.com",
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
                "https://miracle-flower.com/images/seasonal-bouquet.jpg",
                "https://miracle-flower.com/images/vase-arrangement.jpg",
                "https://miracle-flower.com/images/flower-basket.jpg"
              ],
              "sameAs": [
                "https://www.instagram.com/miracle_flowerstudio/",
                "https://blog.naver.com/miracle_flower",
                "https://www.youtube.com/@miracle_flowerstudio"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "꽃 상품",
                "itemListElement": [
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
                ]
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <FloatingConsultButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
