// Impor dan inisialisasi Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js');

// Konfigurasi Firebase Anda (harus sama dengan yang di aplikasi web)
const firebaseConfig = {
  apiKey: "AIzaSyDaTTWL1DBPk1AFReud-2jeFq68vnjn5cw",
  authDomain: "app-keuangan-nopi.firebaseapp.com",
  projectId: "app-keuangan-nopi",
  storageBucket: "app-keuangan-nopi.appspot.com",
  messagingSenderId: "978916150187",
  appId: "1:978916150187:web:ac66a8cba83fe173d620ee"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Tangani pesan yang masuk saat aplikasi di background atau ditutup
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/icon-192x192.png' // Ganti dengan path ikon Anda
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});