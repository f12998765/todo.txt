const CACHE_NAME = 'todo-txt-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './todo.jpg'
];

self.addEventListener('install', function(event) {
  console.log('Service Worker 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('缓存文件中...');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // If resource is in cache, return it
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request).catch(function() {
          // If network fails, and the request is for an HTML document, return the offline page
          if (event.request.destination === 'document') {
            return caches.match('./index.html'); // FIX: Corrected offline page path
          }
        });
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker 激活中...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});