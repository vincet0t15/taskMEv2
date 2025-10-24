'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import { Status } from '@/types/status';
import {
    ChevronDown,
    ChevronRight,
    Clock,
    List,
    MessageSquare,
    MoreHorizontal,
    Paperclip,
} from 'lucide-react';
import { useState } from 'react';

const data = [
    {
        id: 1,
        title: 'To-Do',
        count: 1,
        icon: <List className="h-4 w-4 text-blue-500" />,
        tasks: [
            {
                id: 101,
                priority: {
                    label: 'MEDIUM',
                    color: 'bg-yellow-100 text-yellow-800',
                },
                title: 'NDA Documents Templates',
                description: 'Hi Caroline, please help me to create NDA...',
                dueDate: '04 Dec 2025, 10:00 AM',
                assignee: { name: 'Caroline', avatar: '/avatar.jpg' },
                attachments: 1,
                comments: 0,
            },
        ],
    },
    {
        id: 2,
        title: 'On Progress',
        count: 2,
        icon: <Clock className="h-4 w-4 text-blue-400" />,
        tasks: [
            {
                id: 102,
                priority: { label: 'HIGH', color: 'bg-red-100 text-red-800' },
                title: 'Set Up Meeting With Clients',
                description: 'At 27 November 2024, we will discuss our...',
                subtask: { done: 1, total: 2 },
                dueDate: '01 Nov 2025, 12:00 AM',
                assignee: { name: 'Ulysses', avatar: '/avatar.jpg' },
                attachments: 1,
                comments: 1,
            },
        ],
    },
];

interface Props {
    statusWithTasks: Status[];
}
export default function KanbanBoard({ statusWithTasks }: Props) {
    const [openGroups, setOpenGroups] = useState<{ [key: number]: boolean }>(
        {},
    );
    const getInitials = useInitials();

    const toggleGroup = (id: number) => {
        setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-6">
            {statusWithTasks.map((status, index) => (
                <div
                    key={index}
                    className="w-80 flex-shrink-0 rounded-xl bg-muted/40 p-4 shadow-sm"
                >
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                        <div
                            className="flex cursor-pointer items-center gap-2"
                            onClick={() => toggleGroup(status.id)}
                        >
                            {openGroups[status.id] ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div
                                className="rounded-ful h-5 w-[3px]"
                                style={{
                                    backgroundColor: status.color,
                                }}
                            ></div>
                            <h3 className="font-semibold text-foreground">
                                {status.name}
                            </h3>
                            <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                                {status.tasks.length}
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>

                    {/* Collapsible Task List */}
                    {openGroups[status.id] && (
                        <div className="space-y-3 transition-all duration-300">
                            {status.tasks.map((task) => (
                                <Card
                                    key={task.id}
                                    className="border bg-card shadow-sm"
                                >
                                    <CardContent className="space-y-3 p-4">
                                        {/* Priority */}
                                        <Badge
                                            className={`text-xs font-semibold`}
                                            style={{
                                                backgroundColor:
                                                    task.priority.color,
                                            }}
                                        >
                                            {task.priority.name}
                                        </Badge>

                                        {/* Title + Description */}
                                        <div>
                                            <h4 className="leading-tight font-semibold text-foreground">
                                                {task.title}
                                            </h4>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {task.description}
                                            </p>
                                        </div>

                                        {/* Optional Subtask */}
                                        {/* {task.subtask && (
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <List className="h-3 w-3" />
                                                    Sub Task
                                                </div>
                                                <span>
                                                    {task.subtask.done}/
                                                    {task.subtask.total}
                                                </span>
                                            </div>
                                        )} */}

                                        {/* Progress Bar (if subtasks) */}
                                        {/* {task.subtask && (
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full bg-blue-500 transition-all"
                                                    style={{
                                                        width: `${
                                                            (task.subtask.done /
                                                                task.subtask
                                                                    .total) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        )} */}

                                        {/* Due Date */}
                                        <p className="flex items-center gap-1 text-center text-xs text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            {task.due_date}
                                        </p>

                                        <Separator />
                                        {/* Footer: Assignee + Icons */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {task.assignees.map(
                                                    (user, index) => (
                                                        <Avatar
                                                            className="h-6 w-6 border"
                                                            key={index}
                                                        >
                                                            {task.assignees ? (
                                                                <AvatarImage
                                                                    src={
                                                                        user.avatar
                                                                    }
                                                                    alt={
                                                                        user.name
                                                                    }
                                                                />
                                                            ) : (
                                                                <AvatarFallback className="flex items-center justify-center text-xs font-medium">
                                                                    {getInitials(
                                                                        user.name,
                                                                    )}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                    ),
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Paperclip className="h-3.5 w-3.5" />
                                                    {/* {task.attachments} */}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    {/* {task.comments} */}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
