'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
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
interface PageProps {
    [key: string]: any;
}
// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];
// --- Interfaces ---
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
interface DashboardProps extends PageProps {
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

// --- Icons Map ---
const iconMap: Record<string, React.JSX.Element> = {
    'Total Projects': <FolderKanban className="h-4 w-4 text-blue-500" />,
    'Active Projects': <FolderKanban className="h-4 w-4 text-green-500" />,
    'Total Tasks': <ClipboardList className="h-4 w-4 text-amber-500" />,
    'Total Users': <Users className="h-4 w-4 text-indigo-500" />,
    'Overdue Tasks': <ClipboardList className="h-4 w-4 text-red-500" />,
    'Tasks Due Today': <ClipboardList className="h-4 w-4 text-orange-500" />,
    'Tasks Due This Week': (
        <ClipboardList className="h-4 w-4 text-yellow-500" />
    ),
    'Completed This Month': (
        <ClipboardList className="h-4 w-4 text-purple-500" />
    ),
};

// --- Components ---
const StatCard = ({ title, value }: { title: string; value: number }) => (
    <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
        <Card className="border border-gray-100 bg-white/90 shadow-md transition-all duration-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {title}
                </CardTitle>
                {iconMap[title]}
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {value.toLocaleString()}
                </p>
            </CardContent>
        </Card>
    </motion.div>
);

const ChartCard = ({
    title,
    data,
    dataKey,
}: {
    title: string;
    data: Status[] | Priority[];
    dataKey: string;
}) => (
    <Card className="shadow-md dark:border-gray-700">
        <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey={dataKey}
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        innerRadius={45}
                        paddingAngle={3}
                        labelLine={false}
                        label={({ name, percent }) =>
                            percent > 0
                                ? `${name} ${(percent * 100).toFixed(0)}%`
                                : ''
                        }
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>

                    <Tooltip
                        contentStyle={{
                            borderRadius: 8,
                            backgroundColor: '#fff',
                            border: 'none',
                            fontSize: '12px',
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

const ListCard = ({
    title,
    data,
    type,
}: {
    title: string;
    data: any[];
    type: 'tasks' | 'projects' | 'deadlines';
}) => (
    <Card className="shadow-md dark:border-gray-700">
        <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.length > 0 ? (
                    data.map((item, i) => (
                        <li
                            key={item.id || i}
                            className="flex items-center justify-between py-2 text-xs transition-all hover:bg-gray-50 dark:hover:bg-gray-800/40"
                        >
                            <div className="flex flex-col">
                                <span className="truncate font-medium text-gray-900 dark:text-gray-100">
                                    {item.title || item.name}
                                </span>
                                {type !== 'projects' && (
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                        {item.project?.name || 'No project'}
                                    </span>
                                )}
                            </div>

                            {type === 'deadlines' ? (
                                <div className="text-right">
                                    <span className="text-[11px] text-gray-600 dark:text-gray-300">
                                        {new Date(
                                            item.due_date,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            ) : type === 'tasks' ? (
                                <div className="flex items-center gap-2">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                item.priority?.color || '#ccc',
                                        }}
                                    />
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                        {item.status?.name || 'Unknown'}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                                    {item.tasks_count} tasks
                                </span>
                            )}
                        </li>
                    ))
                ) : (
                    <p className="py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                        No {title.toLowerCase()} found.
                    </p>
                )}
            </ul>
        </CardContent>
    </Card>
);

// --- Main Dashboard ---
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
    } = usePage<DashboardProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-5 p-4 text-[13px] md:p-6">
                {/* Top Stats */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Projects" value={totalProjects} />
                    <StatCard title="Active Projects" value={activeProjects} />
                    <StatCard title="Total Tasks" value={totalTasks} />
                    <StatCard title="Total Users" value={totalUsers} />
                </div>

                {/* Secondary Stats */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                <div className="grid gap-3 md:grid-cols-2">
                    <ChartCard
                        title="Tasks by Status"
                        data={tasksByStatus}
                        dataKey="tasks_count"
                    />
                    <ChartCard
                        title="Tasks by Priority"
                        data={tasksByPriority}
                        dataKey="tasks_count"
                    />
                </div>

                {/* Lists */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    <ListCard
                        title="Recent Tasks"
                        data={recentTasks}
                        type="tasks"
                    />
                    <ListCard
                        title="Upcoming Deadlines"
                        data={upcomingDeadlines}
                        type="deadlines"
                    />
                    <ListCard
                        title="Recent Projects"
                        data={recentProjects}
                        type="projects"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
