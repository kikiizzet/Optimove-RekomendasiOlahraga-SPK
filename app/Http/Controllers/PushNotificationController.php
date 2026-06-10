<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PushNotificationController extends Controller
{
    /**
     * Dapatkan VAPID public key untuk client
     */
    public function getPublicKey()
    {
        return response()->json([
            'publicKey' => env('VAPID_PUBLIC_KEY'),
        ]);
    }

    /**
     * Simpan push subscription dari client
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'endpoint' => 'required|string',
            'publicKey' => 'required|string',
            'authToken' => 'required|string',
        ]);

        $user = Auth::user();

        // Update atau create subscription
        PushSubscription::updateOrCreate(
            [
                'user_id' => $user->id,
                'endpoint' => $request->endpoint,
            ],
            [
                'public_key' => $request->publicKey,
                'auth_token' => $request->authToken,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Berhasil subscribe push notifications'
        ]);
    }

    /**
     * Hapus push subscription
     */
    public function unsubscribe(Request $request)
    {
        $request->validate([
            'endpoint' => 'required|string',
        ]);

        $user = Auth::user();

        PushSubscription::where('user_id', $user->id)
            ->where('endpoint', $request->endpoint)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil unsubscribe push notifications'
        ]);
    }

    /**
     * Kirim test notification (untuk development)
     */
    public function sendTest(Request $request)
    {
        $user = Auth::user();
        $subscriptions = PushSubscription::where('user_id', $user->id)->get();

        if ($subscriptions->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada subscription ditemukan'
            ], 404);
        }

        foreach ($subscriptions as $subscription) {
            $this->sendPushNotification(
                $subscription,
                'Test Notification',
                'Ini adalah notifikasi test dari Optimove!',
                'Notifikasi Test'
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Test notification terkirim'
        ]);
    }

    /**
     * Helper untuk mengirim push notification
     */
    public static function sendPushNotification($subscription, $title, $body, $tag = 'optimove-notification', $url = '/workspace')
    {
        try {
            $auth = [
                'VAPID' => [
                    'subject' => env('VAPID_SUBJECT', 'mailto:admin@optimove.test'),
                    'publicKey' => env('VAPID_PUBLIC_KEY'),
                    'privateKey' => env('VAPID_PRIVATE_KEY'),
                ]
            ];

            $webPush = new \Minishlink\WebPush\WebPush($auth);
            $webPush->setAutomaticPadding(true);

            $notification = [
                'title' => $title,
                'body' => $body,
                'tag' => $tag,
                'url' => $url,
            ];

            $res = $webPush->sendOneNotification(
                new \Minishlink\WebPush\Subscription(
                    $subscription->endpoint,
                    $subscription->public_key,
                    $subscription->auth_token
                ),
                json_encode($notification)
            );

            return $res->isSuccess();
        } catch (\Exception $e) {
            \Log::error('Push notification error: ' . $e->getMessage());
            return false;
        }
    }
}
