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
        return Project::where('user_id', Auth::user()->id)
            ->whereHas('status', function ($query) {
                $query->where('name', '!=', 'Archived');
            })
            ->get();
    }

    public function getMyArchivedProjects(Request $request)
    {
        return Project::where('user_id', Auth::user()->id)
            ->whereHas('status', function ($query) {
                $query->where('name', 'Archived');
            })
            ->get();
    }

    public function update(Request $request, Project $project)
    {
        // Ensure user owns the project
        if ($project->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status_id' => 'sometimes|exists:statuses,id',
        ]);

        $updateData = [];

        if ($request->has('name')) {
            $updateData['name'] = $request->name;
        }

        if ($request->has('description')) {
            $updateData['description'] = $request->description;
        }

        if ($request->has('status_id')) {
            $updateData['status_id'] = $request->status_id;
        }

        $project->update($updateData);

        return redirect()->back()->with('success', 'Project updated successfully.');
    }

    public function archived()
    {
        $archivedProjects = $this->getMyArchivedProjects(request());

        return inertia('projects/archived', [
            'archivedProjects' => $archivedProjects,
        ]);
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

        $statusWithTasks = Status::whereNotIn('id', [5])
            ->with([
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

    public function edit(Project $project)
    {
        // Ensure user owns the project
        if ($project->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized');
        }

        $project->load(['priority', 'status', 'user']);

        return inertia('projects/settings', [
            'projects' => $project
        ]);
    }

    public function destroy(Project $project)
    {
        // Ensure user owns the project
        if ($project->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized');
        }

        $project->delete();

        return redirect()->route('dashboard')->with('success', 'Project deleted successfully.');
    }
}
