'use client';

import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useIsPWA } from './useIsPWA';

export function usePWAInstall() {
  const intl = useIntl();
  const isPWA = useIsPWA();
  const notificationWorkerRef = useRef<ServiceWorker | null>(null);

  // 서비스 워커 등록
  const registerNotificationWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        console.log('Registering notification service worker...');
        const registration = await navigator.serviceWorker.register('/sw-notification.js', {
          scope: '/'
        });
        
        console.log('Notification Service Worker registered:', registration);
        
        // 서비스 워커가 활성화될 때까지 대기
        if (registration.active) {
          console.log('Service worker is already active');
          notificationWorkerRef.current = registration.active;
        } else if (registration.installing) {
          console.log('Service worker is installing...');
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            console.log('Service worker state changed to:', newWorker.state);
            if (newWorker.state === 'activated') {
              console.log('Service worker activated');
              notificationWorkerRef.current = newWorker;
            }
          });
        } else {
          console.log('Waiting for service worker update...');
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                console.log('New service worker state:', newWorker.state);
                if (newWorker.state === 'activated') {
                  notificationWorkerRef.current = newWorker;
                }
              });
            }
          });
        }
        
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    } else {
      console.log('Service Worker not supported');
    }
    return null;
  };

  // 노티피케이션 권한 요청
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  // 서비스 워커를 통한 환영 노티피케이션 전송
  const sendWelcomeNotification = async () => {
    const hasPermission = await requestNotificationPermission();
    
    if (!hasPermission) {
      console.log('Notification permission denied');
      return;
    }

    // 서비스 워커가 등록되지 않은 경우 등록
    if (!notificationWorkerRef.current) {
      await registerNotificationWorker();
    }

    // 서비스 워커를 통해 노티피케이션 전송
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const language = intl.locale || 'ko';
      console.log('Sending welcome notification message to service worker, language:', language);
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_WELCOME_NOTIFICATION',
        data: { language }
      });
    } else {
      console.log('Service worker controller not available, using fallback notification');
      // 폴백: 직접 노티피케이션 생성
      const title = intl.formatMessage({ id: 'pwa.notification.welcome.title' });
      const body = intl.formatMessage({ id: 'pwa.notification.welcome.body' });
      
      new Notification(title, {
        body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'pwa-welcome',
        requireInteraction: false,
        silent: false
      });
    }
  };

  // PWA 설치 및 실행 감지
  useEffect(() => {
    // 서비스 워커 등록
    const initServiceWorker = async () => {
      await registerNotificationWorker();
    };

    // appinstalled 이벤트 리스너 (PWA가 설치되었을 때)
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      
      // 약간의 지연 후 환영 노티피케이션 전송
      setTimeout(() => {
        sendWelcomeNotification().catch(console.error);
      }, 2000);
    };

    // 이미 설치된 PWA에서 실행 중인지 확인
    const checkIfInstalled = () => {
      if (isPWA && !sessionStorage.getItem('pwa-welcome-shown')) {
        sessionStorage.setItem('pwa-welcome-shown', 'true');
        // 첫 실행 시에만 환영 메시지
        setTimeout(() => {
          sendWelcomeNotification().catch(console.error);
        }, 1000);
      }
    };

    // 서비스 워커 초기화
    initServiceWorker();

    window.addEventListener('appinstalled', handleAppInstalled);
    
    // 페이지 로드 시 설치 상태 확인
    checkIfInstalled();

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [intl, isPWA]);

  // hook이 사용될 때 자동으로 초기화됨
  return {
    requestNotificationPermission,
    sendWelcomeNotification
  };
}