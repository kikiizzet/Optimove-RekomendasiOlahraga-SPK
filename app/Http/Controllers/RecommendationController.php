<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FitnessDataset;
use App\Models\RecommendationHistory;

class RecommendationController extends Controller
{
    /**
     * Bobot kriteria SAW — total = 1.0
     */
    private array $weights = [
        'age_group'          => 0.25,
        'gender'             => 0.10,
        'fitness_level'      => 0.30,
        'exercise_frequency' => 0.25,
        'diet'               => 0.10,
    ];

    private array $ageOrder      = ['15 to 18', '19 to 25', '26 to 30', '31 to 40', '40 and above'];
    private array $fitnessOrder  = ['Unfit', 'Average', 'Good', 'Very good', 'Excellent'];
    private array $freqOrder     = ['Never', '1 to 2 times a week', '3 to 4 times a week', 'Everyday'];
    private array $dietOrder     = ['No', 'Not always', 'Yes'];

    /** Skor ordinal generik — semakin jauh rangking, semakin rendah skor */
    private function ordinalScore(array $order, string $rowVal, string $inputVal): float
    {
        $a = array_search($rowVal, $order);
        $b = array_search($inputVal, $order);
        if ($a === false || $b === false) return 0.0;
        $maxDiff = count($order) - 1;
        $diff    = abs($a - $b);
        // Linier: skor = 1 - (diff / maxDiff)
        return 1.0 - ($diff / $maxDiff);
    }

    /** Hitung skor SAW satu baris dataset terhadap input pengguna */
    private function sawScore(FitnessDataset $row, array $input): float
    {
        $genderScore = ($row->gender === $input['gender']) ? 1.0 : 0.0;

        return
            $this->weights['age_group']          * $this->ordinalScore($this->ageOrder,     $row->age_group,          $input['age_group']) +
            $this->weights['gender']              * $genderScore +
            $this->weights['fitness_level']       * $this->ordinalScore($this->fitnessOrder, $row->fitness_level,      $input['fitness_level']) +
            $this->weights['exercise_frequency']  * $this->ordinalScore($this->freqOrder,    $row->exercise_frequency, $input['exercise_frequency']) +
            $this->weights['diet']                * $this->ordinalScore($this->dietOrder,    $row->diet,               $input['diet']);
    }

    /** Parse olahraga dari string — mendukung pemisah ; dan , */
    private function parseSports(string $raw): array
    {
        $parts = preg_split('/[;,]/', $raw);
        return array_filter(array_map('trim', $parts), function ($s) {
            return $s !== '' && stripos($s, "don't really") === false
                && stripos($s, "i don't") === false;
        });
    }

    public function index()
    {
        $histories = RecommendationHistory::latest()->take(10)->get();
        $stats     = $this->datasetStats();

        return Inertia::render('Recommendation/Index', [
            'histories' => $histories,
            'stats'     => $stats,
        ]);
    }

    public function recommend(Request $request)
    {
        $validated = $request->validate([
            'age_group'          => 'required|string',
            'gender'             => 'required|string',
            'fitness_level'      => 'required|string',
            'exercise_frequency' => 'required|string',
            'diet'               => 'required|string',
        ]);

        $datasets = FitnessDataset::all();

        // Akumulasi skor SAW per olahraga
        // Hanya gunakan baris yang AGE-nya dekat (skor usia >= 0.5 = exact atau adjacent)
        // agar kelompok usia yang jauh tidak mendominasi hasil
        $sportBuckets = [];

        foreach ($datasets as $row) {
            // Filter ketat berdasarkan usia — jika skor usia < 0.5, skip
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

        // Skor Hybrid SAW:
        // score = rata_rata_SAW × log(count + 1)
        // Ini menyeimbangkan kemiripan profil (SAW) + popularitas olahraga di kelompok usia tersebut
        // Walking or jogging yang populer tapi tersebar luas tetap unggul karena count-nya tinggi
        $hybridScores = [];
        foreach ($sportBuckets as $sport => $b) {
            if ($b['count'] < 2) continue;
            $avgSaw = $b['total'] / $b['count'];
            $hybridScores[$sport] = $avgSaw * log($b['count'] + 1);
        }

        // Fallback jika tidak ada hasil
        if (empty($hybridScores)) {
            $hybridScores = ['Walking or jogging' => 1.4, 'Yoga' => 1.2, 'Gym' => 1.0];
        }

        // Normalisasi relatif ke rentang 40–100%
        $maxH = max($hybridScores);
        $minH = min($hybridScores);
        $range = $maxH - $minH;

        $scaledScores = [];
        foreach ($hybridScores as $sport => $h) {
            $scaledScores[$sport] = $range > 0.0001
                ? round(40.0 + (($h - $minH) / $range) * 60.0, 1)
                : 70.0;
        }

        arsort($scaledScores);


        $topSports = [];
        $rank = 1;
        foreach ($scaledScores as $sport => $score) {
            if ($rank > 5) break;
            $topSports[] = ['rank' => $rank++, 'sport' => $sport, 'score' => $score];
        }

        // Simpan riwayat
        RecommendationHistory::create([
            'gender'             => $validated['gender'],
            'age_group'          => $validated['age_group'],
            'fitness_level'      => $validated['fitness_level'],
            'exercise_frequency' => $validated['exercise_frequency'],
            'diet'               => $validated['diet'],
            'top_recommendation' => $topSports[0]['sport'] ?? '-',
            'top_score'          => $topSports[0]['score'] ?? 0,
            'all_recommendations'=> $topSports,
        ]);

        $histories = RecommendationHistory::latest()->take(10)->get();
        $stats     = $this->datasetStats();

        return Inertia::render('Recommendation/Index', [
            'recommendations' => $topSports,
            'formData'        => $validated,
            'histories'       => $histories,
            'stats'           => $stats,
        ]);
    }

    /** Statistik distribusi dataset untuk ditampilkan di frontend */
    private function datasetStats(): array
    {
        $all = FitnessDataset::all();

        $genderDist  = $all->groupBy('gender')->map->count()->toArray();
        $ageDist     = $all->groupBy('age_group')->map->count()->toArray();
        $fitnessDist = $all->groupBy('fitness_level')->map->count()->toArray();
        $freqDist    = $all->groupBy('exercise_frequency')->map->count()->toArray();

        // Top olahraga dari seluruh dataset
        $sportCount = [];
        foreach ($all as $row) {
            foreach ($this->parseSports($row->sports_participated ?? '') as $sport) {
                $sportCount[$sport] = ($sportCount[$sport] ?? 0) + 1;
            }
        }
        arsort($sportCount);
        $topSports = array_slice($sportCount, 0, 8, true);

        return [
            'total'       => $all->count(),
            'gender'      => $genderDist,
            'age'         => $ageDist,
            'fitness'     => $fitnessDist,
            'frequency'   => $freqDist,
            'top_sports'  => $topSports,
        ];
    }
}
