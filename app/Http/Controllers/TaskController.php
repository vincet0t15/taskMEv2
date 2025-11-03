<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest\TaskStoreRequest;
use App\Models\Attachment;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskActivity;
use App\Models\TaskAttachment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function store(Request $request)
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

        if ($request->hasFile('attachment')) {

            foreach ($request->file('attachment') as $file) {
                $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

                $size = $file->getSize();
                for ($i = 0; $size > 1024; $i++) {
                    $size /= 1024;
                }

                $filePath = $file->store('attachment', 'public');
                $original_name = $file->getClientOriginalName();
                $fileName = time() . '.' . $file->getClientOriginalName();
                $fileName = preg_replace('/[\[{\(].*?[\]}\)]/', '', $fileName);
                $extension_name = pathinfo($original_name, PATHINFO_EXTENSION);

                $attachment = new TaskAttachment();
                $attachment->task_id = $task->id;
                $attachment->original_name = $original_name;
                $attachment->path = $filePath;
                $attachment->extension_name = $extension_name;
                $attachment->date_created = Carbon::now('singapore')->toDateTimeString();
                $attachment->file_size = round($size, 2) . ' ' . $units[$i];
                $attachment->save();
            }
        }

        // Log task creation activity
        TaskActivity::logActivity(
            $task->id,
            $request->user()->id,
            'created',
            'Task created',
            null,
            [
                'title' => $task->title,
                'description' => $task->description,
                'project_id' => $task->project_id,
                'status_id' => $task->status_id,
                'priority_id' => $task->priority_id,
                'due_date' => $task->due_date,
            ]
        );

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
            'subTasks.assignees',
            'attachments',
            'comments'
        ]);

        return Inertia::render('tasks/showTask', [
            'tasks' => $task,
            'project' => $project
        ]);
    }

    public function view(Project $project, Task $task)
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
                },
                'activities' => function ($query) {
                    $query->with('user')->orderBy('created_at', 'desc');
                }
            ])
            ->findOrFail($task->id);

        return Inertia::render('tasks/TaskDetails', [
            'tasks' => $task,
            'project' => $project
        ]);
    }

    public function updateTask(Request $request, Task $task)
    {
        // Store old values for activity logging
        $oldValues = [
            'title' => $task->title,
            'description' => $task->description,
            'project_id' => $task->project_id,
            'status_id' => $task->status_id,
            'priority_id' => $task->priority_id,
            'due_date' => $task->due_date,
        ];

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'project_id' => $request->project_id,
            'status_id' => $request->status_id,
            'priority_id' => $request->priority_id,
            'due_date' => $request->due_date,
        ]);

        //  Sync main task assignees
        if ($request->has('assignees')) {
            $task->assignees()->sync($request->assignees);
        }

        //  Handle subtasks (create or update)
        if ($request->has('subTasks')) {
            $subTaskIds = []; // Keep track of updated/created subtask IDs

            foreach ($request->subTasks as $subTaskData) {
                // Check if subtask has an ID (means existing)
                if (!empty($subTaskData['id'])) {
                    $subTask = $task->subTasks()->find($subTaskData['id']);
                    if ($subTask) {
                        $subTask->update([
                            'title' => $subTaskData['title'],
                            'description' => $subTaskData['description'],
                            'priority_id' => $subTaskData['priority_id'],
                            'status_id' => $subTaskData['status_id'],
                            'due_date' => $subTaskData['due_date'],
                        ]);
                    }
                } else {
                    // Create a new subtask
                    $subTask = $task->subTasks()->create([
                        'title' => $subTaskData['title'],
                        'description' => $subTaskData['description'],
                        'priority_id' => $subTaskData['priority_id'],
                        'status_id' => $subTaskData['status_id'],
                        'due_date' => $subTaskData['due_date'],
                    ]);
                }

                // Sync subtask assignees (if any)
                if (!empty($subTaskData['assignees'])) {
                    $subTask->assignees()->sync($subTaskData['assignees']);
                }

                // Add ID to list
                $subTaskIds[] = $subTask->id;
            }

            //  Optionally: delete removed subtasks
            $task->subTasks()
                ->whereNotIn('id', $subTaskIds)
                ->delete();
        }

        // Handle new attachments
        if ($request->hasFile('attachment')) {
            foreach ($request->file('attachment') as $file) {
                $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

                $size = $file->getSize();
                for ($i = 0; $size > 1024; $i++) {
                    $size /= 1024;
                }

                $filePath = $file->store('attachment', 'public');
                $original_name = $file->getClientOriginalName();
                $extension_name = pathinfo($original_name, PATHINFO_EXTENSION);

                $attachment = new TaskAttachment();
                $attachment->task_id = $task->id;
                $attachment->original_name = $original_name;
                $attachment->path = $filePath;
                $attachment->extension_name = $extension_name;
                $attachment->date_created = Carbon::now('singapore')->toDateTimeString();
                $attachment->file_size = round($size, 2) . ' ' . $units[$i];
                $attachment->save();
            }
        }

        // Handle attachment deletion
        if ($request->has('deleted_attachments')) {
            TaskAttachment::whereIn('id', $request->deleted_attachments)->delete();
        }

        // Log task update activity
        $newValues = [
            'title' => $task->title,
            'description' => $task->description,
            'project_id' => $task->project_id,
            'status_id' => $task->status_id,
            'priority_id' => $task->priority_id,
            'due_date' => $task->due_date,
        ];

        TaskActivity::logActivity(
            $task->id,
            $request->user()->id,
            'updated',
            'Task updated',
            $oldValues,
            $newValues
        );

        return redirect()->back()->with('success', 'Task updated successfully.');
    }
}
