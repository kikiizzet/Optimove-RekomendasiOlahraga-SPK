<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\FitnessDataset;

$datasets = FitnessDataset::all();
$sportCounts = [];
$rawCounts = [];

foreach ($datasets as $row) {
    $raw = $row->sports_participated;
    if (!isset($rawCounts[$raw])) {
        $rawCounts[$raw] = 0;
    }
    $rawCounts[$raw]++;

    // Simulate parseSports logic from RecommendationController
    $parts = preg_split('/[;,]/', $raw ?? '');
    foreach ($parts as $part) {
        $trimmed = trim($part);
        if ($trimmed === '') continue;
        
        if (strcasecmp($trimmed, 'Walking or jogging') === 0) {
            $sport = 'Walking or jogging';
        } else {
            $sport = ucwords(strtolower($trimmed));
        }
        
        if (stripos($sport, "don't really") !== false || stripos($sport, "i don't") !== false) {
            continue;
        }

        if (!isset($sportCounts[$sport])) {
            $sportCounts[$sport] = 0;
        }
        $sportCounts[$sport]++;
    }
}

echo "TOTAL DATASET ROWS: " . count($datasets) . "\n\n";
echo "TOP 15 PARSED SPORTS BY FREQUENCY:\n";
arsort($sportCounts);
print_r(array_slice($sportCounts, 0, 15, true));

echo "\nTOP 10 RAW SPORTS_PARTICIPATED STRINGS:\n";
arsort($rawCounts);
print_r(array_slice($rawCounts, 0, 10, true));
