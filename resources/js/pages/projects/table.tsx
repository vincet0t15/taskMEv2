'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useInitials } from '@/hooks/use-initials';
import { tasks } from '@/routes/view';
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
    Dot,
    ListCheckIcon,
    Users2Icon,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { SubTaskDialog } from '../subTasks/subTaskDialog';
import TaskDetailDialog from '../tasks/viewTask';

interface Props {
    statusWithTasks: Status[];
}

export default function CollapsibleTaskTable({ statusWithTasks }: Props) {
    // const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const [openTasks, setOpenTasks] = useState<Record<number, boolean>>({});
    const [openViewTask, setOpenViewTask] = useState(false);
    const [taskDetails, setTaskDetails] = useState<Task>();
    const [openSubTaskDialog, setOpenSubTaskDialog] = useState(false);
    const [subTask, setSubTask] = useState<SubTaskInterface>();

    const getInitials = useInitials();

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
        Object.fromEntries((statusWithTasks || []).map((s) => [s.name, true])),
    );
    const toggleGroup = (title: string) => {
        setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const toggleTask = (taskId: number) => {
        setOpenTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const handleClickTask = (task: Task) => {
        setTaskDetails(task);
        setOpenViewTask(true);
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
                            <table className="w-full table-fixed border-t text-sm">
                                <thead className="bg-muted/40">
                                    <tr className="text-left text-muted-foreground">
                                        <th className="w-[250px] p-2 font-medium">
                                            <div className="flex items-center gap-1">
                                                <ListCheckIcon className="h-4 w-4" />
                                                Task Name
                                            </div>
                                        </th>
                                        <th className="w-[700px] p-2 font-medium">
                                            <div className="flex items-center gap-1">
                                                <ClipboardCheck className="h-4 w-4" />
                                                Description
                                            </div>
                                        </th>
                                        <th className="p-2 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                Deadline
                                            </div>
                                        </th>
                                        <th className="p-2 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Users2Icon className="h-4 w-4" />
                                                Assignees
                                            </div>
                                        </th>
                                        <th className="p-2 font-medium">
                                            <div className="flex items-center gap-1">
                                                <ArrowUpWideNarrow className="h-4 w-4" />
                                                Progress
                                            </div>
                                        </th>
                                        <th className="p-2 font-medium">
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
                                            <tr
                                                className={`border-t border-b align-middle ${
                                                    task.due_date &&
                                                    task.status_id !== 4
                                                        ? new Date(
                                                              task.due_date,
                                                          ) < new Date()
                                                            ? 'bg-red-100'
                                                            : (new Date(
                                                                    task.due_date,
                                                                ).getTime() -
                                                                    Date.now()) /
                                                                    (1000 *
                                                                        60 *
                                                                        60 *
                                                                        24) <=
                                                                3
                                                              ? 'bg-orange-100' // due soon
                                                              : ''
                                                        : ''
                                                }`}
                                            >
                                                <td className="w-[250px] truncate p-2 font-medium text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        {task.sub_tasks
                                                            ?.length ? (
                                                            openTasks[
                                                                task.id
                                                            ] ? (
                                                                <ChevronDown
                                                                    className="h-4 w-4 cursor-pointer text-primary"
                                                                    onClick={() =>
                                                                        toggleTask(
                                                                            task.id,
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <ChevronRight
                                                                    className="h-4 w-4 cursor-pointer text-primary"
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
                                                            className="cursor-pointer truncate hover:font-bold"
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
                                                    </div>
                                                </td>

                                                <td
                                                    className="max-w-[300px] truncate p-2 text-muted-foreground"
                                                    title={
                                                        task.description || '-'
                                                    }
                                                >
                                                    {task.description || '-'}
                                                </td>

                                                <td className="p-2 text-muted-foreground">
                                                    {task.due_date || '-'}
                                                </td>

                                                <td className="">
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

                                                <td className="w-32 p-2 align-middle">
                                                    {task.sub_tasks.length >
                                                    0 ? (
                                                        <Progress
                                                            value={
                                                                task.total_subtasks_count
                                                                    ? ((task.completed_subtasks_count ??
                                                                          0) /
                                                                          task.total_subtasks_count) *
                                                                      100
                                                                    : 0
                                                            }
                                                            className="[&>div]:bg-blue-500"
                                                        />
                                                    ) : (
                                                        <Badge
                                                            style={{
                                                                backgroundColor:
                                                                    task.status
                                                                        .color,
                                                            }}
                                                        >
                                                            {task.status.name}
                                                        </Badge>
                                                    )}
                                                </td>

                                                <td className="p-2">
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

                                            {/* Subtasks */}
                                            {openTasks[task.id] &&
                                                task.sub_tasks?.map((sub) => (
                                                    <tr
                                                        key={sub.id}
                                                        className={`border-t align-middle hover:bg-muted/20 ${
                                                            sub.due_date &&
                                                            sub.status_id !== 4
                                                                ? new Date(
                                                                      sub.due_date,
                                                                  ) < new Date()
                                                                    ? 'bg-red-100'
                                                                    : (new Date(
                                                                            sub.due_date,
                                                                        ).getTime() -
                                                                            Date.now()) /
                                                                            (1000 *
                                                                                60 *
                                                                                60 *
                                                                                24) <=
                                                                        3
                                                                      ? 'bg-orange-100'
                                                                      : 'bg-muted/10'
                                                                : 'bg-muted/10'
                                                        }`}
                                                    >
                                                        <td
                                                            className="flex cursor-pointer items-center p-2 pl-5 text-xs text-muted-foreground hover:font-bold"
                                                            onClick={() =>
                                                                handleClickSubTask(
                                                                    task,
                                                                    sub,
                                                                )
                                                            }
                                                        >
                                                            <Dot />
                                                            {sub.title}
                                                        </td>
                                                        <td
                                                            className="max-w-[300px] truncate p-2 text-xs text-muted-foreground"
                                                            title={
                                                                sub.description ||
                                                                '-'
                                                            }
                                                        >
                                                            {sub.description ||
                                                                '-'}
                                                        </td>
                                                        <td className="p-2 text-xs text-muted-foreground">
                                                            {sub.due_date ||
                                                                '-'}
                                                        </td>
                                                        <td className="">
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
                                                                            className="h-7 w-7 border-2 border-background"
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
                                                        <td className="p-2">
                                                            <Badge
                                                                style={{
                                                                    backgroundColor:
                                                                        sub
                                                                            .status
                                                                            .color,
                                                                }}
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    sub.status
                                                                        .name
                                                                }
                                                            </Badge>
                                                        </td>
                                                        <td className="p-2">
                                                            <Badge
                                                                style={{
                                                                    backgroundColor:
                                                                        sub
                                                                            .priority
                                                                            ?.color,
                                                                }}
                                                                className="text-[10px]"
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
            {openViewTask && taskDetails && (
                <TaskDetailDialog
                    open={openViewTask}
                    setOpen={setOpenViewTask}
                    tasks={taskDetails}
                    onDataNeededRefresh={() =>
                        router.reload({ only: ['statusWithTasks'] })
                    }
                />
            )}

            {openSubTaskDialog && subTask && (
                <SubTaskDialog
                    open={openSubTaskDialog}
                    onOpenChange={setOpenSubTaskDialog}
                    subTask={subTask}
                    task={taskDetails}
                />
            )}
        </div>
    );
}
