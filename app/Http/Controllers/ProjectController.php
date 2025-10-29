<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest\ProjectStoreRequest;
use App\Models\Project;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function getMyProjects(Request $request)
    {
        return Project::where('user_id', Auth::user()->id)->get();
    }

    public function store(ProjectStoreRequest $request)
    {
        Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'priority_id' => $request->priority_id,
            'status_id' => $request->status_id,
        ]);

        return redirect()->back()->with('success', 'Project created successfully.');
    }



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


        return inertia('projects/show', [
            'projects' => $project,
            'statusWithTasks' => $statusWithTasks
        ]);
    }
}
