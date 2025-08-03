// PWA 노티피케이션 전용 서비스 워커
console.log('Notification Service Worker script loaded');

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('Notification Service Worker installing...');
  event.waitUntil(
    Promise.resolve().then(() => {
      console.log('Notification Service Worker installed successfully');
      self.skipWaiting();
    })
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('Notification Service Worker activating...');
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log('Notification Service Worker activated and claimed clients');
    })
  );
});

// PWA 환영 노티피케이션 표시
function showWelcomeNotification(language = 'ko') {
  const messages = {
    ko: {
      title: '미라클 플라워에 오신 것을 환영합니다!',
      body: '앱이 성공적으로 설치되었습니다. 언제든지 아름다운 꽃 작품을 만나보세요.',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png'
    },
    en: {
      title: 'Welcome to Miracle Flower!',
      body: 'The app has been successfully installed. Discover beautiful floral creations anytime.',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png'
    }
  };

  const message = messages[language] || messages.ko;

  const options = {
    body: message.body,
    icon: message.icon,
    badge: message.badge,
    tag: 'pwa-welcome',
    requireInteraction: false,
    silent: false,
    data: {
      url: '/',
      action: 'welcome'
    },
    actions: [
      {
        action: 'view',
        title: language === 'ko' ? '앱 열기' : 'Open App'
      }
    ]
  };

  self.registration.showNotification(message.title, options);
}

// 메인 스레드로부터 메시지 수신
self.addEventListener('message', (event) => {
  console.log('Notification Service Worker received message:', event.data);
  
  const { type, data } = event.data;

  switch (type) {
    case 'SHOW_WELCOME_NOTIFICATION':
      console.log('Showing welcome notification with language:', data?.language);
      showWelcomeNotification(data?.language);
      break;
    case 'SKIP_WAITING':
      console.log('Skip waiting requested');
      self.skipWaiting();
      break;
    default:
      console.log('Unknown message type:', type);
  }
});

// 노티피케이션 클릭 이벤트 처리
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const { data } = event.notification;
  const action = event.action || 'default';

  if (action === 'view' || action === 'default') {
    const urlToOpen = data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then((clientList) => {
        // 이미 열린 탭이 있는지 확인
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 새 탭 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// 백그라운드 동기화 (향후 확장용)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-notification') {
    event.waitUntil(
      // 백그라운드에서 수행할 작업
      console.log('Background sync triggered')
    );
  }
});

// 푸시 이벤트 (향후 서버 푸시 메시지용)
self.addEventListener('push', (event) => {
  console.log('Push message received');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || '새로운 알림이 있습니다.',
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/icon-192x192.png',
      tag: data.tag || 'push-notification',
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Miracle Flower', options)
    );
  }
});