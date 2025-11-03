<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskActivity extends Model
{
    protected $fillable = [
        'task_id',
        'user_id',
        'action',
        'description',
        'old_value',
        'new_value',
    ];

    protected $casts = [
        'old_value' => 'array',
        'new_value' => 'array',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Log a task activity
     */
    public static function logActivity(
        int $taskId,
        int $userId,
        string $action,
        string $description,
        ?array $oldValue = null,
        ?array $newValue = null
    ): self {
        return self::create([
            'task_id' => $taskId,
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'old_value' => $oldValue,
            'new_value' => $newValue,
        ]);
    }
}
