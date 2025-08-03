'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useIsPWA } from './useIsPWA';

export function usePWAInstall() {
  const intl = useIntl();
  const isPWA = useIsPWA();
  const notificationWorkerRef = useRef<ServiceWorker | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastData, setToastData] = useState({ title: '', message: '' });

  // 커스텀 노티피케이션 서비스 워커 등록 및 관리
  const registerNotificationWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return null;
    }

    try {
      console.log('Waiting for main service worker to be ready...');
      // 먼저 메인 SW(sw.js)가 준비될 때까지 대기
      await navigator.serviceWorker.ready;
      
      console.log('Main service worker ready, registering notification worker...');
      
      // 커스텀 노티피케이션 SW를 별도 스코프로 등록
      const registration = await navigator.serviceWorker.register('/sw-notification.js', {
        scope: '/notifications/'
      });
      
      console.log('Notification Service Worker registered:', registration);
      
      // 서비스 워커 활성화 대기
      return new Promise((resolve) => {
        if (registration.active) {
          console.log('Notification service worker is already active');
          notificationWorkerRef.current = registration.active;
          resolve(registration);
        } else if (registration.installing) {
          console.log('Notification service worker is installing...');
          const worker = registration.installing;
          worker.addEventListener('statechange', () => {
            console.log('Notification worker state:', worker.state);
            if (worker.state === 'activated') {
              console.log('Notification service worker activated');
              notificationWorkerRef.current = worker;
              resolve(registration);
            }
          });
        } else if (registration.waiting) {
          console.log('Notification service worker is waiting...');
          const worker = registration.waiting;
          notificationWorkerRef.current = worker;
          resolve(registration);
        } else {
          console.log('Waiting for notification service worker installation...');
          registration.addEventListener('updatefound', () => {
            const worker = registration.installing;
            if (worker) {
              worker.addEventListener('statechange', () => {
                if (worker.state === 'activated') {
                  notificationWorkerRef.current = worker;
                  resolve(registration);
                }
              });
            }
          });
        }
      });
      
    } catch (error) {
      console.error('Notification Service Worker registration failed:', error);
      return null;
    }
  };

  // 커스텀 서비스 워커와 통신
  const sendNotificationViaCustomSW = async (language: string) => {
    try {
      // 등록된 모든 서비스 워커 확인
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('Available service worker registrations:', registrations.length);
      
      // 노티피케이션 서비스 워커 찾기
      const notifReg = registrations.find(reg => 
        reg.scope.includes('/notifications/') || 
        (reg.active && reg.active.scriptURL.includes('sw-notification'))
      );
      
      if (notifReg?.active) {
        console.log('Found notification service worker, sending message');
        notifReg.active.postMessage({
          type: 'SHOW_WELCOME_NOTIFICATION',
          data: { language }
        });
        return true;
      } else if (notificationWorkerRef.current) {
        console.log('Using cached notification worker reference');
        notificationWorkerRef.current.postMessage({
          type: 'SHOW_WELCOME_NOTIFICATION',
          data: { language }
        });
        return true;
      } else {
        console.log('No active notification service worker found');
        return false;
      }
    } catch (error) {
      console.error('Failed to communicate with notification service worker:', error);
      return false;
    }
  };

  // 노티피케이션 권한 요청 (iOS 호환성 개선)
  const requestNotificationPermission = async (): Promise<boolean> => {
    // iOS Safari에서 Notification API 지원 여부 확인
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    // iOS에서 PWA가 아닌 경우 노티피케이션 지원하지 않음
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isStandalone) {
      console.log('iOS Safari does not support notifications outside of PWA mode');
      return false;
    }

    console.log('Current notification permission:', Notification.permission);
    
    if (Notification.permission === 'granted') {
      console.log('Notification permission already granted');
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('Notification permission denied');
      return false;
    }

    console.log('Requesting notification permission...');
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission result:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  // iOS용 대체 환영 알림 (toast 사용)
  const showIOSWelcomeToast = () => {
    const title = intl.formatMessage({ id: 'pwa.notification.welcome.title' });
    const body = intl.formatMessage({ id: 'pwa.notification.welcome.body' });
    
    // Toast 알림 표시
    setToastData({ title, message: body });
    setToastVisible(true);
  };

  // 서비스 워커를 통한 환영 노티피케이션 전송
  const sendWelcomeNotification = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    console.log('Attempting welcome notification - iOS:', isIOS, 'Standalone:', isStandalone);

    // iOS PWA에서도 일단 시스템 노티피케이션 시도
    const hasPermission = await requestNotificationPermission();
    
    if (!hasPermission) {
      console.log('Notification permission denied, using toast fallback');
      if (isIOS) {
        setTimeout(() => {
          showIOSWelcomeToast();
        }, 1000);
      }
      return;
    }

    console.log('Notification permission granted, attempting system notification');

    // 서비스 워커가 등록되지 않은 경우 등록
    if (!notificationWorkerRef.current) {
      await registerNotificationWorker();
    }

    let systemNotificationSuccess = false;

    try {
      // 커스텀 서비스 워커를 통해 노티피케이션 전송 시도
      const language = intl.locale || 'ko';
      console.log('Attempting notification via custom service worker, language:', language);
      
      systemNotificationSuccess = await sendNotificationViaCustomSW(language);
      
      if (!systemNotificationSuccess) {
        console.log('Custom service worker failed, trying direct notification');
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
        
        console.log('Direct notification created successfully');
        systemNotificationSuccess = true;
      }
    } catch (error) {
      console.error('System notification failed:', error);
      systemNotificationSuccess = false;
    }

    // 시스템 노티피케이션이 실패한 경우 Toast 폴백 (iOS 우선 고려)
    if (!systemNotificationSuccess) {
      console.log('System notification failed, using toast fallback');
      setTimeout(() => {
        showIOSWelcomeToast();
      }, 1000);
    } else if (isIOS) {
      console.log('iOS: Adding toast as additional notification insurance');
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
    initServiceWorker().catch(console.error);

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
    sendWelcomeNotification,
    toastVisible,
    toastData,
    setToastVisible
  };
}