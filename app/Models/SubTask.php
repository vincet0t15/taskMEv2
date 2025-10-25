<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubTask extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'task_id',
        'status_id',
        'priority_id',
        'due_date',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
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
        return $this->belongsToMany(User::class, 'sub_task_assignees');
    }
}
