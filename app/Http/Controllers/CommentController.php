<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function comment(Request $request)
    {

        Comment::create([
            'comment' => $request->comment,
            'task_id' => $request->task_id,
        ]);

        return redirect()->back()->with('success', 'Comment created successfully.');
    }
}
