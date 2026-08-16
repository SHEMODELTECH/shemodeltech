/* public/firebase-messaging-sw.js
   Handles background push notifications for She Model Tech.
   Uses the compat builds because service workers can't use ES modules everywhere. */

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDS_MOXQxK2yZrcFF-nffW6q3TDWPZa-yA',
  authDomain: 'she-model-tech.firebaseapp.com',
  projectId: 'she-model-tech',
  storageBucket: 'she-model-tech.firebasestorage.app',
  messagingSenderId: '934036259206',
  appId: '1:934036259206:web:7ee969f34c22685752ac07',
});

const messaging = firebase.messaging();

// Background messages (site closed or tab not focused).
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'She Model Tech';
  const options = {
    body: payload.notification?.body || '',
    icon: '/Images/512X512.png',
    badge: '/Images/512X512.png',
    data: { link: payload.data?.link || payload.fcmOptions?.link || '/' },
  };
  self.registration.showNotification(title, options);
});

// Click → focus or open the app at the link.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = event.notification.data?.link || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(link);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(link);
    })
  );
});
