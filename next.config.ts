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
  sw: 'sw.js',
  fallbacks: {
    document: '/offline',
    image: "",
    audio: "",
    video: "",
    font: ""
  },
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ['!robots.txt', '!sitemap.xml'],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withPWA(pwaConfig)(nextConfig as any);
