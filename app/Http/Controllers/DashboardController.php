<?php

namespace App\Http\Controllers;

use App\Models\Priority;
use App\Models\Project;
use App\Models\Status;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $totalProjects = Project::count();
        $totalTasks = Task::count();
        $totalUsers = User::count();

        // Additional metrics
        $overdueTasks = Task::where('due_date', '<', now())->whereHas('status', function ($query) {
            $query->where('name', '!=', 'Completed');
        })->count();

        $tasksDueToday = Task::whereDate('due_date', today())->count();
        $tasksDueThisWeek = Task::whereBetween('due_date', [now(), now()->endOfWeek()])->count();

        $completedTasksThisMonth = Task::whereHas('status', function ($query) {
            $query->where('name', 'Completed');
        })->whereMonth('updated_at', now()->month)->count();

        $activeProjects = Project::whereHas('tasks')->count();

        $tasksByStatus = Status::withCount('tasks')->get();
        $tasksByPriority = Priority::withCount('tasks')->get();
        $recentProjects = Project::withCount('tasks')->latest()->take(5)->get();

        // Recent tasks
        $recentTasks = Task::with(['project', 'status', 'priority'])
            ->latest()
            ->take(5)
            ->get();

        // Upcoming deadlines
        $upcomingDeadlines = Task::with(['project', 'status', 'priority'])
            ->where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDays(7))
            ->orderBy('due_date')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'totalProjects' => $totalProjects,
            'totalTasks' => $totalTasks,
            'totalUsers' => $totalUsers,
            'overdueTasks' => $overdueTasks,
            'tasksDueToday' => $tasksDueToday,
            'tasksDueThisWeek' => $tasksDueThisWeek,
            'completedTasksThisMonth' => $completedTasksThisMonth,
            'activeProjects' => $activeProjects,
            'tasksByStatus' => $tasksByStatus,
            'tasksByPriority' => $tasksByPriority,
            'recentProjects' => $recentProjects,
            'recentTasks' => $recentTasks,
            'upcomingDeadlines' => $upcomingDeadlines,
        ]);
    }
}
