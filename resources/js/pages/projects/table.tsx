'use client';

import { Avatar } from '@/components/ui/avatar'; // adjust based on your avatar component
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Task {
    id: number;
    name: string;
    description?: string;
    deadline: string;
    people: string[]; // URLs or initials
    progress: number;
    priority: 'Low' | 'Medium' | 'High';
}

interface Group {
    title: string;
    color: string;
    tasks: Task[];
}

const groups: Group[] = [
    {
        title: 'To-do',
        color: 'border-l-yellow-500',
        tasks: [
            {
                id: 1,
                name: 'Employee Details',
                description:
                    'Create a page where there is information about employees',
                deadline: '29 Nov, 2024',
                people: ['A', 'B', 'C'],
                progress: 50,
                priority: 'Medium',
            },
            {
                id: 2,
                name: 'Darkmode Version',
                description: 'Darkmode version for all screens',
                deadline: '29 Nov, 2024',
                people: ['D', 'E'],
                progress: 20,
                priority: 'Low',
            },
        ],
    },
    {
        title: 'In Progress',
        color: 'border-l-blue-500',
        tasks: [
            {
                id: 3,
                name: 'Settings Page',
                description: '-',
                deadline: '29 Nov, 2024',
                people: ['X', 'Y', 'Z'],
                progress: 50,
                priority: 'Medium',
            },
        ],
    },
    {
        title: 'Completed',
        color: 'border-l-green-500',
        tasks: [
            {
                id: 4,
                name: 'Super Admin Role',
                description: '-',
                deadline: '29 Nov, 2024',
                people: ['A', 'B'],
                progress: 100,
                priority: 'Medium',
            },
        ],
    },
];

export default function CollapsibleTaskTable() {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (title: string) => {
        setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <div className="space-y-4">
            {groups.map((group) => (
                <div
                    key={group.title}
                    className={cn(
                        'overflow-hidden rounded-md bg-card text-card-foreground shadow-sm',
                        group.color,
                    )}
                >
                    {/* Header */}
                    <div
                        className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-muted/30"
                        onClick={() => toggleGroup(group.title)}
                    >
                        <div className="flex items-center gap-2">
                            {openGroups[group.title] ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}

                            {/* Vertical colored line */}
                            <div className="h-5 w-[3px] rounded-full bg-green-500"></div>

                            {/* Title and count */}
                            <span className="text-sm font-medium">
                                {group.title}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                                {group.tasks.length}
                            </Badge>
                        </div>
                    </div>

                    {/* Task List */}
                    {openGroups[group.title] && (
                        <div className="overflow-x-auto">
                            <table className="w-full border-t text-sm">
                                <thead className="bg-muted/40">
                                    <tr className="text-left text-muted-foreground">
                                        <th className="p-3">
                                            <Checkbox />
                                        </th>
                                        <th className="p-3 font-medium">
                                            Task Name
                                        </th>
                                        <th className="p-3 font-medium">
                                            Description
                                        </th>
                                        <th className="p-3 font-medium">
                                            Deadline
                                        </th>
                                        <th className="p-3 font-medium">
                                            People
                                        </th>
                                        <th className="p-3 font-medium">
                                            Progress
                                        </th>
                                        <th className="p-3 font-medium">
                                            Priority
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.tasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="border-t hover:bg-muted/20"
                                        >
                                            <td className="p-3">
                                                <Checkbox />
                                            </td>
                                            <td className="p-3 font-medium">
                                                {task.name}
                                            </td>
                                            <td className="p-3 text-muted-foreground">
                                                {task.description || '-'}
                                            </td>
                                            <td className="p-3">
                                                {task.deadline}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex -space-x-2">
                                                    {task.people.map((p, i) => (
                                                        <Avatar
                                                            key={i}
                                                            className="h-6 w-6 border-2 border-background"
                                                        >
                                                            <span className="text-xs">
                                                                {p}
                                                            </span>
                                                        </Avatar>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="w-32 p-3">
                                                <Progress
                                                    value={task.progress}
                                                    className="h-2"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    className={cn(
                                                        'text-xs',
                                                        task.priority === 'High'
                                                            ? 'bg-red-500 text-white'
                                                            : task.priority ===
                                                                'Medium'
                                                              ? 'bg-yellow-400 text-white'
                                                              : 'bg-blue-400 text-white',
                                                    )}
                                                >
                                                    {task.priority}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
