<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Status;
use App\Models\Task;
use App\Models\TaskActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyTaskController extends Controller
{
    public function index()
    {

        $tasks = Status::with([
            'tasks' => function ($taskQuery) {
                $taskQuery
                    ->where(function ($query) {
                        $query->whereHas('assignees', function ($assigneeQuery) {
                            $assigneeQuery->where('users.id', Auth::id());
                        })
                            ->orWhereHas('subTasks.assignees', function ($subAssigneeQuery) {
                                $subAssigneeQuery->where('users.id', Auth::id());
                            });
                    })
                    ->withCount([
                        // ✅ Count completed subtasks assigned to current user
                        'subTasks as completed_subtasks_count' => function ($query) {
                            $query->whereHas('status', function ($q) {
                                $q->where('name', 'Completed');
                            })
                                ->whereHas('assignees', function ($assigneeQuery) {
                                    $assigneeQuery->where('users.id', Auth::id());
                                });
                        },
                        // ✅ Count all subtasks assigned to current user
                        'subTasks as total_subtasks_count' => function ($query) {
                            $query->whereHas('assignees', function ($assigneeQuery) {
                                $assigneeQuery->where('users.id', Auth::id());
                            });
                        },
                    ])
                    ->with([
                        'project',
                        'status',
                        'priority',
                        'attachments',
                        'comments',
                        'assignees',
                        'subTasks' => function ($subTaskQuery) {
                            $subTaskQuery
                                ->whereHas('assignees', function ($q) {
                                    $q->where('users.id', Auth::id());
                                })
                                ->with(['assignees', 'priority', 'status']);
                        },
                    ]);
            },
        ])
            ->whereHas('tasks', function ($taskQuery) {
                $taskQuery
                    ->whereHas('assignees', function ($assigneeQuery) {
                        $assigneeQuery->where('users.id', Auth::id());
                    })
                    ->orWhereHas('subTasks.assignees', function ($subAssigneeQuery) {
                        $subAssigneeQuery->where('users.id', Auth::id());
                    });
            })
            ->get();

        return Inertia::render('myTask/index', [
            'tasks' => $tasks
        ]);
    }

    public function show(Task $task)
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
                }
            ])
            ->findOrFail($task->id);

        return Inertia::render('myTask/viewTask', [
            'tasks' => $task
        ]);
    }

    public function updateTaskStatus(Task $task, Status $status)
    {


        // Store old values for activity logging
        $oldValues = [
            'status_id' => $task->status_id,
        ];

        // Validate: If task status is being set to completed (4), check that all subtasks are also completed
        if ($status->id == 4) {
            $incompleteSubTasks = $task->subTasks()->where('status_id', '!=', 4)->count();
            if ($incompleteSubTasks > 0) {
                return redirect()->back()->withErrors([
                    'Cannot mark task as completed while there are incomplete subtasks. Please complete all subtasks first.'
                ]);
            }
        }

        $task->update(['status_id' => $status->id]);

        // Log task status update activity
        $newValues = [
            'status_id' => $task->status_id,
        ];

        TaskActivity::logActivity(
            $task->id,
            Auth::id(),
            'status_changed',
            "Task status changed to: {$status->name}",
            $oldValues,
            $newValues
        );

        return redirect()->back()->withSuccess('Task updated successfully');
    }
}
