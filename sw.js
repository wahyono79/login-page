const CACHE_NAME = 'wifi-lsm-cache-v1';
// Hanya cache file lokal saat instalasi
const urlsToCache = [
    '/',
    '/index.html',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache dibuka, menyimpan aset dasar');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // Strategi: Network first, then cache
    // Ini akan mencoba mengambil dari jaringan terlebih dahulu.
    // Jika gagal (offline), baru akan mengambil dari cache.
    // Ini menyelesaikan masalah CORS untuk sumber daya eksternal seperti CDN dan font.
    event.respondWith(
        fetch(event.request).then(networkResponse => {
            // Jika berhasil, simpan ke cache dan kembalikan respons jaringan
            // Hanya cache permintaan GET dengan skema http atau https
            if (event.request.method === 'GET' && event.request.url.startsWith('http')) {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }
            return networkResponse; // Kembalikan respons tanpa caching jika tidak memenuhi syarat
        }).catch(() => {
            // Jika jaringan gagal, coba ambil dari cache
            return caches.match(event.request);
        })
    );
});
