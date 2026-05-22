<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FitnessDataset;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DatasetManagementController extends Controller
{
    /**
     * Show dataset management page
     */
    public function index()
    {
        $datasets = FitnessDataset::paginate(25);
        
        $stats = [
            'total' => FitnessDataset::count(),
            'by_gender' => FitnessDataset::selectRaw('gender, count(*) as count')
                ->groupBy('gender')
                ->pluck('count', 'gender'),
            'by_age' => FitnessDataset::selectRaw('age_group, count(*) as count')
                ->groupBy('age_group')
                ->get(),
            'by_fitness' => FitnessDataset::selectRaw('fitness_level, count(*) as count')
                ->groupBy('fitness_level')
                ->get(),
        ];

        return Inertia::render('Admin/DatasetManagement', [
            'datasets' => $datasets,
            'stats' => $stats,
        ]);
    }

    /**
     * Create new dataset entry
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'gender' => 'required|in:Male,Female',
            'age_group' => 'required|in:15 to 18,19 to 25,26 to 30,31 to 40,40 and above',
            'fitness_level' => 'required|in:Unfit,Average,Good,Very good,Excellent',
            'exercise_frequency' => 'required|in:Never,1 to 2 times a week,3 to 4 times a week,Everyday',
            'diet' => 'required|in:No,Not always,Yes',
            'sports_participated' => 'required|string',
        ]);

        FitnessDataset::create($validated);

        return back()->with('success', 'Dataset berhasil ditambahkan');
    }

    /**
     * Update dataset entry
     */
    public function update(Request $request, FitnessDataset $dataset)
    {
        $validated = $request->validate([
            'gender' => 'required|in:Male,Female',
            'age_group' => 'required|in:15 to 18,19 to 25,26 to 30,31 to 40,40 and above',
            'fitness_level' => 'required|in:Unfit,Average,Good,Very good,Excellent',
            'exercise_frequency' => 'required|in:Never,1 to 2 times a week,3 to 4 times a week,Everyday',
            'diet' => 'required|in:No,Not always,Yes',
            'sports_participated' => 'required|string',
        ]);

        $dataset->update($validated);

        return back()->with('success', 'Dataset berhasil diperbarui');
    }

    /**
     * Delete dataset entry
     */
    public function destroy(FitnessDataset $dataset)
    {
        $dataset->delete();
        return back()->with('success', 'Dataset berhasil dihapus');
    }

    /**
     * Bulk import datasets from CSV
     */
    public function bulkImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        
        $imported = 0;
        $skipped = 0;
        $errors = [];

        // Skip header
        fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            try {
                $data = [
                    'gender' => trim($row[0] ?? ''),
                    'age_group' => trim($row[1] ?? ''),
                    'fitness_level' => trim($row[2] ?? ''),
                    'exercise_frequency' => trim($row[3] ?? ''),
                    'diet' => trim($row[4] ?? ''),
                    'sports_participated' => trim($row[5] ?? ''),
                ];

                // Validate before insert
                if (!$data['gender'] || !$data['age_group'] || !$data['fitness_level']) {
                    $skipped++;
                    continue;
                }

                FitnessDataset::create($data);
                $imported++;
            } catch (\Exception $e) {
                $skipped++;
                $errors[] = "Row error: " . $e->getMessage();
            }
        }

        fclose($handle);

        return back()->with('success', "Berhasil mengimport $imported data, $skipped baris dilewati");
    }

    /**
     * Export datasets to CSV
     */
    public function export()
    {
        $datasets = FitnessDataset::all();

        $filename = "datasets_" . date('Y-m-d_His') . ".csv";
        
        $handle = fopen('php://output', 'w');
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');

        // Write header
        fputcsv($handle, [
            'Gender',
            'Age Group',
            'Fitness Level',
            'Exercise Frequency',
            'Diet',
            'Sports Participated',
            'Created At',
        ]);

        // Write data
        foreach ($datasets as $dataset) {
            fputcsv($handle, [
                $dataset->gender,
                $dataset->age_group,
                $dataset->fitness_level,
                $dataset->exercise_frequency,
                $dataset->diet,
                $dataset->sports_participated,
                $dataset->created_at,
            ]);
        }

        fclose($handle);
        exit;
    }
}
