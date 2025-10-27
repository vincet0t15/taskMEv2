'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/types/task';
import {
    Calendar,
    CheckCircle2,
    Circle,
    File,
    FileText,
    Plus,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    Task: Task;
}

export default function TaskDetailDialog({ open, setOpen, Task }: Props) {
    const [subtasks] = useState([
        { id: 1, title: 'Creating presentation deck', completed: true },
        {
            id: 2,
            title: 'Review the presentation deck with Caroline',
            completed: false,
        },
    ]);

    const completedCount = subtasks.filter((s) => s.completed).length;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
                <div className="rounded-sm bg-white p-6 shadow-xl">
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {Task.title}
                            </h2>
                        </div>
                    </div>

                    {/* Status and Info */}
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-1 text-xs text-gray-500">Status</p>
                            <Badge className="bg-blue-100 text-blue-700">
                                On Progress
                            </Badge>
                        </div>
                        <div>
                            <p className="mb-1 text-xs text-gray-500">
                                Due Date
                            </p>
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                                <Calendar className="h-4 w-4" /> 25 November
                                2024
                            </div>
                        </div>
                        <div>
                            <p className="mb-1 text-xs text-gray-500">
                                Assignees
                            </p>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>IC</AvatarFallback>
                                </Avatar>
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>UL</AvatarFallback>
                                </Avatar>
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
                            <p className="mb-1 text-xs text-gray-500">Tag</p>
                            <Badge className="bg-yellow-100 text-yellow-700">
                                MEDIUM
                            </Badge>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <p className="mb-1 text-xs text-gray-500">
                            Description
                        </p>
                        <p className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                            At 27 November 2024, we will discuss our
                            collaboration with clients, please prepare for the
                            presentation material and notes for the moderator,
                            thanks!
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
                                <span className="ml-1 text-red-500">1</span>
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
                                    {completedCount}/{subtasks.length}
                                </span>
                            </div>
                            <Progress
                                value={(completedCount / subtasks.length) * 100}
                                className="mb-3"
                            />

                            <div className="space-y-2">
                                {subtasks.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="flex items-center gap-2"
                                    >
                                        {sub.completed ? (
                                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-gray-400" />
                                        )}
                                        <span
                                            className={`text-sm ${
                                                sub.completed
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
    );
}
