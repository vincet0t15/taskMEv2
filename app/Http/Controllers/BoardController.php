<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Status;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function show(Project $project)
    {
        $project->load(['priority', 'status', 'user']);

        $statusWithTasks = Status::with([
            'tasks' => function ($query) use ($project) {
                $query->where('project_id', $project->id)
                    ->with([
                        'priority',
                        'status',
                        'assignees',
                        'subTasks' => function ($subQuery) {
                            $subQuery->with('assignees', 'priority', 'status');
                        },
                        'attachments'
                    ])
                    ->withCount([
                        'subTasks as completed_subtasks_count' => function ($subQuery) {
                            $subQuery->where('status_id', 4);
                        },
                        'subTasks as total_subtasks_count'
                    ]);
            },
        ])->get();


        return inertia('projects/board', [
            'projects' => $project,
            'statusWithTasks' => $statusWithTasks
        ]);
    }
}
