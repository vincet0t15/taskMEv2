'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

import { type BreadcrumbItem } from '@/types';
import { Task } from '@/types/task';
import { Head, useForm, usePage } from '@inertiajs/react';

import { CommentTypes } from '@/types/commet';
import { SubTaskInterface } from '@/types/subTask';
import { Calendar, CheckCircle2, Circle, File } from 'lucide-react';
import { useState } from 'react';

interface TaskDetailsProps {
    tasks: Task;
}

export default function TaskDetails({ tasks }: TaskDetailsProps) {
    const [openSubTaskDialog, setOpenSubTaskDialog] = useState(false);
    const [subTask, setSubTask] = useState<SubTaskInterface>();

    const getInitials = useInitials();
    const [addSubTaskDialog, setAddSubTaskDialog] = useState(false);
    const isOverdue = tasks.due_date && new Date(tasks.due_date) < new Date();
    const { auth } = usePage<any>().props;

    const { data, setData, post } = useForm<CommentTypes>({
        comment: '',
        task_id: tasks.id,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
    ];

    // Activity logs from the backend
    const activities = tasks.activities || [];

    const handleClickSubTask = (subTask: SubTaskInterface) => {
        setSubTask(subTask);
        setOpenSubTaskDialog(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={tasks.title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-6 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold text-gray-800 uppercase">
                            {tasks.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge
                                variant="secondary"
                                style={{
                                    backgroundColor: `${tasks.status.color}33`,
                                }}
                            >
                                {tasks.status.name}
                            </Badge>
                            <Badge
                                className="rounded-full"
                                variant="outline"
                                style={{
                                    backgroundColor: `${tasks.priority.color}33`,
                                }}
                            >
                                {tasks.priority.name}
                            </Badge>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-500">
                                    Due Date
                                </span>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span
                                        className={`${
                                            isOverdue
                                                ? 'text-red-500'
                                                : 'text-gray-800'
                                        }`}
                                    >
                                        {new Date(
                                            tasks.due_date,
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-b pb-6">
                    <span className="text-sm font-medium text-gray-500">
                        Assignees
                    </span>
                    <div className="flex items-center gap-3">
                        {tasks.assignees.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-xs font-medium text-blue-600">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-gray-800">
                                    {user.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                {tasks.description && (
                    <div className="border-b pb-6">
                        <span className="block text-sm font-medium text-gray-500">
                            Description
                        </span>
                        <p className="mt-2 rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
                            {tasks.description}
                        </p>
                    </div>
                )}

                {/* Attachments */}

                {tasks.attachments.length > 0 && (
                    <div className="mb-6">
                        <span className="text-sm font-medium text-gray-500">
                            Attachments
                        </span>
                        <div className="mt-2 flex gap-2">
                            {tasks.attachments.map((attachment, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50"
                                >
                                    {/* File Info */}
                                    <div className="flex items-center gap-3">
                                        <File className="h-5 w-5 text-orange-500" />
                                        <div className="text-xs">
                                            <p className="font-medium text-gray-800">
                                                {attachment.original_name}
                                            </p>
                                            <span className="text-gray-400">
                                                {attachment.file_size}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <Tabs defaultValue="subtasks" className="w-full">
                    {/* Subtasks Tab */}
                    <TabsContent value="subtasks">
                        <Card className="rounded-xl border border-gray-200 shadow-sm">
                            <CardContent className="space-y-4 p-4">
                                {/* Progress */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>
                                        Sub Tasks (
                                        {tasks.completed_subtasks_count}/
                                        {tasks.total_subtasks_count})
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

                                {/* Subtask List */}
                                <div className="mt-4 space-y-2">
                                    {tasks.sub_tasks.map((sub) => (
                                        <div
                                            onClick={() =>
                                                handleClickSubTask(sub)
                                            }
                                            key={sub.id}
                                            className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                {sub.status_id === 4 ? (
                                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-gray-400" />
                                                )}
                                                <span
                                                    className={`text-sm ${
                                                        sub.status_id === 4
                                                            ? 'text-gray-400 line-through'
                                                            : 'text-gray-800'
                                                    }`}
                                                >
                                                    {sub.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    style={{
                                                        color: sub.status.color,
                                                        borderColor:
                                                            sub.status.color,
                                                    }}
                                                >
                                                    {sub.status.name}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
