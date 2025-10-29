'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useInitials } from '@/hooks/use-initials';
import { task } from '@/routes/show';
import { SubTaskInterface } from '@/types/subTask';
import { Task } from '@/types/task';
import { router } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Calendar, CheckCircle2, Circle, File, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CreateSubTaskDialog } from '../subTasks/createSubTask';
import { SubTaskDialog } from '../subTasks/subTaskDialog';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    tasks: Task;
    onDataNeededRefresh?: () => void;
}

export default function TaskDetailDialog({
    open,
    setOpen,
    tasks,
    onDataNeededRefresh,
}: Props) {
    const getInitials = useInitials();
    const [addSubTask, setAddSubTask] = useState(false);
    const [openSubTaskDialog, setOpenSubTaskDialog] = useState(false);
    const [subTask, setSubTask] = useState<SubTaskInterface>();

    const isInitialMount = useRef(true);

    const handleClickSubTask = (subTask: SubTaskInterface) => {
        setSubTask(subTask);
        setOpenSubTaskDialog(true);
    };
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (!openSubTaskDialog) {
            if (onDataNeededRefresh) {
                onDataNeededRefresh();
            } else {
                router.reload({ only: ['tasks'] });
            }
        }
    }, [openSubTaskDialog, onDataNeededRefresh]);

    return (
        <>
            {!addSubTask && !openSubTaskDialog && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogTitle>
                    <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
                        <div className="rounded-sm bg-white p-6 shadow-xl">
                            {/* Header */}
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h2
                                        className="cursor-pointer text-xl font-semibold text-gray-900 hover:underline"
                                        onClick={() =>
                                            router.get(
                                                task.url({
                                                    project: tasks.project_id,
                                                    task: tasks.id,
                                                }),
                                            )
                                        }
                                    >
                                        {tasks.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Status and Info */}
                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="mb-1 text-xs text-gray-500">
                                        Status
                                    </p>
                                    <Badge
                                        style={{
                                            backgroundColor: tasks.status.color,
                                        }}
                                    >
                                        {tasks.status.name}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-gray-500">
                                        Due Date
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-gray-700">
                                        <Calendar className="h-4 w-4" />
                                        {(() => {
                                            const dueDate = tasks?.due_date;
                                            const isOverdue =
                                                dueDate &&
                                                new Date(dueDate) < new Date();

                                            if (dueDate) {
                                                return (
                                                    <div
                                                        className={`flex items-center text-xs ${
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
                                                        {new Date(
                                                            dueDate,
                                                        ).toLocaleDateString(
                                                            'en-US',
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
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
                                <div>
                                    <p className="mb-1 text-xs text-gray-500">
                                        Assignees
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {tasks.assignees.map(
                                                (data, index) => (
                                                    <Avatar
                                                        key={index}
                                                        className="h-6 w-6 border border-background bg-green-400"
                                                    >
                                                        <AvatarFallback className="bg-green-300 p-2 text-sm">
                                                            {getInitials(
                                                                data.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ),
                                            )}
                                        </div>

                                        {/* <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                        </Button> */}
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-gray-500">
                                        Tag
                                    </p>
                                    <Badge
                                        style={{
                                            backgroundColor:
                                                tasks.priority.color,
                                        }}
                                    >
                                        {tasks.priority.name}
                                    </Badge>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <p className="mb-1 text-xs text-gray-500">
                                    Description
                                </p>
                                <p className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                                    {tasks.description}
                                </p>
                            </div>

                            {/* Attachments */}
                            <div className="mb-6">
                                <p className="mb-2 text-xs text-gray-500">
                                    Attachments
                                </p>
                                <div className="flex items-center gap-2 rounded-md border p-2 hover:bg-gray-50">
                                    {tasks.attachments.length > 0 && (
                                        <div className="space-y-2">
                                            {tasks.attachments.map(
                                                (attachment, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 rounded-md border p-2 hover:bg-gray-50"
                                                    >
                                                        <File className="h-5 w-5 text-orange-500" />
                                                        <div className="text-xs">
                                                            <p>
                                                                {
                                                                    attachment.original_name
                                                                }
                                                            </p>
                                                            <span className="text-gray-400">
                                                                {
                                                                    attachment.file_size
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Tabs (only Subtask for now) */}
                            <div>
                                <div className="flex items-center border-b">
                                    <button className="border-b-2 border-blue-600 px-3 py-2 text-sm font-medium text-blue-600">
                                        Sub Task
                                    </button>
                                    <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                                        Comments{' '}
                                        <span className="ml-1 text-red-500">
                                            1
                                        </span>
                                    </button>
                                    <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                                        Activities
                                    </button>
                                </div>

                                {/* Subtasks */}
                                <div className="rounded-b-md border bg-gray-50 p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">
                                            Sub Task
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {tasks.completed_subtasks_count}/
                                            {tasks.total_subtasks_count ?? 0}
                                        </span>
                                    </div>

                                    <Progress
                                        value={
                                            tasks.total_subtasks_count
                                                ? ((tasks.completed_subtasks_count ??
                                                      0) /
                                                      tasks.total_subtasks_count) *
                                                  100
                                                : 0
                                        }
                                        className="mb-3 [&>div]:bg-blue-500"
                                    />

                                    {/* Scrollable Subtasks Container */}
                                    <div className="h-[18vh] space-y-2 overflow-y-auto pr-2">
                                        {tasks.sub_tasks.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="flex cursor-pointer items-center justify-between gap-2 rounded-sm p-1 hover:bg-blue-200"
                                                onClick={() =>
                                                    handleClickSubTask(sub)
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    {sub.status_id === 4 ? (
                                                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                                    ) : (
                                                        <Circle className="h-4 w-4 text-gray-400" />
                                                    )}
                                                    <span
                                                        className={`text-sm ${
                                                            sub.status_id === 4
                                                                ? 'text-gray-500 line-through'
                                                                : 'text-gray-800'
                                                        }`}
                                                    >
                                                        {sub.title}
                                                    </span>
                                                </div>
                                                <Badge
                                                    style={{
                                                        backgroundColor:
                                                            sub.status.color,
                                                    }}
                                                >
                                                    {sub.status.name}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={() => setAddSubTask(true)}
                                        variant="ghost"
                                        className="mt-3 w-full text-sm text-blue-600 hover:bg-blue-50"
                                    >
                                        + Add new Subtask
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {addSubTask && tasks && (
                <CreateSubTaskDialog
                    open={addSubTask}
                    onOpenChange={setAddSubTask}
                    task={tasks}
                    onSubTaskCreated={() => {
                        // Handle subtask creation - reload only the tasks data to keep dialog open
                        router.reload({ only: ['statusWithTasks'] });
                    }}
                />
            )}

            {openSubTaskDialog && subTask && (
                <SubTaskDialog
                    open={openSubTaskDialog}
                    onOpenChange={setOpenSubTaskDialog}
                    subTask={subTask}
                    onSubTaskUpdated={() => {
                        router.reload({ only: ['task'] });
                    }}
                    onSubTaskDeleted={() => {
                        router.reload({ only: ['task'] });
                    }}
                />
            )}
        </>
    );
}
