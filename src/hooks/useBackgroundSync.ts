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

  // 대기 중인 항목 카운트 로드
  const loadPendingCounts = useCallback(async () => {
    // 실제로는 IndexedDB나 다른 저장소에서 카운트를 가져와야 함
    // 여기서는 간단히 localStorage 사용
    try {
      const ordersCount = JSON.parse(localStorage.getItem('pending-orders-count') || '0');
      const inquiriesCount = JSON.parse(localStorage.getItem('pending-inquiries-count') || '0');
      
      setSyncState(prev => ({ 
        ...prev, 
        pendingOrders: ordersCount,
        pendingInquiries: inquiriesCount
      }));
    } catch (error) {
      console.error('Failed to load pending counts:', error);
    }
  }, []);

  useEffect(() => {
    // 백그라운드 동기화 지원 여부 확인
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
      setSyncState(prev => ({ ...prev, isSupported: supported }));
    };

    checkSupport();
  }, []);

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
            pendingOrders: 0,
            lastSyncTime: Date.now()
          }));
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
            pendingInquiries: 0,
            lastSyncTime: Date.now()
          }));
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
    
    // 초기 대기 항목 카운트 로드
    loadPendingCounts();

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
      // Service Worker에 주문 데이터 전송
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        // Service Worker에 메시지 전송
        registration.active?.postMessage({
          type: 'STORE_ORDER',
          payload: orderData
        });
        
        // 대기 카운트 업데이트
        const currentCount = syncState.pendingOrders;
        const newCount = currentCount + 1;
        localStorage.setItem('pending-orders-count', JSON.stringify(newCount));
        
        setSyncState(prev => ({ 
          ...prev, 
          pendingOrders: newCount,
          syncStatus: { ...prev.syncStatus, orders: 'syncing' }
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to add order to sync:', error);
      return false;
    }
  }, [syncState.isSupported, syncState.pendingOrders]);

  // 문의 데이터 백그라운드 동기화에 추가
  const addInquiryToSync = useCallback(async (inquiryData: InquiryData) => {
    if (!syncState.isSupported) {
      console.warn('Background sync not supported');
      return false;
    }

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        registration.active?.postMessage({
          type: 'STORE_INQUIRY',
          payload: inquiryData
        });
        
        const currentCount = syncState.pendingInquiries;
        const newCount = currentCount + 1;
        localStorage.setItem('pending-inquiries-count', JSON.stringify(newCount));
        
        setSyncState(prev => ({ 
          ...prev, 
          pendingInquiries: newCount,
          syncStatus: { ...prev.syncStatus, inquiries: 'syncing' }
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to add inquiry to sync:', error);
      return false;
    }
  }, [syncState.isSupported, syncState.pendingInquiries]);

  // 사용자 환경설정 동기화
  const syncUserPreferences = useCallback(async (preferences: UserPreferences) => {
    if (!syncState.isSupported) {
      console.warn('Background sync not supported');
      return false;
    }

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        registration.active?.postMessage({
          type: 'STORE_PREFERENCES',
          payload: preferences
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