// Service Worker untuk menangani push notifications
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker');
    event.waitUntil(clients.claim());
});

// Menangani push notification dari server
self.addEventListener('push', event => {
    if (!event.data) {
        console.log('[SW] Push event tapi tidak ada data');
        return;
    }

    const data = event.data.json();
    console.log('[SW] Push notification received:', data);

    const options = {
        body: data.body || 'Reminder dari Optimove',
        icon: '/images/logo.png',
        badge: '/images/badge.png',
        tag: 'optimove-notification',
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Buka Aplikasi'
            },
            {
                action: 'close',
                title: 'Tutup'
            }
        ],
        data: {
            url: data.url || '/workspace',
            ...data
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Optimove Reminder', options)
    );
});

// Menangani klik pada notifikasi
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const relativeUrl = event.notification.data.url || '/workspace';
    const urlToOpen = new URL(relativeUrl, self.location.origin).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // Cek apakah ada tab aplikasi yang sudah terbuka
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // Jika tidak ada, buka tab baru
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Fallback untuk browser yang tidak support notification click
self.addEventListener('notificationclose', event => {
    console.log('[SW] Notifikasi ditutup');
});
