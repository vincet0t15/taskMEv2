<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubTaskAssignee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'sub_task_id',
        'user_id',
    ];

    public function subTask()
    {
        return $this->belongsTo(SubTask::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
