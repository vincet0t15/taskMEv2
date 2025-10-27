'use client';

import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import { Status } from '@/types/status';
import {
    AlertTriangle,
    ChevronDown,
    Clock,
    MessageCircle,
    UserCircle2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { SubTaskDrawer } from '../subTasks/list';
interface Props {
    statusWithTasks: Status[];
}

export default function KanbanBoard({ statusWithTasks }: Props) {
    console.log(statusWithTasks);
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
        <div className="flex gap-2 overflow-x-auto pb-6 md:gap-4">
            {sections.map((status, index) => (
                <div
                    key={index}
                    className="flex w-70 flex-shrink-0 flex-col rounded-xl transition-all duration-300"
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
                        <div className="mt-4 space-y-4">
                            {status.tasks.map((task, index) => (
                                <div
                                    key={index}
                                    className="group rounded-sm border border-slate-500 p-4 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="cursor-pointer truncate text-sm font-semibold text-slate-700 hover:font-bold">
                                            {task.title}
                                        </span>
                                        <div className="flex items-center justify-center gap-2">
                                            <Badge
                                                className="text-white"
                                                style={{
                                                    backgroundColor:
                                                        task.priority.color,
                                                }}
                                            >
                                                {task.priority.name}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="mb-3 line-clamp-2 text-sm leading-snug text-slate-700">
                                        {task.description ||
                                            'No description provided.'}
                                    </p>
                                    {/* Footer */}
                                    <div className="flex items-center justify-between border-t border-slate-500/40 pt-2 text-xs text-slate-400">
                                        {/* Comments and Assigned Users */}

                                        {/* Comments Count */}
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="h-3.5 w-3.5" />
                                            <span>2</span>
                                        </div>

                                        {/* Users (Avatars) */}

                                        <div className="flex items-center gap-1">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex cursor-default items-center gap-1">
                                                            <UserCircle2 className="h-4.5 w-4.5 text-slate-400" />
                                                            <span>
                                                                {task.assignees
                                                                    ?.length ??
                                                                    0}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        side="top"
                                                        className="text-xs"
                                                    >
                                                        {task.assignees &&
                                                        task.assignees.length >
                                                            0
                                                            ? task.assignees
                                                                  .map(
                                                                      (user) =>
                                                                          user.name,
                                                                  )
                                                                  .join(', ')
                                                            : 'No users assigned'}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        <div>
                                            <SubTaskDrawer
                                                subTasks={task.sub_tasks}
                                                task={task}
                                            />
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {(() => {
                                                const dueDate = task?.due_date;
                                                const isOverdue =
                                                    dueDate &&
                                                    new Date(dueDate) <
                                                        new Date();

                                                if (dueDate) {
                                                    return (
                                                        <div
                                                            className={`flex items-center gap-1 text-xs ${
                                                                isOverdue
                                                                    ? 'text-red-400'
                                                                    : 'text-teal-400'
                                                            }`}
                                                            title={
                                                                isOverdue
                                                                    ? 'Overdue'
                                                                    : 'Due Date'
                                                            }
                                                        >
                                                            {isOverdue ? (
                                                                <AlertTriangle className="h-3 w-3" />
                                                            ) : (
                                                                <Clock className="h-3 w-3" />
                                                            )}
                                                            {new Date(
                                                                dueDate,
                                                            ).toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: '2-digit',
                                                                },
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <span className="text-gray-500">
                                                        —
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
