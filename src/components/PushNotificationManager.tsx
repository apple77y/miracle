'use client';

import { useEffect, useState } from 'react';
import { useIsPWA } from '../hooks/useIsPWA';

// 푸시 알림 권한 상태 타입
type NotificationPermission = 'default' | 'granted' | 'denied';

export default function PushNotificationManager() {
  const isPWA = useIsPWA();
  const [permission, setPermission] = useState<NotificationPermission>('default');
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
        await registration.pushManager.getSubscription();
        // 구독 상태는 시각적으로 표시하지 않으므로 상태 업데이트 제거
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

      // 구독 정보를 서버로 전송
      await saveSubscription(subscription);
      
      // 환영 알림 즉시 전송
      await sendWelcomeNotification();
      
      console.log('Push subscription successful:', subscription);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  };

  // 환영 알림 전송 (한 번만)
  const sendWelcomeNotification = async () => {
    try {
      if (Notification.permission === 'granted') {
        // 이미 환영 알림을 보냈는지 확인
        const hasShownWelcome = localStorage.getItem('miracle-welcome-notification-sent');
        if (hasShownWelcome) {
          console.log('Welcome notification already sent, skipping...');
          return;
        }

        // 짧은 지연 후 환영 알림 표시 (사용자가 구독 완료를 인지할 시간)
        setTimeout(() => {
          const options: NotificationOptions = {
            body: '알림이 활성화되었습니다! 🎉\n새로운 꽃다발 소식과 특별 할인 정보를 놓치지 마세요.',
            icon: '/android-icon-192x192.png',
            badge: '/apple-icon.png',
            tag: 'welcome-notification',
            requireInteraction: false,
            silent: false,
            data: { 
              type: 'welcome',
              url: '/',
              timestamp: Date.now()
            },
          };

          // vibrate는 일부 브라우저에서만 지원되므로 별도로 처리
          if ('vibrate' in navigator) {
            (options as NotificationOptions & { vibrate?: number[] }).vibrate = [200, 100, 200, 100, 200];
          }

          new Notification('Miracle Flower에 오신 것을 환영합니다! 🌸', options);
          
          // 환영 알림 전송 기록 저장 (한 번만 보내기 위해)
          localStorage.setItem('miracle-welcome-notification-sent', Date.now().toString());
          
          console.log('Welcome notification sent');
        }, 1000); // 1초 후 전송
      }
    } catch (error) {
      console.error('Failed to send welcome notification:', error);
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

