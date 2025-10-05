'use client';

import { useEffect, useState, useCallback } from 'react';
import { useIsPWA } from './useIsPWA';

// Simplified sync data types for next-pwa/Workbox integration
interface OrderData {
  productId: string;
  quantity: number;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  price: number;
}

interface InquiryData {
  productId: string;
  message: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
}

interface UserPreferences {
  favoriteCategories: string[];
  notificationSettings: {
    push: boolean;
    email: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

import { offlineDB, initOfflineDB } from '../utils/offlineDB';

interface BackgroundSyncState {
  isSupported: boolean;
  pendingOrders: number;
  pendingInquiries: number;
  isSyncing: boolean;
  lastSyncTime: number | null;
  syncStatus: {
    orders: 'idle' | 'syncing' | 'success' | 'error';
    inquiries: 'idle' | 'syncing' | 'success' | 'error';
    preferences: 'idle' | 'syncing' | 'success' | 'error';
  };
}

export const useBackgroundSync = () => {
  const isPWA = useIsPWA();
  const [syncState, setSyncState] = useState<BackgroundSyncState>({
    isSupported: false,
    pendingOrders: 0,
    pendingInquiries: 0,
    isSyncing: false,
    lastSyncTime: null,
    syncStatus: {
      orders: 'idle',
      inquiries: 'idle',
      preferences: 'idle'
    }
  });

  // 대기 중인 항목 카운트 로드 (IndexedDB 사용)
  const loadPendingCounts = useCallback(async () => {
    try {
      const counts = await offlineDB.getPendingCounts();
      
      setSyncState(prev => ({ 
        ...prev, 
        pendingOrders: counts.orders,
        pendingInquiries: counts.inquiries
      }));
    } catch (error) {
      console.error('Failed to load pending counts from IndexedDB:', error);
      
      // IndexedDB 실패 시 localStorage로 폴백
      try {
        const ordersCount = JSON.parse(localStorage.getItem('pending-orders-count') || '0');
        const inquiriesCount = JSON.parse(localStorage.getItem('pending-inquiries-count') || '0');
        
        setSyncState(prev => ({ 
          ...prev, 
          pendingOrders: ordersCount,
          pendingInquiries: inquiriesCount
        }));
      } catch (fallbackError) {
        console.error('Failed to load pending counts from localStorage:', fallbackError);
      }
    }
  }, []);

  useEffect(() => {
    // 백그라운드 동기화 지원 여부 확인
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
      setSyncState(prev => ({ ...prev, isSupported: supported }));
    };

    checkSupport();
    
    // IndexedDB 초기화
    initOfflineDB().then(() => {
      loadPendingCounts();
    }).catch(error => {
      console.error('Failed to initialize offline DB:', error);
      // IndexedDB 초기화 실패 시에도 기본 카운트 로드 시도
      loadPendingCounts();
    });
  }, [loadPendingCounts]);

  useEffect(() => {
    if (!isPWA || !syncState.isSupported) return;

    // Service Worker 메시지 리스너
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data || {};
      
      switch (type) {
        case 'ORDERS_SYNC_COMPLETE':
          setSyncState(prev => ({ 
            ...prev, 
            syncStatus: { ...prev.syncStatus, orders: 'success' },
            lastSyncTime: Date.now()
          }));
          // 성공한 데이터 정리 및 카운트 업데이트
          loadPendingCounts();
          break;
          
        case 'ORDERS_SYNC_ERROR':
          setSyncState(prev => ({ 
            ...prev, 
            syncStatus: { ...prev.syncStatus, orders: 'error' }
          }));
          console.error('Orders sync error:', data?.error);
          break;
          
        case 'INQUIRIES_SYNC_COMPLETE':
          setSyncState(prev => ({ 
            ...prev, 
            syncStatus: { ...prev.syncStatus, inquiries: 'success' },
            lastSyncTime: Date.now()
          }));
          loadPendingCounts();
          break;
          
        case 'INQUIRIES_SYNC_ERROR':
          setSyncState(prev => ({ 
            ...prev, 
            syncStatus: { ...prev.syncStatus, inquiries: 'error' }
          }));
          console.error('Inquiries sync error:', data?.error);
          break;
          
        case 'PREFERENCES_SYNC_COMPLETE':
          setSyncState(prev => ({ 
            ...prev, 
            syncStatus: { ...prev.syncStatus, preferences: 'success' },
            lastSyncTime: Date.now()
          }));
          break;
          
        case 'PREFERENCES_SYNC_ERROR':
          setSyncState(prev => ({ 
            ...prev, 
            syncStatus: { ...prev.syncStatus, preferences: 'error' }
          }));
          console.error('Preferences sync error:', data?.error);
          break;
          
        case 'GENERAL_SYNC_COMPLETE':
          setSyncState(prev => ({ 
            ...prev, 
            isSyncing: false,
            lastSyncTime: Date.now()
          }));
          loadPendingCounts();
          break;
          
        case 'GENERAL_SYNC_ERROR':
          setSyncState(prev => ({ 
            ...prev, 
            isSyncing: false
          }));
          console.error('General sync error:', data?.error);
          break;
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [isPWA, syncState.isSupported, loadPendingCounts]);

  // 주문 데이터 백그라운드 동기화에 추가
  const addOrderToSync = useCallback(async (orderData: OrderData) => {
    if (!syncState.isSupported) {
      console.warn('Background sync not supported');
      return false;
    }

    try {
      // IndexedDB에 주문 데이터 저장 (타입 캐스팅 불필요)
      const syncId = await offlineDB.addSyncData('order', orderData);

      // Service Worker에 주문 데이터 전송
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        registration.active?.postMessage({
          type: 'STORE_ORDER',
          payload: { ...orderData, syncId }
        });
        
        setSyncState(prev => ({ 
          ...prev, 
          pendingOrders: prev.pendingOrders + 1,
          syncStatus: { ...prev.syncStatus, orders: 'syncing' }
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to add order to sync:', error);
      
      // IndexedDB 실패 시 localStorage로 폴백
      try {
        const currentCount = syncState.pendingOrders;
        const newCount = currentCount + 1;
        localStorage.setItem('pending-orders-count', JSON.stringify(newCount));
        
        setSyncState(prev => ({ 
          ...prev, 
          pendingOrders: newCount,
          syncStatus: { ...prev.syncStatus, orders: 'syncing' }
        }));
        
        return true;
      } catch (fallbackError) {
        console.error('Fallback storage also failed:', fallbackError);
        return false;
      }
    }
  }, [syncState.isSupported, syncState.pendingOrders]);

  // 문의 데이터 백그라운드 동기화에 추가
  const addInquiryToSync = useCallback(async (inquiryData: InquiryData) => {
    if (!syncState.isSupported) {
      console.warn('Background sync not supported');
      return false;
    }

    try {
      const syncId = await offlineDB.addSyncData('inquiry', inquiryData);

      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        registration.active?.postMessage({
          type: 'STORE_INQUIRY',
          payload: { ...inquiryData, syncId }
        });
        
        setSyncState(prev => ({ 
          ...prev, 
          pendingInquiries: prev.pendingInquiries + 1,
          syncStatus: { ...prev.syncStatus, inquiries: 'syncing' }
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to add inquiry to sync:', error);
      
      // 폴백 처리
      try {
        const currentCount = syncState.pendingInquiries;
        const newCount = currentCount + 1;
        localStorage.setItem('pending-inquiries-count', JSON.stringify(newCount));
        
        setSyncState(prev => ({ 
          ...prev, 
          pendingInquiries: newCount,
          syncStatus: { ...prev.syncStatus, inquiries: 'syncing' }
        }));
        
        return true;
      } catch (fallbackError) {
        console.error('Fallback storage also failed:', fallbackError);
        return false;
      }
    }
  }, [syncState.isSupported, syncState.pendingInquiries]);

  // 사용자 환경설정 동기화
  const syncUserPreferences = useCallback(async (preferences: UserPreferences) => {
    if (!syncState.isSupported) {
      console.warn('Background sync not supported');
      return false;
    }

    try {
      const syncId = await offlineDB.addSyncData('preferences', preferences);

      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        registration.active?.postMessage({
          type: 'STORE_PREFERENCES',
          payload: { ...preferences, syncId }
        });
        
        setSyncState(prev => ({ 
          ...prev, 
          syncStatus: { ...prev.syncStatus, preferences: 'syncing' }
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to sync user preferences:', error);
      return false;
    }
  }, [syncState.isSupported]);

  // 수동 동기화 요청
  const requestSync = useCallback(async () => {
    if (!syncState.isSupported) return false;

    try {
      setSyncState(prev => ({ ...prev, isSyncing: true }));
      
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        registration.active?.postMessage({
          type: 'REQUEST_SYNC'
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to request sync:', error);
      setSyncState(prev => ({ ...prev, isSyncing: false }));
      return false;
    }
  }, [syncState.isSupported]);

  // 동기화 상태 리셋
  const resetSyncStatus = useCallback(() => {
    setSyncState(prev => ({
      ...prev,
      syncStatus: {
        orders: 'idle',
        inquiries: 'idle',
        preferences: 'idle'
      }
    }));
  }, []);

  return {
    ...syncState,
    addOrderToSync,
    addInquiryToSync,
    syncUserPreferences,
    requestSync,
    resetSyncStatus,
    loadPendingCounts
  };
};
