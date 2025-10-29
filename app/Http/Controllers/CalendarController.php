<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function show(Project $project)
    {
        $project->load(['priority', 'status', 'user']);

        return Inertia::render('projects/calendar', [
            'projects' => $project
        ]);
    }
}
