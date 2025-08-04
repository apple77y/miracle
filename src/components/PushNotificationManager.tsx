'use client';

import { useEffect, useState } from 'react';
import { useIsPWA } from '../hooks/useIsPWA';

// 푸시 알림 권한 상태 타입
type NotificationPermission = 'default' | 'granted' | 'denied';

export default function PushNotificationManager() {
  const isPWA = useIsPWA();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 푸시 알림 지원 여부 확인
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission as NotificationPermission);
      }
    };

    checkSupport();
  }, []);

  useEffect(() => {
    if (!isPWA || !isSupported) return;

    // Service Worker가 준비되면 구독 상태 확인
    const checkSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();
        setSubscription(existingSubscription);
      } catch (error) {
        console.error('Failed to check push subscription:', error);
      }
    };

    checkSubscription();
  }, [isPWA, isSupported]);

  // 푸시 알림 권한 요청
  const requestPermission = async () => {
    if (!isSupported) {
      alert('이 브라우저는 푸시 알림을 지원하지 않습니다.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission as NotificationPermission);
      
      if (permission === 'granted') {
        await subscribeToPush();
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  // 푸시 구독
  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID 공개 키 (실제 서비스에서는 환경변수로 관리)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9TUdDPVqj8BtQQyJBbGhHPHovJ7eN4f3sj0wNsXFPj7mXnvRfWJQ';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setSubscription(subscription);
      
      // 구독 정보를 서버로 전송
      await saveSubscription(subscription);
      
      console.log('Push subscription successful:', subscription);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  };

  // 푸시 구독 해제
  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      
      // 서버에서 구독 정보 제거
      await removeSubscription(subscription);
      
      console.log('Push unsubscription successful');
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    }
  };

  // 테스트 알림 전송
  const sendTestNotification = async () => {
    if (!subscription) return;

    try {
      // 실제 서비스에서는 서버 API를 호출
      // 여기서는 로컬 테스트용 알림 생성
      if (Notification.permission === 'granted') {
        const options: NotificationOptions = {
          body: '새로운 시즌 부케가 준비되었습니다!',
          icon: '/android-icon-192x192.png',
          badge: '/apple-icon.png',
          data: { url: '/' }
        };

        // vibrate는 일부 브라우저에서만 지원되므로 별도로 처리
        if ('vibrate' in navigator) {
          (options as NotificationOptions & { vibrate?: number[] }).vibrate = [200, 100, 200];
        }

        new Notification('Miracle Flower 🌸', options);
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  };

  // PWA가 아니면 렌더링하지 않음
  if (!isPWA || !isSupported) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 max-w-sm">
      {permission === 'default' && (
        <div className="bg-white rounded-lg shadow-lg border border-pink-200 p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🔔</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">
                알림 허용
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                새로운 꽃 소식과 특별 할인 정보를 받아보세요
              </p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={requestPermission}
                  className="text-xs bg-pink-500 text-white px-3 py-1.5 rounded hover:bg-pink-600 transition-colors"
                >
                  허용
                </button>
                <button
                  onClick={() => setPermission('denied')}
                  className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300 transition-colors"
                >
                  나중에
                </button>
              </div>
            </div>
            <button
              onClick={() => setPermission('denied')}
              className="text-gray-400 hover:text-gray-600 text-sm"
              title="닫기"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {permission === 'granted' && subscription && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-lg border border-green-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">🔔</span>
              <span className="text-xs text-green-800 font-medium">
                알림 활성화됨
              </span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={sendTestNotification}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                title="테스트 알림 전송"
              >
                테스트
              </button>
              <button
                onClick={unsubscribeFromPush}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                title="알림 해제"
              >
                해제
              </button>
            </div>
          </div>
          
          {/* 간단한 상태 표시 */}
          <div className="mt-2 pt-2 border-t border-green-200">
            <div className="flex items-center justify-between text-xs text-green-600">
              <span>🌸 꽃 소식 알림 준비됨</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// VAPID 키 변환 유틸리티
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 구독 정보를 서버에 저장 (실제 구현 필요)
async function saveSubscription(subscription: PushSubscription): Promise<void> {
  // 실제 서비스에서는 서버 API 호출
  console.log('Saving subscription to server:', subscription.toJSON());
  
  // 로컬 스토리지에 임시 저장
  localStorage.setItem('push-subscription', JSON.stringify(subscription.toJSON()));
}

// 서버에서 구독 정보 제거 (실제 구현 필요)
async function removeSubscription(subscription: PushSubscription): Promise<void> {
  // 실제 서비스에서는 서버 API 호출
  console.log('Removing subscription from server:', subscription.toJSON());
  
  // 로컬 스토리지에서 제거
  localStorage.removeItem('push-subscription');
}