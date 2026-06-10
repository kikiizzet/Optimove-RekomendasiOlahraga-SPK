<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\FitnessDataset;
use App\Models\RecommendationHistory;
use App\Models\WorkoutTodo;
use App\Models\Testimonial;
use Carbon\Carbon;

class RecommendationController extends Controller
{
    /**
     * Bobot kriteria SAW — total = 1.0
     */
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

    /** Olahraga high-impact — dibatasi jika ada kondisi fisik tertentu */
    private array $highImpactSports = ['Basketball', 'Running', 'Football', 'Volleyball', 'Badminton', 'Gym', 'Workout', 'Zumba', 'Aerobic', 'Lifting Weights'];
    private array $lowImpactSports  = ['Swimming', 'Yoga', 'Walking or jogging', 'Cycling'];

    /** Konversi usia ke age_group */
    private function ageToGroup(int $age): string
    {
        if ($age <= 18)  return '15 to 18';
        if ($age <= 25)  return '19 to 25';
        if ($age <= 30)  return '26 to 30';
        if ($age <= 40)  return '31 to 40';
        return '40 and above';
    }

    /** Hitung BMI dari tinggi (cm) dan berat (kg) */
    private function calcBmi(float $height, float $weight): float
    {
        $heightM = $height / 100;
        return round($weight / ($heightM * $heightM), 2);
    }

    /** Kategori BMI */
    private function bmiCategory(float $bmi): string
    {
        if ($bmi < 17.0) return 'Sangat Kurus';
        if ($bmi < 18.5) return 'Kurus';
        if ($bmi < 25.0) return 'Normal';
        if ($bmi < 30.0) return 'Overweight';
        return 'Obesitas';
    }

    /** Skor ordinal generik */
    private function ordinalScore(array $order, string $rowVal, string $inputVal): float
    {
        $a = array_search($rowVal, $order);
        $b = array_search($inputVal, $order);
        if ($a === false || $b === false) return 0.0;
        $maxDiff = count($order) - 1;
        return 1.0 - (abs($a - $b) / $maxDiff);
    }

