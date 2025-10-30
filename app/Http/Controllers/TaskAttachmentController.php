<?php

namespace App\Http\Controllers;

use App\Models\TaskAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskAttachmentController extends Controller
{
    public function download($fileId)
    {
        $attachment = TaskAttachment::find($fileId);

        $path = Storage::disk('public')->path($attachment->path);

        if (!file_exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->download($path, $attachment->original_name);
    }
}
