import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FloatingConsultButton from "../components/ui/FloatingConsultButton";
import BackgroundMusic from "../components/ui/BackgroundMusic";
import DynamicLayout from "../components/DynamicLayout";
import PWAThemeColor from "../components/PWAThemeColor";
import PushNotificationManager from "../components/PushNotificationManager";
import BackgroundSyncIndicator from "../components/BackgroundSyncIndicator";
import UpdateNotification from "../components/UpdateNotification";
import "./globals.css";
import I18nProvider from "../components/I18nProvider";
import { getMetadata, getJsonLd, getViewport } from "../utils/metadata";

// Default metadata (Korean) - will be updated dynamically by DynamicLayout
export const metadata: Metadata = getMetadata('ko');
export const viewport = getViewport();

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
        <PWAThemeColor />
        <PushNotificationManager />
        <BackgroundSyncIndicator />
        <UpdateNotification />
        <I18nProvider>
          <DynamicLayout>
            {children}
            <BackgroundMusic />
            <FloatingConsultButton />
          </DynamicLayout>
        </I18nProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}