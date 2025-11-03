'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ClipboardList, FolderKanban, Users } from 'lucide-react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Status {
    id: number;
    name: string;
    color: string;
    tasks_count: number;
}

interface Priority {
    id: number;
    name: string;
    color: string;
    tasks_count: number;
}

interface Project {
    id: number;
    name: string;
    tasks_count: number;
}

interface Task {
    id: number;
    title: string;
    due_date: string;
    project: Project;
    status: Status;
    priority: Priority;
}

interface DashboardProps {
    totalProjects: number;
    totalTasks: number;
    totalUsers: number;
    overdueTasks: number;
    tasksDueToday: number;
    tasksDueThisWeek: number;
    completedTasksThisMonth: number;
    activeProjects: number;
    tasksByStatus: Status[];
    tasksByPriority: Priority[];
    recentProjects: Project[];
    recentTasks: Task[];
    upcomingDeadlines: Task[];
}

const iconMap: Record<string, React.JSX.Element> = {
    'Total Projects': <FolderKanban className="h-5 w-5 text-blue-500" />,
    'Total Tasks': <ClipboardList className="h-5 w-5 text-amber-500" />,
    'Total Users': <Users className="h-5 w-5 text-green-500" />,
    'Active Projects': <FolderKanban className="h-5 w-5 text-green-500" />,
    'Overdue Tasks': <ClipboardList className="h-5 w-5 text-red-500" />,
    'Tasks Due Today': <ClipboardList className="h-5 w-5 text-orange-500" />,
    'Tasks Due This Week': (
        <ClipboardList className="h-5 w-5 text-yellow-500" />
    ),
    'Completed This Month': (
        <ClipboardList className="h-5 w-5 text-purple-500" />
    ),
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <Card className="border border-gray-200/50 bg-gradient-to-b from-white to-gray-50 shadow-sm dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {title}
                </CardTitle>
                {iconMap[title]}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {value}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const TasksByStatusChart = ({ data }: { data: Status[] }) => (
    <Card className="shadow-sm dark:border-gray-700">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Tasks by Status
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="tasks_count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        paddingAngle={4}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

const TasksByPriorityChart = ({ data }: { data: Priority[] }) => (
    <Card className="shadow-sm dark:border-gray-700">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Tasks by Priority
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="tasks_count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        paddingAngle={4}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

const RecentProjects = ({ data }: { data: Project[] }) => (
    <Card className="shadow-sm dark:border-gray-700">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Recent Projects
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.length > 0 ? (
                    data.map((project) => (
                        <li
                            key={project.id}
                            className="rounded-md py-3 transition-all hover:bg-muted/10 sm:py-4"
                        >
                            <div className="flex items-center justify-between">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    {project.name}
                                </p>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {project.tasks_count} tasks
                                </span>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                        No recent projects found.
                    </p>
                )}
            </ul>
        </CardContent>
    </Card>
);

const RecentTasks = ({ data }: { data: Task[] }) => (
    <Card className="shadow-sm dark:border-gray-700">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Recent Tasks
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.length > 0 ? (
                    data.map((task) => (
                        <li
                            key={task.id}
                            className="rounded-md py-3 transition-all hover:bg-muted/10 sm:py-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {task.project?.name || 'No project'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="inline-block h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                task.priority?.color || '#gray',
                                        }}
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {task.status?.name || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                        No recent tasks found.
                    </p>
                )}
            </ul>
        </CardContent>
    </Card>
);

const UpcomingDeadlines = ({ data }: { data: Task[] }) => (
    <Card className="shadow-sm dark:border-gray-700">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Upcoming Deadlines
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.length > 0 ? (
                    data.map((task) => (
                        <li
                            key={task.id}
                            className="rounded-md py-3 transition-all hover:bg-muted/10 sm:py-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {task.project?.name || 'No project'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {new Date(
                                            task.due_date,
                                        ).toLocaleDateString()}
                                    </p>
                                    <span
                                        className="inline-block h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                task.priority?.color || '#gray',
                                        }}
                                    />
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                        No upcoming deadlines.
                    </p>
                )}
            </ul>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const {
        totalProjects,
        totalTasks,
        totalUsers,
        overdueTasks,
        tasksDueToday,
        tasksDueThisWeek,
        completedTasksThisMonth,
        activeProjects,
        tasksByStatus,
        tasksByPriority,
        recentProjects,
        recentTasks,
        upcomingDeadlines,
    } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Top Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Projects" value={totalProjects} />
                    <StatCard title="Active Projects" value={activeProjects} />
                    <StatCard title="Total Tasks" value={totalTasks} />
                    <StatCard title="Total Users" value={totalUsers} />
                </div>

                {/* Secondary Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Overdue Tasks" value={overdueTasks} />
                    <StatCard title="Tasks Due Today" value={tasksDueToday} />
                    <StatCard
                        title="Tasks Due This Week"
                        value={tasksDueThisWeek}
                    />
                    <StatCard
                        title="Completed This Month"
                        value={completedTasksThisMonth}
                    />
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    <TasksByStatusChart data={tasksByStatus} />
                    <TasksByPriorityChart data={tasksByPriority} />
                </div>

                {/* Lists */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <RecentTasks data={recentTasks} />
                    <UpcomingDeadlines data={upcomingDeadlines} />
                    <RecentProjects data={recentProjects} />
                </div>
            </div>
        </AppLayout>
    );
}
