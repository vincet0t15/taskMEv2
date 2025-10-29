<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest\TaskStoreRequest;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function store(TaskStoreRequest $request)
    {

        $task = Task::create([
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

        // Create subtasks
        if ($request->subTasks) {
            foreach ($request->subTasks as $subTaskData) {
                $subTask = $task->subTasks()->create([
                    'title' => $subTaskData['title'],
                    'description' => $subTaskData['description'],
                    'priority_id' => $subTaskData['priority_id'],
                    'status_id' => $subTaskData['status_id'],
                    'due_date' => $subTaskData['due_date'],
                ]);

                if (!empty($subTaskData['assignees'])) {
                    $subTask->assignees()->attach($subTaskData['assignees']);
                }
            }
        }

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function create(Project $project)
    {
        return Inertia::render('tasks/createTask', [
            'project' => $project,
        ]);
    }

    public function show(Project $project, Task $task)
    {

        $task->load([
            'priority',
            'status',
            'assignees',
            'subTasks.priority',
            'subTasks.status',
            'subTasks.assignees'
        ]);

        return Inertia::render('tasks/showTask', [
            'task' => $task,
            'project' => $project
        ]);
    }
}
