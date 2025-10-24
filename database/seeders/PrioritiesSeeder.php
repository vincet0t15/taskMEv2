<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PrioritiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $priorities = [
            ['name' => 'Low',      'color' => '#3b82f6'], // Blue
            ['name' => 'Medium',   'color' => '#f59e0b'], // Amber
            ['name' => 'High',     'color' => '#ef4444'], // Red
            ['name' => 'Critical', 'color' => '#dc2626'], // Darker Red
        ];

        DB::table('priorities')->insert($priorities);
    }
}
