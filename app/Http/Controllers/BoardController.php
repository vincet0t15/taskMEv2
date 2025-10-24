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
                    ->with(['priority', 'status', 'assignees']);
            }
        ])->get();

        return inertia('projects/board', [
            'projects' => $project,
            'statusWithTasks' => $statusWithTasks
        ]);
    }
}
