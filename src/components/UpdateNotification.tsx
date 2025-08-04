'use client';

import { useEffect, useState } from 'react';
import { useIsPWA } from '../hooks/useIsPWA';

interface UpdateState {
  isSupported: boolean;
  hasUpdate: boolean;
  isUpdating: boolean;
  updateReady: boolean;
  updateAvailable: boolean;
  refreshing: boolean;
}

export default function UpdateNotification() {
  const isPWA = useIsPWA();
  const [updateState, setUpdateState] = useState<UpdateState>({
    isSupported: false,
    hasUpdate: false,
    isUpdating: false,
    updateReady: false,
    updateAvailable: false,
    refreshing: false
  });
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Service Worker 지원 여부 확인
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator;
      setUpdateState(prev => ({ ...prev, isSupported: supported }));
    };

    checkSupport();
  }, []);

  useEffect(() => {
    if (!isPWA || !updateState.isSupported) return;

    const setupUpdateDetection = async () => {
      try {
        // Service Worker 등록 가져오기
        const reg = await navigator.serviceWorker.ready;
        setRegistration(reg);

        // next-pwa 기반 업데이트 감지
        const checkForUpdates = () => {
          if (reg.waiting) {
            // 새 Service Worker가 대기 중 (next-pwa 방식)
            setUpdateState(prev => ({ 
              ...prev, 
              hasUpdate: true,
              updateReady: true,
              updateAvailable: true
            }));
          } else if (reg.installing) {
            // 새 Service Worker 설치 중
            setUpdateState(prev => ({ 
              ...prev, 
              isUpdating: true,
              hasUpdate: true
            }));

            reg.installing.addEventListener('statechange', () => {
              if (reg.installing?.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // 기존 페이지에 새 버전이 설치됨
                  setUpdateState(prev => ({ 
                    ...prev, 
                    isUpdating: false,
                    updateReady: true,
                    updateAvailable: true
                  }));
                } else {
                  // 첫 설치 (새 사용자)
                  setUpdateState(prev => ({ 
                    ...prev, 
                    isUpdating: false 
                  }));
                }
              }
            });
          }
        };

        // 초기 상태 확인
        checkForUpdates();

        // next-pwa updatefound 이벤트 감지
        reg.addEventListener('updatefound', () => {
          console.log('[Update] New service worker found');
          setUpdateState(prev => ({ 
            ...prev, 
            isUpdating: true,
            hasUpdate: true 
          }));

          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              console.log('[Update] Service worker state:', newWorker.state);
              
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // 업데이트 사용 가능
                  setUpdateState(prev => ({ 
                    ...prev, 
                    isUpdating: false,
                    updateReady: true,
                    updateAvailable: true
                  }));

                  // 사용자에게 업데이트 알림 표시 후 자동으로 적용하지 않음
                  console.log('[Update] Update available - waiting for user action');
                } else {
                  // 첫 설치
                  setUpdateState(prev => ({ 
                    ...prev, 
                    isUpdating: false 
                  }));
                }
              }
            });
          }
        });

        // 컨트롤러 변경 감지 (업데이트 활성화됨)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[Update] Controller changed - reloading');
          if (refreshTimer) {
            clearTimeout(refreshTimer);
          }
          setUpdateState(prev => ({ ...prev, refreshing: true }));
          
          // 부드러운 새로고침을 위한 약간의 지연
          const timer = setTimeout(() => {
            window.location.reload();
          }, 1000);
          setRefreshTimer(timer);
        });

        // 정기적인 업데이트 확인 (5분마다 - next-pwa 권장)
        const updateCheckInterval = setInterval(() => {
          console.log('[Update] Checking for updates...');
          reg.update().catch(err => {
            console.warn('[Update] Update check failed:', err);
          });
        }, 5 * 60 * 1000);

        return () => {
          clearInterval(updateCheckInterval);
          if (refreshTimer) {
            clearTimeout(refreshTimer);
          }
        };

      } catch (error) {
        console.error('[Update] Failed to setup update detection:', error);
      }
    };

    setupUpdateDetection();
  }, [isPWA, updateState.isSupported]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [refreshTimer]);

  // 업데이트 적용 (next-pwa 최적화)
  const applyUpdate = () => {
    if (!registration || !registration.waiting) return;

    console.log('[Update] Applying update...');
    setUpdateState(prev => ({ ...prev, isUpdating: true }));

    // next-pwa 방식: SKIP_WAITING 메시지 전송
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // 추가적으로 skipWaiting 직접 호출도 시도
    registration.waiting.postMessage('skipWaiting');
  };

  // 나중에 업데이트 (알림 숨기기)
  const dismissUpdate = () => {
    console.log('[Update] Update dismissed by user');
    setUpdateState(prev => ({ 
      ...prev, 
      hasUpdate: false,
      updateReady: false,
      updateAvailable: false
    }));
  };

  // 새로고침 중일 때
  if (updateState.refreshing) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">새 버전으로 전환 중...</span>
        </div>
      </div>
    );
  }

  // PWA가 아니거나 지원하지 않으면 표시하지 않음
  if (!isPWA || !updateState.isSupported) return null;

  // 업데이트 설치 중일 때
  if (updateState.isUpdating && !updateState.updateReady) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">새 버전 다운로드 중...</span>
        </div>
      </div>
    );
  }

  // 업데이트 적용 중일 때
  if (updateState.isUpdating && updateState.updateReady) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">업데이트 적용 중...</span>
        </div>
      </div>
    );
  }

  // 업데이트 준비 완료 및 사용 가능
  if (updateState.updateAvailable && updateState.updateReady) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm mx-4">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg shadow-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🎉</span>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                새 버전 업데이트!
              </h3>
              <p className="text-xs opacity-90 mb-3">
                더 나은 기능과 성능 개선이 포함된 새 버전이 준비되었습니다.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={applyUpdate}
                  className="text-xs bg-white text-green-600 px-3 py-1.5 rounded font-medium hover:bg-gray-100 transition-colors"
                >
                  지금 업데이트
                </button>
                <button
                  onClick={dismissUpdate}
                  className="text-xs bg-white bg-opacity-20 text-white px-3 py-1.5 rounded border border-white border-opacity-30 hover:bg-opacity-30 transition-colors"
                >
                  나중에
                </button>
              </div>
              <div className="text-xs opacity-75 mt-2">
                💡 업데이트 시 잠시 새로고침됩니다
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}