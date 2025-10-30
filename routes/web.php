<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\MyTaskController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SubTaskController;
use App\Http\Controllers\TaskController;
use App\Models\TaskAttachment;
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
    Route::get('projects/{project}/create-task', [TaskController::class, 'create'])->name('create.task');
    Route::get('projects/{project}/tasks/{task}', [TaskController::class, 'show'])->name('show.task');
    Route::put('tasks/{task}', [TaskController::class, 'updateTask'])->name('update.task');
    Route::get('projects/{project}/tasks-view/{task}', [TaskController::class, 'view'])->name('view.tasks');

    // BOARD
    Route::get('projects/{project}/board', [BoardController::class, 'show'])->name('show.board');

    // SUBTASKS
    Route::put('subtasks/{subTask}', [SubTaskController::class, 'updateSubTask'])->name('update.subtask');
    Route::post('subtasks', [SubTaskController::class, 'store'])->name('store.subtask');
    Route::delete('subtasks/{subTask}', [SubTaskController::class, 'destroySubTask'])->name('destroy.subtask');

    // CALENDAR
    Route::get('projects/{project}/calendar', [CalendarController::class, 'show'])->name('show.calendar');
    Route::put('calendar/{task}', [CalendarController::class, 'moveData'])->name('calendar.move');

    // ATTACHMENTS
    Route::get('download/{id}', [TaskAttachment::class, 'download'])->name('file.download');

    // COMMENTS
    Route::post('comments', [CommentController::class, 'comment'])->name('comment.task');
    Route::put('comments/{comment}', [CommentController::class, 'updateComment'])->name('update.comments');
    Route::delete('comments/{comment}', [CommentController::class, 'destroyComment'])->name('destroy.comments');


    // MY TASKS
    Route::get('mytasks', [MyTaskController::class, 'index'])->name('myTask.index');
});

require __DIR__ . '/settings.php';
