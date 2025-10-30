<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Comment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'task_id',
        'user_id',
        'comment',
        'date_created',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($comment) {
            if (Auth::check()) {
                $comment->user_id = Auth::id();
                $comment->date_created = Carbon::now('singapore')->toDateTimeString();
            }
        });
    }
}
