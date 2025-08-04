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
    image: "",
    audio: "",
    video: "",
    font: ""
  },
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ['!robots.txt', '!sitemap.xml', '!worker/**/*'],
  // Runtime caching configurations
  runtimeCaching: [
    // API caching with NetworkFirst strategy
    {
      urlPattern: /^https:\/\/miracle-flower\.vercel\.app\/api\/flowers/,
      handler: 'NetworkFirst' as const,
      options: {
        cacheName: 'api-flowers',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Static images with CacheFirst
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: 'static-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    // External CDN resources
    {
      urlPattern: /^https:\/\/storage\.googleapis\.com\/workbox-cdn\/.*/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: 'workbox-cdn',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withPWA(pwaConfig)(nextConfig as any);
