'use client';

import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import myTask from '@/routes/myTask';
import { tasks } from '@/routes/view';
import { Status } from '@/types/status';
import { Task } from '@/types/task';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { router } from '@inertiajs/react';
import {
    AlertTriangle,
    ChevronDown,
    Clock,
    MessageCircle,
    UserCircle2,
    Workflow,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import TaskDetailDialog from '../tasks/viewTask';

interface Props {
    statusWithTasks: Status[];
}

export default function KanbanBoard({ statusWithTasks }: Props) {
    const [taskDetails, setTaskDetails] = useState<Task>();
    const [openView, setOpenView] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    const [openGroups, setOpenGroups] = useState<{ [key: number]: boolean }>(
        () => {
            const initial: { [key: number]: boolean } = {};
            statusWithTasks?.forEach((status) => {
                initial[status.id] = true;
            });
            return initial;
        },
    );

    const toggleGroup = (id: number) => {
        setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const sections = useMemo(() => statusWithTasks ?? [], [statusWithTasks]);

    useEffect(() => {
        if (taskDetails && openView) {
            const updatedTask = sections
                .flatMap((status) => status.tasks)
                .find((task) => task.id === taskDetails.id);
            if (updatedTask) {
                setTaskDetails(updatedTask);
            }
        }
    }, [statusWithTasks, taskDetails?.id, openView]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        const taskId = e.currentTarget.getAttribute('data-id');
        if (taskId) {
            const task = sections
                .flatMap((status) => status.tasks)
                .find((t) => t.id === parseInt(taskId));
            setActiveTask(task || null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Allow drop
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const statusId = e.currentTarget.getAttribute('data-id');

        if (taskId && statusId) {
            const activeTaskId = parseInt(taskId);
            const overStatusId = parseInt(statusId);

            // Find the task and its current status
            const activeTask = sections
                .flatMap((status) => status.tasks)
                .find((task) => task.id === activeTaskId);

            if (!activeTask) return;

            // If dropped on the same status, do nothing
            if (activeTask.status_id === overStatusId) return;
            router.put(
                myTask.update({ task: activeTaskId, status: overStatusId }, {}),
                {},
                {
                    onSuccess: (response: { props: FlashProps }) => {
                        toast.success(
                            response.props.flash?.success ||
                                'Task updated successfully.',
                        );
                    },
                    onError: () => {
                        toast.error('Failed to update task.');
                    },
                },
            );
        }

        setActiveTask(null);
    };

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
                        <div
                            data-id={status.id}
                            className="mt-4 min-h-[200px] space-y-4 rounded-lg border-2 border-dashed border-gray-200 p-2 transition-colors hover:border-gray-300"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {status.tasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    data-id={task.id}
                                    draggable
                                    className="group cursor-grab rounded-sm border border-slate-500 p-4 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 active:cursor-grabbing"
                                    onDragStart={(e) => {
                                        const taskId =
                                            e.currentTarget.getAttribute(
                                                'data-id',
                                            );
                                        if (taskId) {
                                            e.dataTransfer.setData(
                                                'text/plain',
                                                taskId,
                                            );
                                            handleDragStart(e);
                                        }
                                    }}
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span
                                            className="cursor-pointer truncate text-sm font-semibold text-slate-700 hover:font-bold"
                                            onClick={() =>
                                                router.get(
                                                    tasks.url({
                                                        project:
                                                            task.project_id,
                                                        task: task.id,
                                                    }),
                                                )
                                            }
                                        >
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
                                            <span>{task.comments?.length}</span>
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
                                        <div className="flex items-center gap-1">
                                            <Workflow className="h-4 w-4" />
                                            <span className="text-xs">
                                                {task.sub_tasks.length} Subtask
                                                {task.sub_tasks.length !== 1 &&
                                                    's'}
                                            </span>
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
            {openView && taskDetails && (
                <TaskDetailDialog
                    open={openView}
                    setOpen={setOpenView}
                    tasks={taskDetails}
                    onDataNeededRefresh={() =>
                        router.reload({ only: ['statusWithTasks'] })
                    }
                />
            )}
        </div>
    );
}
