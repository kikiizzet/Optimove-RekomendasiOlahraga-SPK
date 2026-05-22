<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\FitnessDataset;
use App\Models\RecommendationHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Show admin dashboard with statistics
     */
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_datasets' => FitnessDataset::count(),
            'total_recommendations' => RecommendationHistory::count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'users_by_role' => User::selectRaw('role, count(*) as count')->groupBy('role')->get(),
        ];

        // Top 10 recommended sports
        $topSports = RecommendationHistory::selectRaw('top_recommendation, count(*) as count')
            ->whereNotNull('top_recommendation')
            ->groupBy('top_recommendation')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Recent recommendations
        $recentRecommendations = RecommendationHistory::latest()
            ->limit(20)
            ->get();

        // Dataset statistics
        $datasetStats = [
            'by_age' => FitnessDataset::selectRaw('age_group, count(*) as count')
                ->groupBy('age_group')
                ->get(),
            'by_fitness' => FitnessDataset::selectRaw('fitness_level, count(*) as count')
                ->groupBy('fitness_level')
                ->get(),
            'by_gender' => FitnessDataset::selectRaw('gender, count(*) as count')
                ->groupBy('gender')
                ->get(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'topSports' => $topSports,
            'recentRecommendations' => $recentRecommendations,
            'datasetStats' => $datasetStats,
        ]);
    }
}
