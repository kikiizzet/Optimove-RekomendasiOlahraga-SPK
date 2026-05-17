<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@optimove.test',
        ]);

        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load(base_path("BD20-1-Fitness-Dataset.xlsx"));
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();
        
        // Skip header
        array_shift($rows);

        foreach ($rows as $row) {
            if (empty($row[1])) continue;
            
            \App\Models\FitnessDataset::create([
                'name' => $row[1] ?? 'Unknown',
                'gender' => $row[2] ?? 'Unknown',
                'age_group' => $row[3] ?? 'Unknown',
                'fitness_level' => $row[4] ?? 'Unknown',
                'exercise_frequency' => $row[5] ?? 'Unknown',
                'diet' => $row[7] ?? 'Unknown',
                'sports_participated' => $row[9] ?? 'Unknown',
            ]);
        }
    }
}
