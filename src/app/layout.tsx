import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FloatingConsultButton from "../components/ui/FloatingConsultButton";
import BackgroundMusic from "../components/ui/BackgroundMusic";
import DynamicLayout from "../components/DynamicLayout";
import ErrorBoundary from "../components/ErrorBoundary";
import "./globals.css";
import I18nProvider from "../components/I18nProvider";
import { getMetadata, getJsonLd, getViewport } from "../utils/metadata";

// Default metadata (Korean) - will be updated dynamically by DynamicLayout
export const metadata: Metadata = getMetadata("ko");
export const viewport = getViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light">
      <head>
        <link
          href="https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css"
          rel="stylesheet"
        />
        {getJsonLd("ko").map((jsonLd, index) => (
          <script
            key={index}
            type="application/ld+json"
            data-locale-jsonld="true"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd),
            }}
          />
        ))}
      </head>
      <body
        className="antialiased bg-white text-black"
        style={{ colorScheme: "light" }}>
        <ErrorBoundary>
          <I18nProvider>
            <DynamicLayout>
              {children}
              <BackgroundMusic />
              <FloatingConsultButton />
            </DynamicLayout>
          </I18nProvider>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 맥 트랙패드 핀치줌 방지
              document.addEventListener('wheel', function (e) {
                if (e.ctrlKey) e.preventDefault();
              }, { passive: false });

              // iOS Safari 핀치줌 방지
              document.addEventListener('gesturestart', e => e.preventDefault());
              document.addEventListener('gesturechange', e => e.preventDefault());
              document.addEventListener('gestureend', e => e.preventDefault());

              // 모바일 더블탭 확대 방지
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function (e) {
                let now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) e.preventDefault();
                lastTouchEnd = now;
              }, false);
            `,
          }}
        />
      </body>
    </html>
  );
}
