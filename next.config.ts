import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

const pwaConfig = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  scope: '/',
  sw: '/worker/index.js',
  fallbacks: {
    document: '/offline',
  },
  buildExcludes: ['/middleware-manifest.json'],
  publicExcludes: ['!robots.txt', '!sitemap.xml', '!worker/**/*'],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/miracle-flower\.vercel\.app\/api\/flowers/,
      handler: 'NetworkFirst' as const,
      options: {
        cacheName: 'api-flowers',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: 'static-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /^https:\/\/storage\.googleapis\.com\/workbox-cdn\/.*$/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: 'workbox-cdn',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
  ],
};

// Properly apply PWA plugin: pass pwaConfig to withPWA to obtain a wrapper,
// then apply it to nextConfig.
//export default withPWA(pwaConfig)(nextConfig);
// Some versions of `next-pwa` typings mismatch with TS; cast to any and
// preserve the original call shape: first pass pwaConfig to get a wrapper,
// then apply it to nextConfig.
export default (withPWA as any)(pwaConfig)(nextConfig);
