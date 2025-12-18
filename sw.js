const CACHE_NAME = 'lsm-wifi-cache-v3'; // Naikkan versi cache untuk memicu pembaruan
const URLS_TO_CACHE = [
    '/',
    '/index.html',

    '/manifest.json',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png' // Tambahkan ikon lain yang ada di manifest
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
    // Strategi: Network falling back to cache
    // Coba ambil dari jaringan dulu, jika gagal (offline), baru ambil dari cache.
    // Ini bagus untuk aset yang sering berubah seperti HTML.
    event.respondWith(
        fetch(event.request).catch(() => {
            // Jika fetch gagal (misalnya, tidak ada koneksi jaringan),
            // coba cari respons yang cocok di dalam cache.
            return caches.match(event.request).then(response => {
                if (response) {
                    return response; // Kembalikan dari cache jika ditemukan
                }
                // Jika tidak ada di cache juga, permintaan akan gagal secara alami.
                // Ini penting untuk request non-aset (seperti API call ke Firestore)
            });
        })
    );
});
