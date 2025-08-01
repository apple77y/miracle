import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FloatingConsultButton from "../components/ui/FloatingConsultButton";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";
import DynamicLayout from "../components/DynamicLayout";
import "./globals.css";
import I18nProvider from "../components/I18nProvider";
import { getMetadata, getJsonLd } from "../utils/metadata";

// Default metadata (Korean) - will be updated dynamically by DynamicLayout
export const metadata: Metadata = getMetadata('ko');

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
            __html: JSON.stringify(getJsonLd('ko'))
          }}
        />
      </head>
      <body className="antialiased">
        <I18nProvider>
          <DynamicLayout>
            {children}
            <FloatingConsultButton />
            <LanguageSwitcher />
          </DynamicLayout>
        </I18nProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}