const CACHE_NAME = 'ttodol-game-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/src/assets/images/fruits/cherry.png',
  '/src/assets/images/fruits/strawberry.png',
  '/src/assets/images/fruits/grape.png',
  '/src/assets/images/fruits/orange.png',
  '/src/assets/images/fruits/persimmon.png',
  '/src/assets/images/fruits/apple.png',
  '/src/assets/images/fruits/pear.png',
  '/src/assets/images/fruits/peach.png',
  '/src/assets/images/fruits/pineapple.png',
  '/src/assets/images/fruits/melon.png',
  '/src/assets/images/fruits/watermelon.png',
  '/src/assets/images/backgrounds/pattern1.png',
  '/src/assets/images/backgrounds/pattern2.png',
  '/src/assets/images/backgrounds/pattern3.png',
  '/src/assets/images/backgrounds/pattern4.png',
  '/src/assets/images/backgrounds/pattern5.png',
  '/src/assets/audio/background_music.mp3',
  '/src/assets/audio/merge_sound.mp3',
  '/src/assets/audio/drop_sound.mp3',
  '/src/assets/audio/game_over.mp3'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched response for future use
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(err => {
        // Offline fallback
        console.error('Fetch failed:', err);
        // You could return a custom offline page here
      })
  );
});

// Background sync for score updates
self.addEventListener('sync', event => {
  if (event.tag === 'sync-scores') {
    event.waitUntil(syncScores());
  }
});

async function syncScores() {
  try {
    // Get pending score updates from IndexedDB
    const pendingScores = await getPendingScores();
    
    // Send to server
    for (const score of pendingScores) {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(score)
      });
      
      // Remove from pending after successful sync
      await removePendingScore(score.id);
    }
  } catch (error) {
    console.error('Score sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingScores() {
  // Implementation would retrieve pending scores from IndexedDB
  return [];
}

async function removePendingScore(id) {
  // Implementation would remove synced score from IndexedDB
}

// Push notification support
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '새로운 도전이 기다리고 있어요!',
    icon: '/src/assets/images/fruits/watermelon.png',
    badge: '/src/assets/images/fruits/cherry.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'play',
        title: '지금 플레이',
        icon: '/src/assets/images/fruits/apple.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/src/assets/images/fruits/grape.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('뜨돌 게임', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'play') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});