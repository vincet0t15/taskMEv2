<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class StatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'To Do',       'color' => '#3b82f6'], // Blue
            ['name' => 'In Progress', 'color' => '#f59e0b'], // Amber
            ['name' => 'In Review',   'color' => '#8b5cf6'], // Purple
            ['name' => 'Completed',   'color' => '#10b981'], // Green
            ['name' => 'Archived',    'color' => '#6b7280'], // Gray
        ];


        DB::table('statuses')->insert($statuses);
    }
}
