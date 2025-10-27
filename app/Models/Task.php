<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'project_id',
        'status_id',
        'priority_id',
        'due_date'
    ];


    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function priority()
    {
        return $this->belongsTo(Priority::class);
    }

    public function assignees()
    {
        return $this->belongsToMany(User::class, 'task_assignees');
    }

    public function subTasks()
    {
        return $this->hasMany(SubTask::class, 'task_id');
    }
}
