<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Status;
use App\Models\Task;
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
                                ->with(['assignees' => function ($q) {
                                    $q->where('users.id', Auth::id());
                                }, 'priority', 'status']);
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

        $task->update(['status_id' => $status->id]);

        return redirect()->back()->withSuccess('Task updated successfully');
    }
}
