<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Models\Project;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // PROJECTS
    Route::post('projects', [ProjectController::class, 'store'])->name('store.project');
    Route::get('projects/{project}/list', [ProjectController::class, 'show'])->name('show.project');

    // TASKS
    Route::post('tasks', [TaskController::class, 'store'])->name('store.task');
});

require __DIR__ . '/settings.php';
