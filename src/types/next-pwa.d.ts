// next-pwa 타입 구체 선언 추가
// next-pwa의 설정 객체 타입을 정의합니다.
declare module 'next-pwa' {
  interface RuntimeCaching {
    urlPattern: RegExp | string;
    handler: string;
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
      cacheableResponse?: {
        statuses?: number[];
        headers?: Record<string, string>;
      };
    };
  }

  interface PWAConfig {
    dest: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    runtimeCaching?: RuntimeCaching[];
    buildExcludes?: string[];
    fallbacks?: {
      document?: string;
      image?: string;
      font?: string;
    };
  }

  const nextPwa: (config: PWAConfig) => void;
  export default nextPwa;
}
