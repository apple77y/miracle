'use client';

import { useEffect, useState, useCallback } from 'react';
import { useIsPWA } from './useIsPWA';

interface CacheInfo {
  name: string;
  size: number;
  entryCount: number;
  type: 'static' | 'runtime' | 'data' | 'workbox';
  lastModified: number;
}

interface CacheManagerState {
  isSupported: boolean;
  totalSize: number;
  caches: CacheInfo[];
  isLoading: boolean;
  lastUpdated: number | null;
  quotaUsage: {
    used: number;
    quota: number;
    percentage: number;
  } | null;
}

export const useCacheManager = () => {
  const isPWA = useIsPWA();
  const [cacheState, setCacheState] = useState<CacheManagerState>({
    isSupported: false,
    totalSize: 0,
    caches: [],
    isLoading: false,
    lastUpdated: null,
    quotaUsage: null
  });

  useEffect(() => {
    // Cache API 지원 여부 확인
    const checkSupport = () => {
      const supported = 'caches' in window;
      setCacheState(prev => ({ ...prev, isSupported: supported }));
    };

    checkSupport();
  }, []);

  // 캐시 정보 로드 (next-pwa/Workbox 최적화)
  const loadCacheInfo = useCallback(async () => {
    if (!cacheState.isSupported) return;

    setCacheState(prev => ({ ...prev, isLoading: true }));

    try {
      const cacheNames = await caches.keys();
      const cacheInfos: CacheInfo[] = [];
      let totalSize = 0;

      // Storage Quota API 지원 확인
      let quotaUsage = null;
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          quotaUsage = {
            used: estimate.usage || 0,
            quota: estimate.quota || 0,
            percentage: estimate.quota ? Math.round((estimate.usage || 0) / estimate.quota * 100) : 0
          };
        } catch (error) {
          console.warn('Failed to get storage estimate:', error);
        }
      }

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        // 캐시 타입 분석
        const cacheType = getCacheType(cacheName);
        
        // 각 캐시 항목의 크기 추정 (샘플링으로 성능 최적화)
        let cacheSize = 0;
        const entryCount = keys.length;
        let lastModified = 0;

        // 성능을 위해 최대 10개 항목만 샘플링하여 크기 계산
        const sampleSize = Math.min(10, keys.length);
        let totalSampleSize = 0;

        for (let i = 0; i < sampleSize; i++) {
          try {
            const response = await cache.match(keys[i]);
            if (response) {
              const blob = await response.blob();
              totalSampleSize += blob.size;
              
              // Last-Modified 헤더 확인
              const lastModifiedHeader = response.headers.get('date') || response.headers.get('last-modified');
              if (lastModifiedHeader) {
                const modifiedTime = new Date(lastModifiedHeader).getTime();
                if (modifiedTime > lastModified) {
                  lastModified = modifiedTime;
                }
              }
            }
          } catch (error) {
            console.warn(`Failed to get cache entry size for ${keys[i].url}:`, error);
          }
        }

        // 샘플 기반으로 전체 크기 추정
        if (sampleSize > 0) {
          const averageSize = totalSampleSize / sampleSize;
          cacheSize = Math.round(averageSize * entryCount);
        }

        cacheInfos.push({
          name: cacheName,
          size: cacheSize,
          entryCount,
          type: cacheType,
          lastModified: lastModified || Date.now()
        });

        totalSize += cacheSize;
      }

      setCacheState(prev => ({
        ...prev,
        caches: cacheInfos,
        totalSize,
        quotaUsage,
        isLoading: false,
        lastUpdated: Date.now()
      }));

    } catch (error) {
      console.error('Failed to load cache info:', error);
      setCacheState(prev => ({ ...prev, isLoading: false }));
    }
  }, [cacheState.isSupported]);

  // 캐시 타입 분석
  const getCacheType = (cacheName: string): CacheInfo['type'] => {
    if (cacheName.includes('workbox-precache') || cacheName.includes('sw-precache')) {
      return 'workbox';
    } else if (cacheName.includes('static') || cacheName.includes('image') || cacheName.includes('font')) {
      return 'static';
    } else if (cacheName.includes('api') || cacheName.includes('data') || cacheName.includes('flower')) {
      return 'data';
    } else {
      return 'runtime';
    }
  };

  // 특정 캐시 삭제
  const deleteCache = useCallback(async (cacheName: string) => {
    if (!cacheState.isSupported) return false;

    try {
      const success = await caches.delete(cacheName);
      if (success) {
        await loadCacheInfo(); // 캐시 정보 새로고침
      }
      return success;
    } catch (error) {
      console.error(`Failed to delete cache ${cacheName}:`, error);
      return false;
    }
  }, [cacheState.isSupported, loadCacheInfo]);

  // 모든 캐시 삭제
  const clearAllCaches = useCallback(async () => {
    if (!cacheState.isSupported) return false;

    try {
      const cacheNames = await caches.keys();
      const deletePromises = cacheNames.map(name => caches.delete(name));
      await Promise.all(deletePromises);
      
      await loadCacheInfo(); // 캐시 정보 새로고침
      return true;
    } catch (error) {
      console.error('Failed to clear all caches:', error);
      return false;
    }
  }, [cacheState.isSupported, loadCacheInfo]);

  // 오래된 캐시 정리
  const cleanOldCaches = useCallback(async (maxAge: number = 7 * 24 * 60 * 60 * 1000) => {
    if (!cacheState.isSupported) return 0;

    let cleanedCount = 0;
    const cutoffTime = Date.now() - maxAge;

    try {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        for (const request of keys) {
          try {
            const response = await cache.match(request);
            if (response) {
              const dateHeader = response.headers.get('date');
              if (dateHeader) {
                const responseDate = new Date(dateHeader).getTime();
                if (responseDate < cutoffTime) {
                  await cache.delete(request);
                  cleanedCount++;
                }
              }
            }
          } catch (error) {
            console.warn(`Failed to check cache entry date for ${request.url}:`, error);
          }
        }
      }

      if (cleanedCount > 0) {
        await loadCacheInfo(); // 캐시 정보 새로고침
      }

      return cleanedCount;
    } catch (error) {
      console.error('Failed to clean old caches:', error);
      return 0;
    }
  }, [cacheState.isSupported, loadCacheInfo]);

  // 캐시 통계 새로고침
  const refreshCacheStats = useCallback(() => {
    loadCacheInfo();
  }, [loadCacheInfo]);

  // PWA 환경에서 주기적 캐시 정보 업데이트
  useEffect(() => {
    if (!isPWA || !cacheState.isSupported) return;

    // 초기 로드
    loadCacheInfo();

    // 5분마다 캐시 정보 업데이트
    const interval = setInterval(loadCacheInfo, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isPWA, cacheState.isSupported, loadCacheInfo]);

  // 크기를 읽기 쉬운 형태로 변환
  const formatSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }, []);

  return {
    ...cacheState,
    deleteCache,
    clearAllCaches,
    cleanOldCaches,
    refreshCacheStats,
    formatSize,
    loadCacheInfo
  };
};