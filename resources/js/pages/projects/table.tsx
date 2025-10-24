'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // adjust based on your avatar component
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { Status } from '@/types/status';

import {
    ArrowUpWideNarrow,
    ChevronDown,
    ChevronRight,
    CircleCheck,
    ClipboardCheck,
    Clock,
    ListCheckIcon,
    User2Icon,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    statusWithTasks: Status[];
}

export default function CollapsibleTaskTable({ statusWithTasks }: Props) {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const getInitials = useInitials();
    const toggleGroup = (title: string) => {
        setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <div className="space-y-4">
            {statusWithTasks.map((status) => (
                <div
                    key={status.name}
                    className={cn(
                        'overflow-hidden rounded-md bg-card text-card-foreground shadow-sm',
                    )}
                >
                    {/* Header */}
                    <div
                        className="flex cursor-pointer items-center justify-between bg-muted/100 px-4 py-2 hover:bg-muted/30"
                        onClick={() => toggleGroup(status.name)}
                    >
                        <div className="flex items-center gap-2">
                            {openGroups[status.name] ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}

                            {/* Vertical colored line */}
                            <div
                                className="rounded-ful h-5 w-[3px]"
                                style={{
                                    backgroundColor: status.color,
                                }}
                            ></div>

                            {/* Title and count */}
                            <span className="text-sm font-medium">
                                {status.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                                {status.tasks.length}
                            </Badge>
                        </div>
                    </div>

                    {/* Task List */}
                    {openGroups[status.name] && (
                        <div className="overflow-x-auto">
                            <table className="w-full border-t text-sm">
                                <thead className="bg-muted/40">
                                    <tr className="text-left text-muted-foreground">
                                        <th className="flex items-center gap-1 p-3 text-center font-medium">
                                            <ListCheckIcon className="h-4 w-4" />
                                            Task Name
                                        </th>
                                        <th className="font-medium">
                                            <div className="flex items-center gap-1 text-center">
                                                <ClipboardCheck className="h-4 w-4" />
                                                Description
                                            </div>
                                        </th>
                                        <th className="font-medium">
                                            <div className="flex items-center gap-1 text-center">
                                                <Clock className="h-4 w-4" />
                                                Deadline
                                            </div>
                                        </th>
                                        <th className="font-medium">
                                            <div className="flex items-center gap-1 text-center">
                                                <User2Icon className="h-4 w-4" />
                                                Assignees
                                            </div>
                                        </th>
                                        <th className="font-medium">
                                            <div className="flex items-center gap-1 text-center">
                                                <ArrowUpWideNarrow className="h-4 w-4" />
                                                Progress
                                            </div>
                                        </th>
                                        <th className="font-medium">
                                            <div className="flex items-center gap-1 text-center">
                                                <CircleCheck className="h-4 w-4" />
                                                Priority
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {status.tasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="border-t p-3 hover:bg-muted/20"
                                        >
                                            <td className="p-3 font-medium text-muted-foreground">
                                                {task.title}
                                            </td>
                                            <td className="text-muted-foreground">
                                                {task.description || '-'}
                                            </td>
                                            <td className="">
                                                {task.due_date}
                                            </td>
                                            <td className="">
                                                <div className="flex -space-x-2">
                                                    {task.assignees.map(
                                                        (user, i) => (
                                                            <Avatar
                                                                key={i}
                                                                className="h-8 w-8 border-2 border-background"
                                                            >
                                                                <AvatarFallback className="flex items-center justify-center rounded-full text-center font-medium">
                                                                    {getInitials(
                                                                        user.name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ),
                                                    )}
                                                </div>
                                            </td>
                                            <td className="w-32 p-3">
                                                <Progress
                                                    value={80}
                                                    className="h-2"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    className={cn('text-xs')}
                                                    style={{
                                                        backgroundColor:
                                                            task.priority.color,
                                                    }}
                                                >
                                                    {task.priority.name}
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
