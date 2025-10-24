'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import { Status } from '@/types/status';
import {
    CheckSquare,
    Clock,
    LinkIcon,
    MessageSquare,
    MoreHorizontal,
    Plus,
} from 'lucide-react';

const statuses = [
    {
        id: 1,
        name: 'To Do',
        color: 'bg-blue-500',
        count: 4,
        tasks: [
            {
                id: 1,
                title: 'Design Homepage Wireframe',
                description:
                    'Discuss layout with the marketing team for alignment.',
                status: 'Not Started',
                priority: { label: 'Low', color: 'bg-blue-100 text-blue-800' },
                date: '02 Nov 2023',
                assignees: ['JD', 'AM'],
                comments: 12,
                links: 1,
                progress: '0/3',
            },
            {
                id: 2,
                title: 'Design Homepage Wireframe',
                description:
                    'Discuss layout with the marketing team for alignment.',
                status: 'In Research',
                priority: {
                    label: 'Medium',
                    color: 'bg-yellow-100 text-yellow-800',
                },
                date: '02 Nov 2023',
                assignees: ['JD', 'AM'],
                comments: 12,
                links: 1,
                progress: '0/3',
            },
        ],
    },
    {
        id: 2,
        name: 'In Progress',
        color: 'bg-indigo-500',
        count: 4,
        tasks: [
            {
                id: 3,
                title: 'Design Homepage Wireframe',
                description:
                    'Discuss layout with the marketing team for alignment.',
                status: 'In Research',
                priority: { label: 'High', color: 'bg-red-100 text-red-800' },
                date: '02 Nov 2023',
                assignees: ['JD', 'AM'],
                comments: 12,
                links: 1,
                progress: '0/3',
            },
            {
                id: 4,
                title: 'Design Homepage Wireframe',
                description:
                    'Discuss layout with the marketing team for alignment.',
                status: 'On Track',
                priority: { label: 'Low', color: 'bg-blue-100 text-blue-800' },
                date: '02 Nov 2023',
                assignees: ['JD', 'AM'],
                comments: 12,
                links: 1,
                progress: '0/3',
            },
        ],
    },
];

interface Props {
    statusWithTasks: Status[];
}
export default function KanbanBoard({ statusWithTasks }: Props) {
    const getInitials = useInitials();
    return (
        <div className="flex h-full gap-4 overflow-x-auto">
            {statusWithTasks.map((status) => (
                <div
                    key={status.id}
                    className="w-80 flex-shrink-0 rounded-xl bg-red-400 p-4 shadow-sm"
                >
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                style={{
                                    backgroundColor: status.color,
                                }}
                                className={`h-2 w-2 rounded-full`}
                            ></div>
                            <h3 className="font-semibold text-foreground">
                                {status.name}
                            </h3>
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                {status.tasks.length}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <button className="rounded p-1 hover:bg-muted">
                                <Plus className="h-4 w-4" />
                            </button>
                            <button className="rounded p-1 hover:bg-muted">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-3">
                        {status.tasks.map((task) => (
                            <Card
                                key={task.id}
                                className="rounded-xl shadow-sm"
                            >
                                <CardContent className="space-y-2">
                                    <Badge
                                        variant="secondary"
                                        className="w-fit text-xs"
                                        style={{
                                            backgroundColor: task.status.color,
                                        }}
                                    >
                                        {task.status.name}
                                    </Badge>
                                    <h4 className="leading-tight font-semibold">
                                        {task.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        {task.description}
                                    </p>

                                    {/* Assignees */}
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>Assignees :</span>
                                        <div className="flex -space-x-2">
                                            {task.assignees.map((user, i) => (
                                                <Avatar
                                                    key={i}
                                                    className="h-6 w-6 border-2 border-background bg-primary/10 text-xs font-semibold text-primary"
                                                >
                                                    <AvatarFallback className="flex items-center justify-center">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <p>{task.due_date}</p>
                                        </div>
                                        <Badge className={task.priority.color}>
                                            {task.priority.name}
                                        </Badge>
                                    </div>
                                    <Separator />
                                    {/* Task Meta */}
                                    <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-3 w-3" />{' '}
                                                {/* {task.comments} */}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <LinkIcon className="h-3 w-3" />{' '}
                                                {/* {task.links} */}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CheckSquare className="h-3 w-3" />{' '}
                                                {/* {task.progress} */}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
