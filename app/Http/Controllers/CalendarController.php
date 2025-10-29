<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
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
            'tasks' => $tasks
        ]);
    }

    public function moveData(Request $request, Task $task)
    {

        $task->update(['due_date' => $request->due_date]);

        return redirect()->back()->withSuccess('Task updated successfully');
    }
}
