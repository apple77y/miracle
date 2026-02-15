import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  typedRoutes: true,
  images: {
    unoptimized: true
  },
  turbopack: {},
};

export default nextConfig;
