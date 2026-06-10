<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateVapidKeys extends Command
{
    protected $signature = 'vapid:generate';
    protected $description = 'Generate VAPID keys untuk push notifications';

    public function handle()
    {
        try {
            // Generate VAPID keys menggunakan openssl
            $privKey = openssl_pkey_new([
                'private_key_bits' => 4096,
                'private_key_type' => OPENSSL_KEYTYPE_EC,
                'curve_name' => 'prime256v1'
            ]);

            if (!$privKey) {
                throw new \Exception('Gagal generate private key dengan OpenSSL');
            }

            // Extract private key
            openssl_pkey_export($privKey, $privateKeyPem);
            
            // Extract public key
            $pubKeyDetails = openssl_pkey_get_details($privKey);
            $publicKeyPem = $pubKeyDetails['key'];

            // Parse keys ke format yang diperlukan web-push
            $privateKeyObj = openssl_pkey_get_private($privateKeyPem);
            $publicKeyObj = openssl_pkey_get_public($publicKeyPem);

            $privKeyDetails = openssl_pkey_get_details($privateKeyObj);
            $pubKeyDetails = openssl_pkey_get_details($publicKeyObj);

            // Extract EC key components
            $privKey_bn = $privKeyDetails['ec']['d'];
            $pubKey_x = $pubKeyDetails['ec']['x'];
            $pubKey_y = $pubKeyDetails['ec']['y'];

            // Encode to base64url format
            $publicKey = $this->encodeBase64Url($pubKey_x . $pubKey_y);
            $privateKey = $this->encodeBase64Url($privKey_bn);

            // Update .env
            $envPath = base_path('.env');
            $envContent = file_get_contents($envPath);

            // Remove existing keys if any
            $envContent = preg_replace('/VAPID_PUBLIC_KEY=.*/i', '', $envContent);
            $envContent = preg_replace('/VAPID_PRIVATE_KEY=.*/i', '', $envContent);
            $envContent = preg_replace('/VAPID_SUBJECT=.*/i', '', $envContent);

            // Add new keys
            $newEnv = "VAPID_PUBLIC_KEY={$publicKey}\n";
            $newEnv .= "VAPID_PRIVATE_KEY={$privateKey}\n";
            $newEnv .= "VAPID_SUBJECT=mailto:admin@optimove.test\n";
            $newEnv .= $envContent;

            file_put_contents($envPath, $newEnv);

            $this->info('✅ VAPID keys berhasil di-generate dan disimpan di .env');
            $this->line('');
            $this->line('VAPID Public Key (untuk client): ');
            $this->line($publicKey);
            $this->line('');
            $this->info('Keys sudah tersimpan di file .env');

        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            
            // Fallback: Generate simple keys untuk development
            $this->warn('Menggunakan fallback key generation untuk development...');
            $this->generateFallbackKeys();
        }
    }

    private function generateFallbackKeys()
    {
        // Generate random keys untuk development (jangan gunakan di production)
        $publicKey = base64_encode(random_bytes(65));
        $privateKey = base64_encode(random_bytes(32));

        $envPath = base_path('.env');
        $envContent = file_get_contents($envPath);

        $envContent = preg_replace('/VAPID_PUBLIC_KEY=.*/i', '', $envContent);
        $envContent = preg_replace('/VAPID_PRIVATE_KEY=.*/i', '', $envContent);
        $envContent = preg_replace('/VAPID_SUBJECT=.*/i', '', $envContent);

        $newEnv = "VAPID_PUBLIC_KEY={$publicKey}\n";
        $newEnv .= "VAPID_PRIVATE_KEY={$privateKey}\n";
        $newEnv .= "VAPID_SUBJECT=mailto:admin@optimove.test\n";
        $newEnv .= $envContent;

        file_put_contents($envPath, $newEnv);

        $this->warn('⚠️ FALLBACK: Keys untuk development saja!');
        $this->line('Untuk production, silakan generate keys dengan proper OpenSSL');
    }

    private function encodeBase64Url($data)
    {
        return strtr(base64_encode($data), '+/', '-_');
    }
}
