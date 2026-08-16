// public/sw.js - MINIMAL WORKING SERVICE WORKER

// Replace your current sw.js with this exact code

console.log('🔧 Service Worker: Loading...');

const CACHE_NAME = 'she-model-tech-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Cache opened');
        // Cache just the essential files
        return cache.addAll([
          '/',
          '/Images/512X512.png',
          '/manifest.json'
        ]);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.log('⚠️ Service Worker: Cache failed, but continuing:', error);
        // Don't fail installation if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log('✅ Service Worker: Activation complete - PWA ready!');
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Only handle GET requests from same origin
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then((response) => {
            return response || new Response('Offline', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Handle messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('✅ Service Worker: Script loaded successfully');
