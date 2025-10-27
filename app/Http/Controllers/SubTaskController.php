<?php

namespace App\Http\Controllers;

use App\Models\SubTask;
use Illuminate\Http\Request;

class SubTaskController extends Controller
{
    public function updateSubTask(Request $request, SubTask $subTask)
    {
        $subTask->update([
            'title' => $request->title,
            'description' => $request->description,
            'priority_id' => $request->priority_id,
            'status_id' => $request->status_id,
            'due_date' => $request->due_date,
        ]);

        if ($request->assignees) {
            $subTask->assignees()->sync($request->assignees);
        } else {
            $subTask->assignees()->detach();
        }

        $subTask->save();

        return redirect()->back()->with('success', 'Subtask updated successfully.');
    }

    public function store(Request $request)
    {
        $subTask = SubTask::create([
            'task_id' => $request->task_id,
            'title' => $request->title,
            'description' => $request->description,
            'priority_id' => $request->priority_id,
            'status_id' => $request->status_id,
            'due_date' => $request->due_date,
        ]);

        if ($request->assignees) {
            $subTask->assignees()->sync($request->assignees);
        }

        return redirect()->back()->with('success', 'Subtask created successfully.');
    }
}
