const CACHE_NAME = 'lsm-wifi-cache-v1'; // Ubah 'v1' menjadi 'v2', 'v3', dst. setiap kali ada perubahan signifikan
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/images/icon-192x192.png',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// 1. Instalasi Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Menginstal...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching file aset');
                return cache.addAll(URLS_TO_CACHE);
            })
            .then(() => {
                // Ini adalah bagian kunci untuk pembaruan otomatis.
                // Memaksa Service Worker yang sedang menunggu untuk menjadi yang aktif.
                return self.skipWaiting();
            })
    );
});

// 2. Aktivasi Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Mengaktifkan...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Menghapus cache lama', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Mengambil alih kontrol klien/tab yang terbuka
    );
});

// 3. Fetch (Mengambil) Request
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
