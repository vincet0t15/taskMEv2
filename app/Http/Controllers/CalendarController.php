<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['assignees', 'priority', 'status', 'subTasks' => function ($subQuery) {
            $subQuery->with('assignees', 'priority', 'status');
        },])
            ->get();

        return Inertia::render('Calendar/index', [
            'task' => $tasks
        ]);
    }

    public function view(Task $task)
    {
        $task = Task::withCount([
            'subTasks as completed_subtasks_count' => function ($query) {
                $query->whereHas('status', function ($q) {
                    $q->where('name', 'Completed');
                });
            },
            'subTasks as total_subtasks_count'
        ])
            ->with([
                'priority',
                'status',
                'assignees',
                'subTasks.priority',
                'subTasks.status',
                'subTasks.assignees',
                'attachments',
                'comments' => function ($query) {
                    $query->with('user');
                },
                'activities' => function ($query) {
                    $query->with('user')->orderBy('created_at', 'desc');
                }
            ])
            ->findOrFail($task->id);

        return Inertia::render('Calendar/viewTask', [
            'tasks' => $task,

        ]);
    }

    public function show(Project $project)
    {
        $project->load(['priority', 'status', 'user']);

        $tasks = Task::with(['assignees', 'priority', 'status', 'subTasks' => function ($subQuery) {
            $subQuery->with('assignees', 'priority', 'status');
        },])
            ->where('project_id', $project->id)
            ->get();

        return Inertia::render('projects/calendar', [
            'projects' => $project,
            'task' => $tasks
        ]);
    }

    public function moveData(Request $request, Task $task)
    {

        $task->update(['due_date' => $request->due_date]);

        return redirect()->back()->withSuccess('Task updated successfully');
    }
}
