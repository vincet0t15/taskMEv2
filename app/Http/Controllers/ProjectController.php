<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest\ProjectStoreRequest;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
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

    public function getMyProjects(Request $request)
    {
        return Project::where('user_id', $request->user()->id)->get();
    }
}