    /** Hitung skor SAW satu baris dataset */
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
        $parts  = preg_split('/[;,]/', $raw);
        $mapped = array_map(function ($s) {
            $trimmed = trim($s);
            if (strcasecmp($trimmed, 'Walking or jogging') === 0) return 'Walking or jogging';
            return ucwords(strtolower($trimmed));
        }, $parts);
        return array_filter($mapped, function ($s) {
            return $s !== '' && stripos($s, "don't really") === false && stripos($s, "i don't") === false;
        });
    }

    public function index()
    {
        $histories = RecommendationHistory::latest()->take(10)->get();
        $stats     = $this->datasetStats();

        $testimonials = Testimonial::with('user:id,name,email,profile_photo')
            ->where('is_published', true)
            ->latest()
            ->get()
            ->map(function ($item) {
                if ($item->user && $item->user->profile_photo) {
                    $item->user->profile_photo_url = asset('storage/' . $item->user->profile_photo);
                } else {
                    if ($item->user) {
                        $item->user->profile_photo_url = null;
                    }
                }
                return $item;
            });

        $recommendations = session('recommendation_results');
        $formData = session('formData');
        $bmi = session('bmi');
        $bmiCategory = session('bmiCategory');
        $physicalCondition = session('physicalCondition');

        if (Auth::check() && empty($recommendations)) {
            $user = Auth::user();
            $lastHistory = RecommendationHistory::where('user_id', $user->id)
                ->latest()
                ->first();
            if ($lastHistory) {
                $recommendations = is_array($lastHistory->all_recommendations)
                    ? $lastHistory->all_recommendations
                    : json_decode($lastHistory->all_recommendations, true);
                
                $bmi = $user->bmi;
                $bmiCategory = $bmi ? $this->bmiCategory($bmi) : null;
                $physicalCondition = $user->physical_condition;
                $formData = [
                    'age' => $user->age,
                    'age_group' => $lastHistory->age_group ?? $this->ageToGroup($user->age ?? 22),
                    'gender' => $user->gender ?? $lastHistory->gender ?? 'Male',
                    'fitness_level' => $lastHistory->fitness_level ?? 'Good',
                    'exercise_frequency' => $lastHistory->exercise_frequency ?? '1 to 2 times a week',
                    'diet' => $lastHistory->diet ?? 'Not always',
                    'height' => $user->height,
                    'weight' => $user->weight,
                    'physical_condition' => $user->physical_condition,
                ];
            }
        }

        return Inertia::render('Recommendation/Index', [
            'histories'          => $histories,
            'stats'              => $stats,
            'recommendations'    => $recommendations,
            'formData'           => $formData,
            'bmi'                => $bmi,
            'bmiCategory'        => $bmiCategory,
            'physicalCondition'  => $physicalCondition,
            'testimonials'       => $testimonials,
        ]);
    }

    /**
     * Trigger 1 (App): Form Submission — Hitung BMI, filter kondisi fisik, jalankan SAW.
     * Trigger 2 (App): Age-based warning sudah di frontend, tapi age_group dikunci di sini juga.
     */
    public function recommend(Request $request)
    {
        $validated = $request->validate([
            'age'                => 'nullable|integer|min:5|max:100',
            'age_group'          => 'required|string',
            'gender'             => 'required|string',
            'fitness_level'      => 'required|string',
            'exercise_frequency' => 'required|string',
            'diet'               => 'required|string',
            'height'             => 'nullable|numeric|min:50|max:250',
            'weight'             => 'nullable|numeric|min:10|max:300',
            'physical_condition' => 'nullable|string',
        ]);

        // Hitung BMI jika ada data tinggi & berat
        $bmi         = null;
        $bmiCategory = null;
        if (!empty($validated['height']) && !empty($validated['weight'])) {
            $bmi         = $this->calcBmi((float)$validated['height'], (float)$validated['weight']);
            $bmiCategory = $this->bmiCategory($bmi);
        }

        // Override age_group jika usia angka tersedia
        if (!empty($validated['age'])) {
            $validated['age_group'] = $this->ageToGroup((int)$validated['age']);
        }

        $datasets     = FitnessDataset::all();
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

        // Skor rata-rata SAW murni — tidak menggunakan bobot frekuensi agar
        // olahraga populer (Walking or jogging) tidak selalu mendominasi.
        // Gunakan pure average SAW agar hasil rekomendasi betul-betul sesuai profil.
        $hybridScores = [];
        foreach ($sportBuckets as $sport => $b) {
            if ($b['count'] < 2) continue;
            // Pure average SAW: ukuran kesesuaian profil tanpa bias jumlah data
            $hybridScores[$sport] = $b['total'] / $b['count'];
        }

        if (empty($hybridScores)) {
            $hybridScores = ['Walking or jogging' => 0.7, 'Yoga' => 0.65, 'Swimming' => 0.6];
        }

        // Normalisasi relatif ke rentang 40–100%
        $maxH  = max($hybridScores);
        $minH  = min($hybridScores);
        $range = $maxH - $minH;

        $scaledScores = [];
        foreach ($hybridScores as $sport => $h) {
            $scaledScores[$sport] = $range > 0.0001
                ? round(40.0 + (($h - $minH) / $range) * 60.0, 1)
                : round(40.0 + ($h * 60.0), 1);
        }
        arsort($scaledScores);

        // Tandai olahraga berdasarkan kondisi fisik (Trigger 3 App)
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

        // Selalu urutkan berdasarkan score desc agar skor tertinggi selalu nomor 1
        usort($topSports, fn($a, $b) => $b['score'] <=> $a['score']);
        foreach ($topSports as $i => &$s) $s['rank'] = $i + 1;

        // Simpan riwayat ke DB (memicu Trigger DB ke-5)
        $history = RecommendationHistory::create([
            'user_id'             => Auth::check() ? Auth::id() : null,
            'gender'              => $validated['gender'],
            'age_group'           => $validated['age_group'],
            'fitness_level'       => $validated['fitness_level'],
            'exercise_frequency'  => $validated['exercise_frequency'],
            'diet'                => $validated['diet'],
            'top_recommendation'  => $topSports[0]['sport'] ?? '-',
            'top_score'           => $topSports[0]['score'] ?? 0,
            'all_recommendations' => $topSports,
        ]);

        // Jika user sudah login, langsung simpan ke-do list & profil fisik
        if (Auth::check()) {
            $user = Auth::user();
            $user->update([
                'age'                => $validated['age'] ?? $user->age,
                'height'             => $validated['height'] ?? $user->height,
                'weight'             => $validated['weight'] ?? $user->weight,
                'bmi'                => $bmi ?? $user->bmi,
                'physical_condition' => $physicalCondition,
                'last_recommendation'=> $topSports[0]['sport'] ?? null,
            ]);

            // Auto-generate to-do olahraga dari Top 3 untuk hari ini
            $existingToday = WorkoutTodo::where('user_id', $user->id)
                ->whereDate('due_date', Carbon::today())
                ->count();
            if ($existingToday === 0) {
                foreach (array_slice($topSports, 0, 3) as $s) {
                    WorkoutTodo::create([
                        'user_id'    => $user->id,
                        'task_name'  => 'Lakukan ' . $s['sport'] . ' hari ini',
                        'sport_name' => $s['sport'],
                        'due_date'   => Carbon::today(),
                    ]);
                }
            }
        } else {
            // Simpan ke session untuk diambil setelah login/register
            session([
                'pending_recommendation' => [
                    'history_id'         => $history->id,
                    'top_sports'         => $topSports,
                    'bmi'                => $bmi,
                    'bmi_category'       => $bmiCategory,
                    'age'                => $validated['age'] ?? null,
                    'height'             => $validated['height'] ?? null,
                    'weight'             => $validated['weight'] ?? null,
                    'physical_condition' => $physicalCondition,
                ],
            ]);
        }

        session([
            'recommendation_results' => $topSports,
            'formData'               => $validated,
            'bmi'                    => $bmi,
            'bmiCategory'            => $bmiCategory,
            'physicalCondition'      => $physicalCondition,
        ]);

        return redirect()->route('home');
    }

    /** Statistik distribusi dataset */
    private function datasetStats(): array
    {
        $all = FitnessDataset::all();

        $genderDist  = $all->groupBy('gender')->map->count()->toArray();
        $ageDist     = $all->groupBy('age_group')->map->count()->toArray();
        $fitnessDist = $all->groupBy('fitness_level')->map->count()->toArray();
        $freqDist    = $all->groupBy('exercise_frequency')->map->count()->toArray();

        $sportCount = [];
        foreach ($all as $row) {
            foreach ($this->parseSports($row->sports_participated ?? '') as $sport) {
                $sportCount[$sport] = ($sportCount[$sport] ?? 0) + 1;
            }
        }
        arsort($sportCount);
        $topSports = array_slice($sportCount, 0, 8, true);

        return [
            'total'      => $all->count(),
            'gender'     => $genderDist,
            'age'        => $ageDist,
            'fitness'    => $fitnessDist,
            'frequency'  => $freqDist,
            'top_sports' => $topSports,
        ];
    }
}
