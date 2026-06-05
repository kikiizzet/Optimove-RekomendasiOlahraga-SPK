<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\FitnessDataset;

$sports_raw = FitnessDataset::selectRaw('sports_participated, COUNT(*) as cnt')
    ->groupByRaw('sports_participated')
    ->orderByRaw('cnt DESC')
    ->get();

echo "Sports Distribution in Dataset:\n";
echo str_repeat("=", 80) . "\n";

foreach ($sports_raw as $row) {
    echo sprintf("%-50s | Count: %3d\n", $row->sports_participated, $row->cnt);
}

// Now parse individual sports
echo "\n\nIndividual Sports Frequency:\n";
echo str_repeat("=", 80) . "\n";

$all_sports = [];
foreach (FitnessDataset::all() as $dataset) {
    $sports = preg_split('/[;,]/', $dataset->sports_participated);
    foreach ($sports as $sport) {
        $sport = trim($sport);
        if (!empty($sport)) {
            if (!isset($all_sports[$sport])) {
                $all_sports[$sport] = 0;
            }
            $all_sports[$sport]++;
        }
    }
}

arsort($all_sports);
foreach ($all_sports as $sport => $count) {
    echo sprintf("%-40s | Count: %3d\n", $sport, $count);
}
