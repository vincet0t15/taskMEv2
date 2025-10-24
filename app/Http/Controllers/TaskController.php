<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest\TaskStoreRequest;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(TaskStoreRequest $request)
    {

        $task =    Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'priority_id' => $request->priority_id,
            'status_id' => $request->status_id,
            'project_id' => $request->project_id,
            'due_date' => $request->due_date,
        ]);

        if ($request->assignees) {
            $task->assignees()->attach($request->assignees);
        }

        return redirect()->back()->with('success', 'Task created successfully.');
    }
}
