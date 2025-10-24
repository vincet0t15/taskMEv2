'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import { Status } from '@/types/status';
import {
    ChevronDown,
    MessageSquare,
    MoreHorizontal,
    Paperclip,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
    statusWithTasks: Status[];
}

export default function KanbanBoard({ statusWithTasks }: Props) {
    const [openGroups, setOpenGroups] = useState<{ [key: number]: boolean }>(
        () => {
            const initial: { [key: number]: boolean } = {};
            statusWithTasks?.forEach((status) => {
                initial[status.id] = true;
            });
            return initial;
        },
    );
    const getInitials = useInitials();

    const toggleGroup = (id: number) => {
        setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const sections = useMemo(() => statusWithTasks ?? [], [statusWithTasks]);

    return (
        <div className="flex gap-4 overflow-x-auto pb-6">
            {sections.map((status) => (
                <div
                    key={status.id}
                    className="w-[300px] flex-shrink-0 space-y-4"
                >
                    <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-2 transition-colors hover:bg-muted/50"
                        onClick={() => toggleGroup(status.id)}
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className="h-5 w-1.5 rounded-full"
                                style={{ backgroundColor: status.color }}
                            />
                            <span className="text-base font-semibold text-foreground uppercase">
                                {status.name}
                            </span>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                                {status.tasks.length}
                            </span>
                        </div>
                        <ChevronDown
                            className={`h-5 w-5 text-muted-foreground transition-transform ${
                                !openGroups[status.id] ? '-rotate-90' : ''
                            }`}
                        />
                    </button>
                    {/* Task List */}
                    {openGroups[status.id] && (
                        <div className="space-y-4">
                            {status.tasks.map((task) => (
                                <Card
                                    key={task.id}
                                    className="rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="space-y-4 p-5">
                                        {/* Header with priority and menu */}
                                        <div className="flex items-start justify-between">
                                            <Badge
                                                variant="secondary"
                                                className="rounded-lg px-3 py-1.5 text-xs font-semibold uppercase"
                                                style={{
                                                    backgroundColor:
                                                        task.priority.color +
                                                        '25',
                                                    color: task.priority.color,
                                                }}
                                            >
                                                {task.priority.name}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="-mt-1 -mr-2 h-8 w-8 hover:bg-muted"
                                            >
                                                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                                            </Button>
                                        </div>

                                        {/* Title & description */}
                                        <div>
                                            <h4 className="text-base leading-snug font-semibold text-foreground">
                                                {task.title}
                                            </h4>
                                            {task.description && (
                                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Subtasks & progress */}
                                        {/* {task.subtasks && task.subtasks.total > 0 && (
                                            <div className="space-y-2.5 rounded-xl bg-muted/40 p-3.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                                                        <List className="h-4 w-4" />
                                                        Sub Task
                                                    </span>
                                                    <span className="text-sm font-semibold text-foreground">
                                                        {task.subtasks.done}/{task.subtasks.total}
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${Math.min(100, Math.round((task.subtasks.done / task.subtasks.total) * 100))}%`,
                                                            backgroundColor: '#3b82f6',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )} */}

                                        {/* Due date */}
                                        {task.due_date && (
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-medium">
                                                    Due Date :{' '}
                                                </span>
                                                {task.due_date}
                                            </p>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex -space-x-2">
                                                {task.assignees
                                                    ?.slice(0, 3)
                                                    .map((user, idx) => (
                                                        <Avatar
                                                            key={idx}
                                                            className="h-9 w-9 border-2 border-background ring-0"
                                                        >
                                                            {user.avatar ? (
                                                                <AvatarImage
                                                                    src={
                                                                        user.avatar
                                                                    }
                                                                    alt={
                                                                        user.name
                                                                    }
                                                                />
                                                            ) : (
                                                                <AvatarFallback
                                                                    className="text-xs font-semibold"
                                                                    style={{
                                                                        backgroundColor:
                                                                            '#86efac',
                                                                        color: '#166534',
                                                                    }}
                                                                >
                                                                    {getInitials(
                                                                        user.name,
                                                                    )}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                    ))}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="flex h-9 min-w-[60px] items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                                                    <Paperclip className="h-4 w-4" />
                                                    <span>1</span>
                                                </button>
                                                <button className="flex h-9 min-w-[60px] items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                                                    <MessageSquare className="h-4 w-4" />
                                                    <span>1</span>
                                                </button>
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
