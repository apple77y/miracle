// Minimal notification service worker stub for development
// This file prevents 404s for /sw-notification.js and provides
// basic handlers for push and notificationclick events.

self.addEventListener('push', function (event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: '알림', body: event.data ? event.data.text() : '새로운 알림이 도착했습니다.' };
  }

  const title = data.title || 'Miracle Flower';
  const options = Object.assign({
    body: data.body || '새로운 소식이 있습니다!',
    icon: '/android-icon-192x192.png',
    badge: '/apple-icon.png',
    data: data,
  }, data.options || {});

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientsArr) {
      for (const client of clientsArr) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

// Optional: respond to messages from the page
self.addEventListener('message', (evt) => {
  // simple echo
  if (evt && evt.data && evt.data.type === 'PING') {
    evt.source.postMessage({ type: 'PONG' });
  }
});

