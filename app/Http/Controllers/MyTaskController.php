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
                        'assignees' => function ($q) {
                            $q->where('users.id', Auth::id());
                        },
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
}
