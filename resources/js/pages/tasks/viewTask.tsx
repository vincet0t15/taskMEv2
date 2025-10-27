'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useInitials } from '@/hooks/use-initials';
import { Task } from '@/types/task';
import { router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Circle,
    File,
    FileText,
    Plus,
    UserPlus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreateSubTaskDialog } from '../subTasks/createSubTask';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    task: Task;
}

export default function TaskDetailDialog({ open, setOpen, task }: Props) {
    console.log(task);
    const getInitials = useInitials();
    const [addSubTask, setAddSubTask] = useState(false);
    const [maxSubtaskHeight, setMaxSubtaskHeight] = useState('300px');

    useEffect(() => {
        const updateHeight = () => {
            const calculatedHeight = Math.max(window.innerHeight - 400, 200);
            setMaxSubtaskHeight(`${calculatedHeight}px`);
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return (
        <>
            {!addSubTask && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
                        <div className="rounded-sm bg-white p-6 shadow-xl">
                            {/* Header */}
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {task.title}
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
                                            backgroundColor: task.status.color,
                                        }}
                                    >
                                        {task.status.name}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-gray-500">
                                        Due Date
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-gray-700">
                                        <Calendar className="h-4 w-4" />
                                        {(() => {
                                            const dueDate = task?.due_date;
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
                                            {task.assignees.map(
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

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-gray-500">
                                        Tag
                                    </p>
                                    <Badge
                                        style={{
                                            backgroundColor:
                                                task.priority.color,
                                        }}
                                    >
                                        {task.priority.name}
                                    </Badge>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <p className="mb-1 text-xs text-gray-500">
                                    Description
                                </p>
                                <p className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                                    {task.description}
                                </p>
                            </div>

                            {/* Attachments */}
                            <div className="mb-6">
                                <p className="mb-2 text-xs text-gray-500">
                                    Attachments
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 rounded-md border p-2 hover:bg-gray-50">
                                        <File className="h-5 w-5 text-orange-500" />
                                        <div className="text-xs">
                                            <p>Presentation Material.pptx</p>
                                            <span className="text-gray-400">
                                                3.0 MB
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-md border p-2 hover:bg-gray-50">
                                        <FileText className="h-5 w-5 text-red-500" />
                                        <div className="text-xs">
                                            <p>Notes.pdf</p>
                                            <span className="text-gray-400">
                                                2.4 MB
                                            </span>
                                        </div>
                                    </div>
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
                                            {task.completed_subtasks_count}/
                                            {task.total_subtasks_count}
                                        </span>
                                    </div>

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

                                    {/* Scrollable Subtasks Container */}
                                    <div
                                        className="space-y-2 overflow-y-auto pr-2"
                                        style={{ maxHeight: maxSubtaskHeight }}
                                    >
                                        {task.sub_tasks.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="flex items-center gap-2"
                                            >
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

            {addSubTask && task && (
                <CreateSubTaskDialog
                    open={addSubTask}
                    onOpenChange={setAddSubTask}
                    task={task}
                    onSubTaskCreated={() => {
                        // Handle subtask creation - could reload data or update state
                        router.reload();
                    }}
                />
            )}
        </>
    );
}
