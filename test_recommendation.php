<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\FitnessDataset;

class Tester {
    private array $weights = [
        'age_group'          => 0.15,
        'gender'             => 0.10,
        'fitness_level'      => 0.35,
        'exercise_frequency' => 0.20,
        'diet'               => 0.20,
    ];

    private array $ageOrder     = ['15 to 18', '19 to 25', '26 to 30', '31 to 40', '40 and above'];
    private array $fitnessOrder = ['Unfit', 'Average', 'Good', 'Very good', 'Excellent'];
    private array $freqOrder    = ['Never', '1 to 2 times a week', '3 to 4 times a week', 'Everyday'];
    private array $dietOrder    = ['No', 'Not always', 'Yes'];

    private array $highImpactSports = ['Basketball', 'Running', 'Football', 'Volleyball', 'Badminton', 'Gym'];
    private array $lowImpactSports  = ['Swimming', 'Yoga', 'Walking or jogging', 'Cycling'];

    private function ordinalScore(array $order, string $rowVal, string $inputVal): float
    {
        $a = array_search($rowVal, $order);
        $b = array_search($inputVal, $order);
        if ($a === false || $b === false) return 0.0;
        $maxDiff = count($order) - 1;
        return 1.0 - (abs($a - $b) / $maxDiff);
    }

    private function sawScore($row, array $input): float
    {
        $genderScore = ($row->gender === $input['gender']) ? 1.0 : 0.0;
        return
            $this->weights['age_group']          * $this->ordinalScore($this->ageOrder,     $row->age_group,          $input['age_group']) +
            $this->weights['gender']              * $genderScore +
            $this->weights['fitness_level']       * $this->ordinalScore($this->fitnessOrder, $row->fitness_level,      $input['fitness_level']) +
            $this->weights['exercise_frequency']  * $this->ordinalScore($this->freqOrder,    $row->exercise_frequency, $input['exercise_frequency']) +
            $this->weights['diet']                * $this->ordinalScore($this->dietOrder,    $row->diet,               $input['diet']);
    }

    private function parseSports(?string $raw): array
    {
        $parts  = preg_split('/[;,]/', $raw ?? '');
        $mapped = array_map(function ($s) {
            $trimmed = trim($s);
            if (strcasecmp($trimmed, 'Walking or jogging') === 0) return 'Walking or jogging';
            return ucwords(strtolower($trimmed));
        }, $parts);
        return array_filter($mapped, function ($s) {
            return $s !== '' && stripos($s, "don't really") === false && stripos($s, "i don't") === false;
        });
    }

    public function runTest(array $validated) {
        $datasets = FitnessDataset::all();
        $sportBuckets = [];

        foreach ($datasets as $row) {
            $ageScore = $this->ordinalScore($this->ageOrder, $row->age_group, $validated['age_group']);
            if ($ageScore < 0.5) continue;

            $score  = $this->sawScore($row, $validated);
            $sports = $this->parseSports($row->sports_participated ?? '');

            foreach ($sports as $sport) {
                if (!isset($sportBuckets[$sport])) {
                    $sportBuckets[$sport] = ['total' => 0.0, 'count' => 0];
                }
                $sportBuckets[$sport]['total'] += $score;
                $sportBuckets[$sport]['count']++;
            }
        }

        $hybridScores = [];
        $coeff = 0.1; // Test coefficient: 0.1, 0.15, 0.2, etc.
        foreach ($sportBuckets as $sport => $b) {
            if ($b['count'] < 2) continue;
            $avgSaw                 = $b['total'] / $b['count'];
            $hybridScores[$sport]   = $avgSaw * (1 + $coeff * log($b['count'] + 1));
        }

        if (empty($hybridScores)) {
            $hybridScores = ['Walking or jogging' => 1.4, 'Yoga' => 1.2, 'Swimming' => 1.0];
        }

        // Relative scaling
        $maxH  = max($hybridScores);
        $minH  = min($hybridScores);
        $range = $maxH - $minH;

        $scaledScores = [];
        foreach ($hybridScores as $sport => $h) {
            $scaledScores[$sport] = $range > 0.0001
                ? round(40.0 + (($h - $minH) / $range) * 60.0, 1)
                : 70.0;
        }
        arsort($scaledScores);

        $physicalCondition = $validated['physical_condition'] ?? 'none';
        $topSports = [];
        $rank      = 1;
        foreach ($scaledScores as $sport => $score) {
            if ($rank > 5) break;
            $isHighImpact = in_array($sport, $this->highImpactSports);
            $isLowImpact  = in_array($sport, $this->lowImpactSports);
            $warning      = false;
            if (in_array($physicalCondition, ['knee_injury', 'asthma', 'heart']) && $isHighImpact) {
                $warning = true;
            }
            $topSports[] = [
                'rank'        => $rank++,
                'sport'       => $sport,
                'score'       => $score,
                'warning'     => $warning,
                'low_impact'  => $isLowImpact,
            ];
        }

        if ($physicalCondition !== 'none') {
            usort($topSports, fn($a, $b) => $a['warning'] <=> $b['warning'] ?: $b['low_impact'] <=> $a['low_impact']);
            foreach ($topSports as $i => &$s) $s['rank'] = $i + 1;
        }

        return $topSports;
    }
}

$tester = new Tester();

$testProfiles = [
    'Profile 1 (Muda, Sehat, Sering Olahraga)' => [
        'age_group' => '19 to 25',
        'gender' => 'Male',
        'fitness_level' => 'Excellent',
        'exercise_frequency' => 'Everyday',
        'diet' => 'Yes',
        'physical_condition' => 'none',
    ],
    'Profile 2 (Tua, Cedera Lutut, Jarang Olahraga)' => [
        'age_group' => '40 and above',
        'gender' => 'Female',
        'fitness_level' => 'Unfit',
        'exercise_frequency' => 'Never',
        'diet' => 'No',
        'physical_condition' => 'knee_injury',
    ],
    'Profile 3 (Remaja, Normal, Kadang Olahraga)' => [
        'age_group' => '15 to 18',
        'gender' => 'Male',
        'fitness_level' => 'Average',
        'exercise_frequency' => '3 to 4 times a week',
        'diet' => 'Not always',
        'physical_condition' => 'none',
    ]
];

foreach ($testProfiles as $name => $profile) {
    echo "=== {$name} ===\n";
    $results = $tester->runTest($profile);
    foreach ($results as $res) {
        echo "#{$res['rank']}: {$res['sport']} (Score: {$res['score']})" . ($res['warning'] ? " [WARNING]" : "") . "\n";
    }
    echo "\n";
}
