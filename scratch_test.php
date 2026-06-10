<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'syauqifizan@gmail.com')->first();
if ($user) {
    echo "USER:\n";
    print_r($user->toArray());
} else {
    echo "User not found\n";
}

$history = \App\Models\RecommendationHistory::latest()->take(5)->get();
echo "\nRECENT HISTORIES:\n";
foreach ($history as $h) {
    echo "ID: {$h->id}, Top: {$h->top_recommendation}, Score: {$h->top_score}\n";
    print_r($h->all_recommendations);
    echo "\n";
}
