// resources/js/utils/pushNotification.js

/**
 * Initialize push notification system
 * Daftarkan service worker dan request permission dari user
 */
export async function initializePushNotification() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications tidak didukung di browser ini');
        return false;
    }

    try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
        });
        console.log('✅ Service Worker registered:', registration);

        // Request notification permission
        if (Notification.permission === 'granted') {
            console.log('✅ Notification permission sudah diberikan');
            return registration;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('✅ User memberikan permission untuk notification');
                return registration;
            }
        }

        return registration;
    } catch (error) {
        console.error('❌ Error initializing push notification:', error);
        return false;
    }
}

/**
 * Subscribe ke push notification
 */
export async function subscribeToPushNotification() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications tidak didukung');
        return false;
    }

    if (Notification.permission !== 'granted') {
        console.warn('User belum memberikan permission untuk notification');
        return false;
    }

    try {
        // Get VAPID public key dari server
        const keyResponse = await fetch('/api/push/public-key');
        const { publicKey } = await keyResponse.json();

        if (!publicKey) {
            throw new Error('VAPID public key tidak ditemukan');
        }

        // Register and ensure service worker is active
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
        });
        await navigator.serviceWorker.ready;

        // Subscribe ke push manager
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        // Kirim subscription ke backend
        const response = await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify({
                endpoint: subscription.endpoint,
                publicKey: subscription.getKey('p256dh') ? arrayBufferToBase64(subscription.getKey('p256dh')) : '',
                authToken: subscription.getKey('auth') ? arrayBufferToBase64(subscription.getKey('auth')) : '',
            }),
        });

        if (response.ok) {
            console.log('✅ Push subscription berhasil disimpan');
            return true;
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Gagal subscribe');
        }
    } catch (error) {
        console.error('❌ Error subscribing to push notification:', error);
        alert('Gagal mengaktifkan notifikasi: ' + error.message);
        return false;
    }
}

/**
 * Unsubscribe dari push notification
 */
export async function unsubscribeFromPushNotification() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            console.log('Tidak ada subscription aktif');
            return true;
        }

        // Hapus dari backend
        const response = await fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify({
                endpoint: subscription.endpoint,
            }),
        });

        // Unsubscribe dari browser
        await subscription.unsubscribe();

        if (response.ok) {
            console.log('✅ Push subscription berhasil dihapus');
            return true;
        }
    } catch (error) {
        console.error('❌ Error unsubscribing from push notification:', error);
        return false;
    }
}

/**
 * Convert VAPID public key dari base64 ke Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
    const base64Clean = base64String.replace(/=+$/, '');
    const padding = '='.repeat((4 - base64Clean.length % 4) % 4);
    const base64 = (base64Clean + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Convert ArrayBuffer ke base64
 */
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/**
 * Check apakah push notification sudah active
 */
export async function checkPushNotificationStatus() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return { supported: false, enabled: false };
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration('/');
        if (!registration) {
            return {
                supported: true,
                enabled: false,
                permission: Notification.permission,
            };
        }
        const subscription = await registration.pushManager.getSubscription();

        return {
            supported: true,
            enabled: subscription !== null,
            permission: Notification.permission,
        };
    } catch (error) {
        console.error('Error checking push notification status:', error);
        return { supported: false, enabled: false };
    }
}

/**
 * Send test notification (untuk development)
 */
export async function sendTestNotification() {
    try {
        const response = await fetch('/api/push/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
        });

        if (response.ok) {
            console.log('✅ Test notification terkirim');
            return true;
        }
    } catch (error) {
        console.error('❌ Error sending test notification:', error);
        return false;
    }
}
