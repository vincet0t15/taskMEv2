'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useInitials } from '@/hooks/use-initials';
import myTask from '@/routes/myTask';
import { Status } from '@/types/status';
import { SubTaskInterface } from '@/types/subTask';
import { Task } from '@/types/task';
import { router } from '@inertiajs/react';
import {
    ArrowUpWideNarrow,
    ChevronDown,
    ChevronRight,
    CircleCheck,
    ClipboardCheck,
    Clock,
    ListCheckIcon,
    Users2Icon,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
    statusWithTasks: Status[];
}

export default function MyTasksListTable({ statusWithTasks }: Props) {
    const getInitials = useInitials();
    const [openTasks, setOpenTasks] = useState<Record<number, boolean>>({});
    const [openViewTask, setOpenViewTask] = useState(false);
    const [taskDetails, setTaskDetails] = useState<Task>();
    const [openSubTaskDialog, setOpenSubTaskDialog] = useState(false);
    const [subTask, setSubTask] = useState<SubTaskInterface>();

    // 🟢 Initialize all status groups as open by default
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
        Object.fromEntries((statusWithTasks || []).map((s) => [s.name, true])),
    );

    const toggleGroup = (title: string) => {
        setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const toggleTask = (taskId: number) => {
        setOpenTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const handleClickSubTask = (task: Task, subTask: SubTaskInterface) => {
        setTaskDetails(task);
        setSubTask(subTask);
        setOpenSubTaskDialog(true);
    };

    const sections = useMemo(() => statusWithTasks ?? [], [statusWithTasks]);

    useEffect(() => {
        if (taskDetails && openViewTask) {
            const updatedTask = sections
                .flatMap((status) => status.tasks)
                .find((task) => task.id === taskDetails.id);
            if (updatedTask) {
                setTaskDetails(updatedTask);
            }
        }
    }, [statusWithTasks, taskDetails?.id, openViewTask]);

    return (
        <div className="space-y-4">
            {statusWithTasks.map((status, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-md bg-card text-card-foreground shadow-sm"
                >
                    {/* Status Header */}
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
                            <div
                                className="h-5 w-[3px] rounded-full"
                                style={{ backgroundColor: status.color }}
                            />
                            <span className="text-sm font-medium">
                                {status.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                                {status.tasks.length}
                            </Badge>
                        </div>
                    </div>

                    {/* Tasks Table */}
                    {openGroups[status.name] && (
                        <div className="overflow-x-auto">
                            <table className="w-full border-t text-sm">
                                <thead className="bg-muted/40">
                                    <tr className="text-left text-muted-foreground">
                                        <th className="p-3 font-medium">
                                            <div className="flex items-center gap-1">
                                                <ListCheckIcon className="h-4 w-4" />
                                                Task Name
                                            </div>
                                        </th>
                                        <th className="p-3 font-medium">
                                            <div className="flex items-center gap-1">
                                                <ClipboardCheck className="h-4 w-4" />
                                                Description
                                            </div>
                                        </th>
                                        <th className="font-medium">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                Deadline
                                            </div>
                                        </th>
                                        <th className="font-medium">
                                            <div className="flex items-center gap-1">
                                                <Users2Icon className="h-4 w-4" />
                                                Assignees
                                            </div>
                                        </th>
                                        <th className="font-medium">
                                            <div className="flex items-center gap-1">
                                                <ArrowUpWideNarrow className="h-4 w-4" />
                                                Progress
                                            </div>
                                        </th>
                                        <th className="font-medium">
                                            <div className="flex items-center gap-1">
                                                <CircleCheck className="h-4 w-4" />
                                                Priority
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {status.tasks.map((task) => (
                                        <React.Fragment key={task.id}>
                                            <tr className="border-t hover:bg-muted/20">
                                                <td className="flex items-center gap-2 p-3 font-medium text-muted-foreground">
                                                    {task.sub_tasks &&
                                                    task.sub_tasks.length >
                                                        0 ? (
                                                        openTasks[task.id] ? (
                                                            <ChevronDown
                                                                className="h-4 w-4 text-primary"
                                                                onClick={() =>
                                                                    toggleTask(
                                                                        task.id,
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <ChevronRight
                                                                className="h-4 w-4 text-primary"
                                                                onClick={() =>
                                                                    toggleTask(
                                                                        task.id,
                                                                    )
                                                                }
                                                            />
                                                        )
                                                    ) : (
                                                        <span className="w-4" />
                                                    )}
                                                    <span
                                                        className="cursor-pointer hover:font-bold"
                                                        onClick={() =>
                                                            router.get(
                                                                myTask.show.url(
                                                                    task.id,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        {task.title}
                                                    </span>
                                                </td>

                                                <td>
                                                    {task.description || '-'}
                                                </td>
                                                <td>{task.due_date || '-'}</td>

                                                <td>
                                                    <div className="flex -space-x-2">
                                                        {task.assignees.map(
                                                            (user, i) => (
                                                                <Avatar
                                                                    key={i}
                                                                    className="h-8 w-8 border-2 border-background"
                                                                >
                                                                    <AvatarFallback className="bg-green-500 text-xs">
                                                                        {getInitials(
                                                                            user.name,
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            ),
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="w-32 p-2">
                                                    <Progress
                                                        value={
                                                            task.total_subtasks_count
                                                                ? ((task.completed_subtasks_count ??
                                                                      0) /
                                                                      task.total_subtasks_count) *
                                                                  100
                                                                : 0
                                                        }
                                                        className="mb-3 [&>div]:bg-blue-500"
                                                    />
                                                </td>

                                                <td>
                                                    <Badge
                                                        className="text-xs"
                                                        style={{
                                                            backgroundColor:
                                                                task.priority
                                                                    .color,
                                                        }}
                                                    >
                                                        {task.priority.name}
                                                    </Badge>
                                                </td>
                                            </tr>

                                            {openTasks[task.id] &&
                                                task.sub_tasks?.length > 0 &&
                                                task.sub_tasks.map((sub) => (
                                                    <tr
                                                        key={sub.id}
                                                        className="border-t bg-muted/5 transition-colors hover:bg-muted/20"
                                                    >
                                                        <td
                                                            className="flex cursor-pointer items-center gap-2 p-3 pl-10 text-muted-foreground hover:font-bold"
                                                            onClick={() =>
                                                                handleClickSubTask(
                                                                    task,
                                                                    sub,
                                                                )
                                                            }
                                                        >
                                                            {sub.title}
                                                        </td>
                                                        <td className="text-xs">
                                                            {sub.description ||
                                                                '-'}
                                                        </td>
                                                        <td className="text-xs">
                                                            {sub.due_date ||
                                                                '-'}
                                                        </td>
                                                        <td>
                                                            <div className="flex -space-x-2">
                                                                {sub.assignees?.map(
                                                                    (
                                                                        user,
                                                                        i,
                                                                    ) => (
                                                                        <Avatar
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="h-8 w-8 border-2 border-background"
                                                                        >
                                                                            <AvatarFallback className="bg-green-500 text-xs">
                                                                                {getInitials(
                                                                                    user.name,
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="w-32 p-2">
                                                            <Badge
                                                                style={{
                                                                    backgroundColor:
                                                                        sub
                                                                            .status
                                                                            .color,
                                                                }}
                                                            >
                                                                {
                                                                    sub.status
                                                                        .name
                                                                }
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Badge
                                                                className="text-[10px]"
                                                                style={{
                                                                    backgroundColor:
                                                                        sub
                                                                            .priority
                                                                            ?.color,
                                                                }}
                                                            >
                                                                {sub.priority
                                                                    ?.name ||
                                                                    '-'}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </React.Fragment>
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
