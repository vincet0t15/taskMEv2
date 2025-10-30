<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskAttachment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'task_id',
        'extension_name',
        'path',
        'file_size',
        'original_name'
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
