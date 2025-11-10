<?php

namespace App\Http\Controllers;

use App\Models\SubTask;
use App\Models\TaskActivity;
use Illuminate\Http\Request;

class SubTaskController extends Controller
{
    public function updateSubTask(Request $request, SubTask $subTask)
    {

        // Store old values for activity logging
        $oldSubTaskValues = [
            'title' => $subTask->title,
            'description' => $subTask->description,
            'priority_id' => $subTask->priority_id,
            'status_id' => $subTask->status_id,
            'due_date' => $subTask->due_date,
        ];

        $subTask->update([
            'title' => $request->title,
            'description' => $request->description,
            'priority_id' => $request->priority_id,
            'status_id' => $request->status_id,
            'due_date' => $request->due_date,
        ]);

        // Validate: If subtask status is being set to completed (4), check that parent task is also completed
        // if ($request->status_id == 4) {
        //     $parentTask = $subTask->task; // Assuming you have the relationship
        //     if ($parentTask && $parentTask->status_id != 4) {
        //         return redirect()->back()->withErrors([
        //             'status_id' => 'Cannot mark subtask as completed while the parent task is not completed.'
        //         ]);
        //     }
        // }

        if ($request->assignees) {
            $subTask->assignees()->sync($request->assignees);
        } else {
            $subTask->assignees()->detach();
        }

        $subTask->save();

        // Log subtask update activity
        $newSubTaskValues = [
            'title' => $subTask->title,
            'description' => $subTask->description,
            'priority_id' => $subTask->priority_id,
            'status_id' => $subTask->status_id,
            'due_date' => $subTask->due_date,
        ];

        TaskActivity::logActivity(
            $subTask->task_id,
            $request->user()->id,
            'subtask_updated',
            "Updated subtask: {$subTask->title}",
            ['subtask' => $oldSubTaskValues],
            ['subtask' => $newSubTaskValues]
        );

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

        // Log subtask creation activity
        TaskActivity::logActivity(
            $subTask->task_id,
            $request->user()->id,
            'subtask_created',
            "Created subtask: {$subTask->title}",
            null,
            [
                'subtask' => [
                    'title' => $subTask->title,
                    'description' => $subTask->description,
                    'priority_id' => $subTask->priority_id,
                    'status_id' => $subTask->status_id,
                    'due_date' => $subTask->due_date,
                ]
            ]
        );

        return redirect()->back()->with('success', 'Subtask created successfully.');
    }

    public function destroySubTask(SubTask $subTask)
    {
        // Store subtask data before deletion for activity logging
        $deletedSubTaskData = [
            'title' => $subTask->title,
            'description' => $subTask->description,
            'priority_id' => $subTask->priority_id,
            'status_id' => $subTask->status_id,
            'due_date' => $subTask->due_date,
        ];

        $taskId = $subTask->task_id;

        $subTask->delete();

        // Log subtask deletion activity
        TaskActivity::logActivity(
            $taskId,
            request()->user()->id,
            'subtask_deleted',
            "Deleted subtask: {$deletedSubTaskData['title']}",
            [
                'subtask' => $deletedSubTaskData
            ],
            null
        );

        return redirect()->back()->with('success', 'Subtask deleted successfully.');
    }
}
